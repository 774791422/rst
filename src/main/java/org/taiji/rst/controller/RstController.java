package org.taiji.rst.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.aspectj.apache.bcel.generic.LineNumberGen;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.taiji.controller.BaseController;
import org.taiji.rst.dao.*;
import org.taiji.rst.pojo.AlarmReportMsg;
import org.taiji.rst.pojo.Channel_info;
import org.taiji.rst.pojo.HostSiteMonitor;
import org.taiji.rst.pojo.SyncTotal;
import org.taiji.util.DateUtil;
import org.taiji.util.ListSortMap;
import org.taiji.util.StringUtil;
import org.taiji.util.UnitUtils;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yfyuan on 2016/8/9.
 */
@RestController
@RequestMapping("/rst")
public class RstController extends BaseController {
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

    @RequestMapping(value = "/tbl", method = RequestMethod.GET)
    public String tbl() {
        Long zc_src_channel = channelServiceDao.selectZc_channel(0);//迪思杰正常源端通道
        Long zc_tar_channel = channelServiceDao.selectZc_channel(1);//迪思杰正常目标端通道
        Long src_channel = channelServiceDao.selectChannel(0);//迪思杰所有源端通道
        Long tar_channel = channelServiceDao.selectChannel(1);//迪思杰所有源端通道
        Long oracle_zc=channelServiceDao.oracle_zc();//oracle 所有的正常进程
        Long oracle_all=channelServiceDao.oracle_all();//oracle 所有进程
        BigDecimal divide = null;
        BigDecimal a = new BigDecimal(zc_src_channel + zc_src_channel+oracle_zc);
        BigDecimal b = new BigDecimal(src_channel + tar_channel+oracle_all);
        if(b.longValue()!=0){
            divide = a.divide(b, 2, BigDecimal.ROUND_CEILING);
        }else {
            divide=new BigDecimal(0);
        }
        BigDecimal setvalue = divide.multiply(new BigDecimal(100));
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("tbl", setvalue);
        return jsonObject.toString();
    }

    @RequestMapping(value = "/sync_num", method = RequestMethod.GET)
    public String sync_num(@RequestParam(name = "type") int type,@RequestParam(name = "datetime")String datetime) {
        Long l=rstAllADUDCountDao.selectByTypeDateTime(type,datetime);
        SyncTotal t=new SyncTotal();
        t.setType(type);
        t.setSyncNum(l);
        t.setSyncNumstr(UnitUtils.conversion(l==null?0L:l,2));
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sync_num", t);
        return jsonObject.toString();
    }

    @RequestMapping(value = "/service_num", method = RequestMethod.GET)
    public String service_num(@RequestParam(name = "datetime") String datetime) {
        List list = serviceNumDao.selectByService(datetime);
        list = ListSortMap.sortToMap(list, "sync_num", "asc");
        Long num = 0L;
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < list.size(); i++) {
            Map m = (Map) list.get(i);
            if (m.get("sync_num").toString() != null) {
                num += Long.parseLong(m.get("sync_num").toString());
            }
        }
        for (int i = 0; i < list.size(); i++) {
            Map m = (Map) list.get(i);
            if (i <= 3) {
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
                jsonArray.add(jsonObject);
            }
        }
        return jsonArray.toString();
    }

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

    @RequestMapping(value = "/sync_city_lj", method = RequestMethod.GET)
    public String sync_city_lj(@RequestParam(name = "datetime") String datetime) {
        String[] citys = {"省本级", "太原市", "大同市", "朔州市", "忻州市", "阳泉市", "吕梁市", "晋中市", "长治市", "晋城市", "临汾市", "运城市"};
        String[] city_nums = new String[citys.length];
        List citys_num = serviceNumDao.selectByCity("0", datetime);
        if (citys_num.size() > 0) {
            Map m = (Map) citys_num.get(0);
            for (int i = 0; i < citys.length; i++) {
                double num=Double.parseDouble( m.get(citys[i]).toString());
                double newNum = num / 100000000.0;
                String numStr = String.format("%.2f", newNum);
                city_nums[i] =numStr;
            }
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("xdata", citys);
        jsonObject.put("ydata", city_nums);
        return jsonObject.toString();
    }

    @RequestMapping(value = "/listGjxx", method = RequestMethod.POST)
    public PageInfo listGjxx(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                             @RequestParam(value = "pageSize", required = false, defaultValue = "5") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<AlarmReportMsg> list = this.alarmReportMsgDao.selectMsgList();
        PageInfo<AlarmReportMsg> page = new PageInfo<AlarmReportMsg>(list);
        return page;
    }

    @RequestMapping(value = "/listJkqk", method = RequestMethod.POST)
    public List listJkqk() {
        List<HostSiteMonitor> jkqkList = this.jkzjDao.selectAll();
        return jkqkList;
    }

    @RequestMapping(value = "/listTableChange", method = RequestMethod.POST)
    public PageInfo listTableChange(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                    @RequestParam(value = "pageSize", required = false, defaultValue = "7") int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Map> tableList = this.tableChannelCountDao.selectTableChangeList();
        PageInfo<Map> pageInfo = new PageInfo<Map>(tableList);
        return pageInfo;
    }

    @RequestMapping(value = "/listDayChange", method = RequestMethod.POST)
    public Map listDayChange() {
        Map map = new HashMap();
        List<Map> dayInfoList = this.syncCurrentDayInfoDao.selectDayChangeList();
        List<Map> dayList = this.syncCurrentDayInfoDao.selectDay();
        map.put("dayInfoList", dayInfoList);
        map.put("dayList", dayList);
        return map;
    }

    @RequestMapping(value = "/listMap", method = RequestMethod.POST)
    public List listMap() {
        List<Map> mapList = this.syncCurrentDayInfoDao.selectMap();
        return mapList;
    }

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
        for (int i = 0; i <citys.size() ; i++) {
            Map m= (Map) citys.get(i);
            Long gj=0L;
            if(m.get("city").equals("省本级")){
                gj=this.syncCurrentDayInfoDao.selectSxGaojingCount(m.get("service").toString());
            }else{
                gj=this.syncCurrentDayInfoDao.selectCityGaojingCount(m.get("city").toString(),m.get("service").toString());
            }
            m.put("state",gj);
        }
        citys=ListSortMap.sortToMap(citys,"sync_num","asc");
        return citys;
    }

    @RequestMapping(value = "/health", method = RequestMethod.GET)
    public Map health() {
        Long services = this.serviceNumDao.selectService();
        int run_day = 0;
        String startTime = "2019-01-01 00:00:00";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date endDateTime = new Date();
        Date startDateTime;
        try {
            startDateTime = sdf.parse(startTime);
            run_day = DateUtil.differentDays(startDateTime, endDateTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Map m = new HashMap();
        m.put("services", services);
        m.put("run_day", run_day);
        return m;
    }
    @RequestMapping(value = "/cityInfoMap", method = RequestMethod.GET)
    public JSONObject cityInfoMap() {
        JSONObject jsonObject=new JSONObject();
        List<Map> maps = this.syncCurrentDayInfoDao.listCity();
        String day = DateUtil.parseDateToStr(new Date(), "yyyy-MM-dd");
        for (Map map:maps) {
            List citys = new ArrayList();
            citys = this.syncCurrentDayInfoDao.cityServiceMap(day, map.get("city").toString());
            jsonObject.put(map.get("city").toString(),citys);
        }
        return jsonObject;
    }
    @RequestMapping(value = "/cityData", method = RequestMethod.GET)
    public Map cityData(@RequestParam(value = "city") String city) {
        Map m=new HashMap();
        Long l=this.serviceNumDao.cityData(city);
        if(l>0) {
            m.put("result", true);
        }else{
            m.put("result", false);
        }
        return m;
    }
}
