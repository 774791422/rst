package org.taiji.rst.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.taiji.controller.BaseController;
import org.taiji.rst.dao.*;
import org.taiji.rst.pojo.*;
import org.taiji.util.DateUtil;
import org.taiji.util.ListSortMap;
import org.taiji.util.StringUtil;
import org.taiji.util.UnitUtils;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yuys on 2016/8/9.
 * 地市controller
 */
@RestController
@RequestMapping("/rst/city")
public class RstCityController extends BaseController {
    public Logger LOG = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private ChannelServiceDao channelServiceDao;

    @Autowired
    private RstAllADUDCountDao rstAllADUDCountDao;

    @Autowired
    private ServiceNumDao serviceNumDao;

    @Autowired
    private AlarmReportMsgDao alarmReportMsgDao;

    @Autowired
    private JkzjDao jkzjDao;

    @Autowired
    private TableChannelCountDao tableChannelCountDao;

    @Autowired
    private SyncCurrentDayInfoDao syncCurrentDayInfoDao;

    @Autowired
    private CitySyncDao citySyncDao;

    /**
     * 同步率
     * @param city 地市
     * @return
     */
    @RequestMapping(value = "/tbl", method = RequestMethod.GET)
    public String tbl(@RequestParam(name = "city") String city) {
        BigDecimal divide = null;
        if (city.equals("省本级")) {//省本级通过迪思杰获取
            Long zc_src_channel = channelServiceDao.selectZc_channel(0);//迪思杰正常源端通道
            Long zc_tar_channel = channelServiceDao.selectZc_channel(1);//迪思杰正常目标端通道
            Long src_channel = channelServiceDao.selectChannel(0);//迪思杰所有源端通道
            Long tar_channel = channelServiceDao.selectChannel(1);//迪思杰所有源端通道
            BigDecimal a = new BigDecimal(zc_src_channel + zc_tar_channel);
            BigDecimal b = new BigDecimal(src_channel + tar_channel);
            if(b.longValue()!=0){
                divide = a.divide(b, 2, BigDecimal.ROUND_CEILING);//用此方法更精确
            }else {
                divide=new BigDecimal(0);
            }
        } else {//地市通过oracle 告警标获取进程是否正常
            Long oracle_zc = channelServiceDao.zcOracleCity(city);//oracle 所有的正常进程
            Long oracle_all = channelServiceDao.allOracleCity(city);//oracle 所有进程
            BigDecimal a = new BigDecimal(oracle_zc);
            BigDecimal b = new BigDecimal(oracle_all);
            if(b.longValue()!=0){
                divide = a.divide(b, 2, BigDecimal.ROUND_CEILING);
            }else {
                divide=new BigDecimal(0);
            }
        }
        BigDecimal setvalue = divide.multiply(new BigDecimal(100));//相乘100
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tbl", setvalue);
        return jsonObject.toString();
    }

    /**
     *
     * @param type 当天同步1，累计同步0
     * @param city 地市
     * @return
     */
    @RequestMapping(value = "/sync_num", method = RequestMethod.GET)
    public String sync_num(@RequestParam(name = "type") int type,
                           @RequestParam(name = "city") String city) {
        List<CitySyncNum> list = citySyncDao.selectCitySynNum(type, city);//根据type及city查询同步率 查询结果只为1条 多条为数据错误
        SyncTotal t = new SyncTotal();
        if(list.size()>0) {//查询到数据
            for (int i = 0; i < list.size(); i++) {
                t.setType(list.get(i).getIstoday());
                t.setSyncNumstr(UnitUtils.conversion(Long.valueOf(list.get(i).getSyncNum()), 2));
                t.setSyncNum(Long.valueOf(list.get(i).getSyncNum()));
            }
        }else{//当前地市无数据
            for (int i = 0; i < 1; i++) {
                t.setType(type);
                t.setSyncNumstr("0");
                t.setSyncNum(0L);
            }
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sync_num", t);
        return jsonObject.toString();
    }

    /**
     * 地市业务 当天同步量
     * @param city 地市
     * @return
     */
    @RequestMapping(value = "/service_num", method = RequestMethod.GET)
    public List service_num(@RequestParam(name = "city") String city) {
        List<Map<String, Object>> list = serviceNumDao.selectServiceByCity(city);//地市业务量
        list = ListSortMap.sortToMap(list, "sync_num", "asc");//排序  第二个字段 排序列 第三个字段 排序类型
        Long num = 0L;
        List resultList = new ArrayList();
        for (int i = 0; i < list.size(); i++) {
            Map m = (Map) list.get(i);
            if (m.get("sync_num").toString() != null) {
                num += Long.parseLong(m.get("sync_num").toString());
            }
        }
        for (int i = 0; i < list.size(); i++) {
            Map m = (Map) list.get(i);
            if (i <= 3) {//取出前4条展示
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("sync_num", m.get("sync_num"));
                jsonObject.put("name", m.get("service"));
                double sync_num = 0.0;
                BigDecimal setvalue = BigDecimal.valueOf(0);
                if (m.get("sync_num").toString() != null) {
                    sync_num = Double.parseDouble(m.get("sync_num").toString());
                    double d = sync_num / num;
                    BigDecimal b = new BigDecimal(d * 100);
                    setvalue = b.setScale(2, BigDecimal.ROUND_HALF_UP);
                }
                jsonObject.put("bl", setvalue);
                resultList.add(jsonObject);
            }
        }
        return resultList;
    }

    /**
     * 此方法地市没有用到
     * @param datetime
     * @return
     */
    @RequestMapping(value = "/sync_city_today", method = RequestMethod.GET)
    public String sync_city_today(@RequestParam(name = "datetime") String datetime) {
        String[] citys = {"省本级", "太原市", "大同市", "朔州市", "忻州市", "阳泉市", "吕梁市", "晋中市", "长治市", "晋城市", "临汾市", "运城市"};
        String[] city_nums = new String[citys.length];
        List citys_num = serviceNumDao.selectByCity("1", datetime);
        if (citys_num.size() > 0) {
            Map m = (Map) citys_num.get(0);
            for (int i = 0; i < citys.length; i++) {
                city_nums[i] = m.get(citys[i]).toString();
            }
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("xdata", citys);
        jsonObject.put("ydata", city_nums);
        return jsonObject.toString();
    }

    /**
     * 此方法地市没有用到
     * @param datetime
     * @return
     */
    @RequestMapping(value = "/sync_city_lj", method = RequestMethod.GET)
    public String sync_city_lj(@RequestParam(name = "datetime") String datetime) {
        String[] citys = {"省本级", "太原市", "大同市", "朔州市", "忻州市", "阳泉市", "吕梁市", "晋中市", "长治市", "晋城市", "临汾市", "运城市"};
        String[] city_nums = new String[citys.length];
        List citys_num = serviceNumDao.selectByCity("0", datetime);
        if (citys_num.size() > 0) {
            Map m = (Map) citys_num.get(0);
            for (int i = 0; i < citys.length; i++) {
                double num = Double.parseDouble(m.get(citys[i]).toString());
                double newNum = num / 100000000.0;
                String numStr = String.format("%.2f", newNum);
                city_nums[i] = numStr;
            }
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("xdata", citys);
        jsonObject.put("ydata", city_nums);
        return jsonObject.toString();
    }

    /**
     * 定时告警
     * @param pageNum 页码
     * @param pageSize 一页显示条数
     * @param city  地市
     * @return
     */
    @RequestMapping(value = "/listGjxx", method = RequestMethod.POST)
    public PageInfo listGjxx(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                             @RequestParam(value = "pageSize", required = false, defaultValue = "5") int pageSize,
                             @RequestParam(value = "city", required = true) String city) {
        PageHelper.startPage(pageNum, pageSize);
        List<AlarmReportMsg> list = this.alarmReportMsgDao.selectCityMsgList(city);
        PageInfo<AlarmReportMsg> page = new PageInfo<AlarmReportMsg>(list);
        return page;
    }

    /**
     * 主机监控情况
     * @param city  地市
     * @return
     */
    @RequestMapping(value = "/listJkqk", method = RequestMethod.POST)
    public List listJkqk(@RequestParam(value = "city", required = true) String city) {
        List<HostSiteMonitor> jkqkList = this.jkzjDao.selectJkqkByCity(city);
        return jkqkList;
    }

    /**
     * 表排行
     * @param pageNum
     * @param pageSize
     * @param city
     * @return
     */
    @RequestMapping(value = "/listTableChange", method = RequestMethod.POST)
    public PageInfo listTableChange(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                    @RequestParam(value = "pageSize", required = false, defaultValue = "7") int pageSize,
                                    @RequestParam(value = "city") String city) {
        PageHelper.startPage(pageNum, pageSize);
        List<Map> tableList = this.tableChannelCountDao.selectCityTableChangeList(city);
        PageInfo<Map> pageInfo = new PageInfo<Map>(tableList);
        return pageInfo;
    }

    /**
     * 近7天累加同步量
     * @param city
     * @return
     */
    @RequestMapping(value = "/listDayChange", method = RequestMethod.POST)
    public Map listDayChange(@RequestParam(name = "city") String city) {
        Map map = new HashMap();
        List<Map> dayInfoList = this.syncCurrentDayInfoDao.selectCityDayChangeList(city);
        List<Map> dayList = this.syncCurrentDayInfoDao.selectDay();
        map.put("dayInfoList", dayInfoList);
        map.put("dayList", dayList);
        return map;
    }

    /**
     *此方法 地市暂未使用
     * @return
     */
    @RequestMapping(value = "/listMap", method = RequestMethod.POST)
    public List listMap() {
        List<Map> mapList = this.syncCurrentDayInfoDao.selectMap();
        return mapList;
    }

    /**
     * 此方法地图暂无使用
     * @param city
     * @param datetime
     * @return
     */
    @RequestMapping(value = "/cityServiceMap", method = RequestMethod.GET)
    public List cityServiceMap(@RequestParam(value = "city") String city, @RequestParam(value = "datetime") String datetime) {
        List citys = new ArrayList();
        if (StringUtil.isNotEmpty(city)) {
            if (city.equals("省本级")) {
                citys = this.syncCurrentDayInfoDao.sxServiceMap(datetime);
            } else {
                citys = this.syncCurrentDayInfoDao.cityServiceMap(datetime, city);
            }
        } else {
            citys = this.syncCurrentDayInfoDao.shengServiceMap(datetime);
        }
        citys = ListSortMap.sortToMap(citys, "sync_num", "asc");
        return citys;
    }

    /**
     * 运行天数及当前地市的业务量
     * @param city
     * @return
     */
    @RequestMapping(value = "/health", method = RequestMethod.GET)
    public Map health(@RequestParam(name = "city") String city) {
        Long services = this.serviceNumDao.selectCityService(city);//地市业务数量
        long run_day = 0L;
        List<Map> runDayList=this.serviceNumDao.selectCityRunDay(city);//地市启动时间
        for (Map map:runDayList) {
            String day=map.get("run_date").toString();
            Date date = DateUtil.parseStrToDate(day, "yyyy-MM-dd");
            long now = new Date().getTime();
            long start=date.getTime();
            long nd = 24 * 60 * 60 *1000;
            run_day=(now-start)/nd;//算出相差时间
        }
        Map m = new HashMap();
        m.put("services", services);
        m.put("run_day", run_day);
        return m;
    }

    /**
     * 此方法地市暂无使用
     * @return
     */
    @RequestMapping(value = "/cityInfoMap", method = RequestMethod.GET)
    public JSONObject cityInfoMap() {
        JSONObject jsonObject = new JSONObject();
        List<Map> maps = this.syncCurrentDayInfoDao.listCity();
        String day = DateUtil.parseDateToStr(new Date(), "yyyy-MM-dd");
        for (Map map : maps) {
            List citys = new ArrayList();
            citys = this.syncCurrentDayInfoDao.cityServiceMap(day, map.get("city").toString());
            jsonObject.put(map.get("city").toString(), citys);
        }
        return jsonObject;
    }

    /**
     * 地市累计表操作记录
     * @param city
     * @return
     */
    @RequestMapping(value = "/table_change", method = RequestMethod.GET)
    public Map table_change(@RequestParam(value = "city") String city) {
        List list = new ArrayList();
        String[] xdata = {"新增", "修改", "删除"};
        String[] ydata = new String[xdata.length];
        Map datMap = this.tableChannelCountDao.table_change(city);
        Map data = new HashMap();
        if (datMap != null) {
            for (int i = 0; i < xdata.length; i++) {
                if (i == 0) {
                    ydata[i] = datMap.get("tar_insert_num") == null ? "0" : datMap.get("tar_insert_num").toString();
                }
                if (i == 1) {
                    ydata[i] = datMap.get("tar_update_num") == null ? "0" : datMap.get("tar_update_num").toString();
                }
                if (i == 2) {
                    ydata[i] = datMap.get("tar_delete_num") == null ? "0" : datMap.get("tar_delete_num").toString();
                }
            }
        }
        data.put("xdata", xdata);
        data.put("ydata", ydata);
        return data;
    }

    /**
     * 累计业务top5
     * @param city
     * @return
     */
    @RequestMapping(value = "/service_lj", method = RequestMethod.GET)
    public Map service_lj(@RequestParam(value = "city") String city) {
        List list = this.serviceNumDao.selectCityServiceLj(city);
        list = ListSortMap.sortToMap(list, "sync_num", "asc");//排序
        if (list.size() > 6) {//判断list长度
            list = list.subList(0, 5);//取前五条数据
        } else {
            list = list;
        }
        String[] xdata = new String[list.size()];
        String[] ydata = new String[list.size()];
        for (int i = 0; i < list.size(); i++) {
            Map m = new HashMap();
            m= (Map) list.get(i);
            xdata[i] = m.get("sync_num").toString();
            ydata[i] = m.get("service").toString();
        }
        Map map = new HashMap();
        map.put("xdata", xdata);
        map.put("ydata", ydata);
        return map;
    }
}
