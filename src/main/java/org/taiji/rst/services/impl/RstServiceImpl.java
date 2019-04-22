package org.taiji.rst.services.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.taiji.rst.dao.*;
import org.taiji.rst.pojo.*;
import org.taiji.system.MultipleDataSource;
import org.taiji.util.DateUtil;
import org.taiji.util.MaptoUpperCaseUtils;
import org.taiji.util.UnitUtils;
import org.taiji.util.webservice.HttpWebServiceUtil;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RstServiceImpl {
    public Logger LOG = LoggerFactory.getLogger(this.getClass());

    private RstAllADUDCountDao rstAllADUDCountDao;

    private AlarmReportMsgDao alarmReportMsgDao;

    private TableChannelCountDao tableChannelCountDao;

    private TableOracleCountDao tableOracleCountDao;

    private ChannelServiceDao channelServiceDao;

    private SyncCurrentDayInfoDao syncCurrentDayInfoDao;

    private ServiceNumDao  serviceNumDao;

    private HostServiceDao  hostServiceDao;

    private NodeInfoServiceDao  nodeInfoServiceDao;

    private CshNumServiceDao  cshNumServiceDao;

    private CitySyncDao  citySyncDao;

    private  CitySyncServiceDao citySyncServiceDao;

    private AconprocsbServiceDao aconprocsbServiceDao;

    String url = "http://192.167.121.10:8080/dmp/ws";
    String qname = "http://webservice.dmp.dsg.com/";
    String userName = "taiji";
    String password = "Taiji@123";
    String param = "";
    String wsmethod = "";

    /**
     * 累计同比量
     */
    public void getAllADUCount() {
        url = url + "/syncInfoReportServer?wsdl";//DSG 累计同步量接口
        param="{}";//参数
        wsmethod = "getAllSyncCount";//方法
        ClassLoader cl = Thread.currentThread().getContextClassLoader();//线程避免多次调用报错
        Map map = HttpWebServiceUtil.invoke(url, userName, password, qname, param, wsmethod,cl);
        if (map.get("status").toString().equals("200")) {//成功
            JSONObject jasonObject = JSONObject.parseObject(map.get("result").toString());//获取成功后数据
            JSONArray jsonArray= jasonObject.getJSONArray("result");
            Map m = (Map) jsonArray.get(0);
            insertAllADUDCount(m);//入库方法
            LOG.info("DSG累计同步量完成");
        } else {
            LOG.error(map.get("url").toString());
            LOG.error(map.get("error").toString());
            LOG.error("累计同步量接口异常");
        }
    }

    /**
     * 今日同步量
     */
    public void syncCurrentDayInfo() {
        url = url + "/syncInfoReportServer?wsdl";//DSG 累计同步量接口
        wsmethod = "syncCurrentDayInfo";//方法
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        Map map = HttpWebServiceUtil.invoke(url, userName, password, qname, param, wsmethod,cl);
        if (map.get("status").toString().equals("200")) {
            JSONObject jasonObject = JSONObject.parseObject(map.get("result").toString());
            insertSyncDayInfo(jasonObject);//入库今日同步量
            LOG.info("DSG今日同步量完成");
        } else {
            LOG.error(map.get("url").toString());
            LOG.error(map.get("error").toString());
            LOG.error("今日同步量接口异常");
        }
    }

    /**
     * 告警信息
     */
    public void getAlarmReportMsg() {
        url = url + "/alarmReportServer?wsdl";//DSG 告警接口
        wsmethod = "getAlarmReportMsg";//请求访问
        String startDate = DateUtil.parseDateToStr(new Date(), DateUtil.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS);
        Date d = DateUtil.addDate(new Date(), 0, 0, -1, 0, 0, 0, 0);//前一天日期
        String endDate = DateUtil.parseDateToStr(d, DateUtil.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS);
        param = "{\"startDate\":\"" + endDate + "\",\"endDate\":\"" + startDate + "\"}";
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        Map map = HttpWebServiceUtil.invoke(url, userName, password, qname, param, wsmethod,cl);
        if (map.get("status").toString().equals("200")) {
            JSONObject jasonObject = JSONObject.parseObject(map.get("result").toString());
            insertAlarmReportMsg(jasonObject);//告警循环
            LOG.info("DSG告警信息完成");
        } else {
            LOG.error(map.get("url").toString());
            LOG.error(map.get("error").toString());
            LOG.error("告警信息接口异常");
        }
    }
    /**
     * 通道接口
     */
    public void  channel (){
        url = url + "/channelConfigServer?wsdl";//DSG通道信息接口
        wsmethod = "list";//方法
        param="{}";
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        Map map = HttpWebServiceUtil.invoke(url, userName, password, qname, param, wsmethod,cl);
        if (map.get("status").toString().equals("200")) {
            JSONObject jasonObject = JSONObject.parseObject(map.get("result").toString());
            insertChannel(jasonObject);//通过接口获取的通道数据循环
            LOG.info("DSG通道接口完成");
        } else {
            LOG.error(map.get("url").toString());
            LOG.error(map.get("error").toString());
            LOG.error("通道接口接口异常");
        }
    }
    /**
     * 累计表变化量统计
     */
    public void getChannelCount() {
        url = url + "/channelConfigServer?wsdl";
        wsmethod = "getChannelCount";
        param=null;
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        Map map = HttpWebServiceUtil.invoke(url, userName, password, qname, param, wsmethod,cl);
        if (map.get("status").toString().equals("200")) {
            JSONObject jasonObject = JSONObject.parseObject(map.get("result").toString());
            insertChannelCount(jasonObject);//通过接口获取通道同步量数据循环
            LOG.info("DSG累计表变化量统计完成");
        } else {
            LOG.error(map.get("url").toString());
            LOG.error(map.get("error").toString());
            LOG.error("累计表变化量接口异常");
        }
    }
    /**
     * oracle 同步mysql
     */
    public void oracle_init_sync(){
        MultipleDataSource.setDataSourceKey("otherDataSource");//切换数据源 oracle 数据源
        List list=serviceNumDao.selectNodeInfo_oracle();
        List list1=serviceNumDao.selectChs_num_oracle();
        List list2=serviceNumDao.selectCODESTRING_oracle();
        MultipleDataSource.setDataSourceKey("masterDataSource");//切换回默认数据源  mysql 数据源
        node_info(list);//执行2遍 第一遍从orcale取数据
        node_info(list);//第二遍 匹配通道序号
        host(list2);//从oracle 同步codestring 信息到mysql
        cshn(list1);//从oracle 同步到csh_num 初始化数据到mysql
        LOG.info("oracle 地市NodeInfo、chs_num、codestring基本信息表同步完成");

   }
    /**
     * oracle 今日同步量
     */
    public void oracle_today_sync(){
        MultipleDataSource.setDataSourceKey("otherDataSource");
        String date_time=DateUtil.parseDateToStr(new Date(),DateUtil.DATE_FORMAT_YYYY_MM_DD);
        List list= serviceNumDao.selectSyncToDayOracle(date_time);//获取当天同步量
        MultipleDataSource.setDataSourceKey("masterDataSource");
        for (int i = 0; i <list.size() ; i++) {
            Map map= (Map) list.get(i);
            map= MaptoUpperCaseUtils.transformUpperCase(map);//统一将key转换成大小并且"_"去掉
            String code=map.get("ERNAME").toString();//进程号
            List l=serviceNumDao.selectCity(code);//通过进程查询地市及业务
            Map m=new HashMap();
            if(l.size()>0) {
                m=(Map) l.get(0);
                String city =m.get("city").toString();
                if(city.lastIndexOf("市")==-1){
                    city=city+"市";
                }
                insertintocity(date_time,city,1,map);//城市同步量入库代码
                insertintocityService(code,date_time,city,map);//地市业务同步量
            }
        }
        LOG.info("oracle 地市今日同步量完成");
    }

    /**
     * oracle 累计表变化量
     */
    public void oracle_table_bj(){
        MultipleDataSource.setDataSourceKey("otherDataSource");
        List<Map> tables=this.tableOracleCountDao.selectOracleTable();
        for (int i = 0; i < tables.size(); i++) {
            Map m=tables.get(i);
            insertOracleTable(m);//oracle 同步数据表变化
    }
        LOG.info("oracle 累计表变化完成");
    }

    /**
     * oracle 同步数据表变化
     * @param m
     */
    private void insertOracleTable(Map m) {
        MultipleDataSource.setDataSourceKey("masterDataSource");
        String tableName=m.get("TB_NAME").toString();
        List<TableOracleCount> tables=this.tableOracleCountDao.selectByOracleTableOne(tableName);
        TableOracleCount tableOracleCount=new TableOracleCount();
        tableOracleCount.setTableName(tableName);
        tableOracleCount.setErName(m.get("ER_NAME").toString());
        tableOracleCount.setTableOpTm(m.get("OP_TM").toString());
        tableOracleCount.setTarDeleteNum(Long.parseLong(m.get("TB_DELETE").toString()));
        tableOracleCount.setTarInsertNum(Long.parseLong(m.get("TB_INSERT").toString()));
        tableOracleCount.setTarUpdateNum(Long.parseLong(m.get("TB_UPDATE").toString()));
        if(tables.size()>0){
            tableOracleCount.setId(tables.get(0).getId());
            this.tableOracleCountDao.updateByPrimaryKey(tableOracleCount);
        }else{
            this.tableOracleCountDao.insert(tableOracleCount);
        }
    }

    /**
     * oracle 累计同步量
     */
    public void oracle_lj_sync(){
        MultipleDataSource.setDataSourceKey("otherDataSource");
        String date_time=DateUtil.parseDateToStr(new Date(),DateUtil.DATE_FORMAT_YYYY_MM_DD);
        List list= serviceNumDao.selectSyncToDayOracle(date_time);
        MultipleDataSource.setDataSourceKey("masterDataSource");
        Map<String,Double> cityMap=serviceNumDao.selectCityLj();
        for (int i = 0; i <list.size() ; i++) {
            Map map= (Map) list.get(i);
            map= MaptoUpperCaseUtils.transformUpperCase(map);
            String code=map.get("ERNAME").toString();
            List l=serviceNumDao.selectCity(code);
            Map m=new HashMap();
            if(l.size()>0) {
                m=(Map) l.get(0);
                String city =m.get("city").toString();
                if(city.lastIndexOf("市")==-1){
                    city=city+"市";
                }
                Date nowDate=DateUtil.parseStrToDate(date_time,DateUtil.DATE_FORMAT_YYYY_MM_DD);
                Long num=selectCityNum(cityMap.get(city).longValue(),nowDate,city);//查询上一天城市累计量
                num=num+Long.parseLong(map.get("NUM").toString());
                map.put("NUM",num);
                insertintocity(date_time,city,0,map);
            }
        }
        LOG.info("oracle 地市累计同步量完成");
    }

    /**
     * oracle 告警
     */
    public void oracle_gjxx(){
        MultipleDataSource.setDataSourceKey("otherDataSource");
        List list=aconprocsbServiceDao.selectByGaojing();
        for (int i = 0; i <list.size() ; i++) {
            Map m= (Map) list.get(i);
            insertOracleGaoji(m);//地市oracle告警入库
        }
        LOG.info("oracle 地市告警同步完成");
    }

    /**
     * 地市oracle告警入库
     * @param m
     */
    private void insertOracleGaoji(Map m) {
        m= MaptoUpperCaseUtils.transformUpperCase(m);
        String uristring=m.get("URISTRING").toString();
        MultipleDataSource.setDataSourceKey("masterDataSource");
        Aconprocsb aconprocsb=new Aconprocsb();
        aconprocsb.setAgenttimestamp(m.get("AGENTTIMESTAMP")==null?"":m.get("AGENTTIMESTAMP").toString());
        aconprocsb.setCommonname(m.get("COMMONNAME")==null?"":m.get("COMMONNAME").toString());
        aconprocsb.setDatasource(m.get("DATASOURCE")==null?"":m.get("DATASOURCE").toString());
        aconprocsb.setDatasourcetype(m.get("DATASOURCETYPE")==null?"":m.get("DATASOURCETYPE").toString());
        aconprocsb.setLastcheckpointlag(m.get("LASTCHECKPOINTLAG")==null?"":m.get("LASTCHECKPOINTLAG").toString());
        aconprocsb.setLastrecordtime(m.get("LASTRECORDTIME")==null?"":m.get("LASTRECORDTIME").toString());
        aconprocsb.setParamfile(m.get("PARAMFILE")==null?"":m.get("PARAMFILE").toString());
        aconprocsb.setProcessname(m.get("PROCESSNAME")==null?"":m.get("PROCESSNAME").toString());
        aconprocsb.setProcesstype(m.get("PROCESSTYPE")==null?"":m.get("PROCESSTYPE").toString());
        aconprocsb.setTandemcpu(Integer.parseInt(m.get("TANDEMCPU").toString()));
        aconprocsb.setTandempriority(Integer.parseInt(m.get("TANDEMPRIORITY").toString()));
        aconprocsb.setTaskdesc(m.get("TASKDESC")==null?"":m.get("TASKDESC").toString());
        aconprocsb.setTasktype(m.get("TASKTYPE")==null?"":m.get("TASKTYPE").toString());
        aconprocsb.setUristring(m.get("URISTRING")==null?"":m.get("URISTRING").toString());
        aconprocsb.setTandemprocess(m.get("TANDEMPROCESS")==null?"":m.get("TANDEMPROCESS").toString());
        aconprocsb.setStatustimestamp(m.get("STATUSTIMESTAMP")==null?"":m.get("STATUSTIMESTAMP").toString());
        aconprocsb.setLaststatus(m.get("LASTSTATUS")==null?"":m.get("LASTSTATUS").toString());
        List<Aconprocsb> l=aconprocsbServiceDao.selectByUriString(uristring);
        if(l.size()>0){
             aconprocsb.setId(l.get(0).getId());
            aconprocsbServiceDao.updateByPrimaryKey(aconprocsb);
        }else{
            aconprocsbServiceDao.insert(aconprocsb);
        }
    }

    /**
     * 查找城市累计同步量
     *
     * @param city_num
     * @param city
     * @return
     */
    private Long selectCityNum(long city_num, Date date, String city) {
        BigDecimal c=serviceNumDao.selectCityCount(city);
        Long num=0L;
        if(c.longValue()==0){
            num=city_num;
        }else {
            Date d=DateUtil.addDate(date,0,0,-1,0,0,0,0);
            String date_time=DateUtil.parseDateToStr(d,DateUtil.DATE_FORMAT_YYYY_MM_DD);
            num=serviceNumDao.selectCityNum(city,date_time);
            if(num==null||num==0){
                num=city_num;
            }
        }
      return num;
    }

    /**
     * 地市业务同步量
     * @param code
     * @param date_time
     * @param city
     * @param map
     */
    private void insertintocityService(String code, String date_time, String city, Map map) {
        map= MaptoUpperCaseUtils.transformUpperCase(map);
        List<CitySyncService> citys=citySyncServiceDao.selectCityToDay(code,date_time);
        CitySyncService citySyncNum=new CitySyncService();
        citySyncNum.setCity(city);
        citySyncNum.setSynctime(date_time);
        citySyncNum.setServiceCode(code);
        citySyncNum.setSyncNum(Long.parseLong(map.get("NUM").toString()));
        if(citys.size()>0){
            citySyncNum.setId(citys.get(0).getId());
            citySyncServiceDao.updateByPrimaryKey(citySyncNum);
        }else{
            citySyncServiceDao.insert(citySyncNum);
        }
    }

    /**
     * 城市同步量入库代码
     * @param date_time
     * @param city
     * @param istoday
     * @param map
     */
    private void insertintocity(String date_time,String city,int istoday,Map map){
        map= MaptoUpperCaseUtils.transformUpperCase(map);
        List<Map> citys=serviceNumDao.selectCityToDay(city,date_time,istoday);
        CitySyncNum citySyncNum=new CitySyncNum();
        citySyncNum.setCity(city);
        citySyncNum.setSynctime(date_time);
        citySyncNum.setIstoday(istoday);
        citySyncNum.setSyncNum(Long.parseLong(map.get("NUM").toString()));
        if(citys.size()>0){
            citySyncNum.setId(Long.parseLong(citys.get(0).get("id").toString()));
            citySyncDao.updateByPrimaryKey(citySyncNum);
        }else{
            citySyncDao.insert(citySyncNum);
        }
    }

    /**
     * 从oracle 同步codestring 信息到mysql
     * @param list2
     */
    private void host(List list2) {
        for (int i = 0; i < list2.size(); i++) {
            Map map= (Map) list2.get(i);
            map= MaptoUpperCaseUtils.transformUpperCase(map);//统一将key转换成大小并且"_"去掉
            List<HostSerivce> l= hostServiceDao.selectByCityCode(map.get("CITYSERVICECODE").toString(),map.get("CITY").toString(),map.get("COMMONNAME").toString(),map.get("SERVICE").toString());
            HostSerivce host=new  HostSerivce();
            host.setCity(map.get("CITY").toString());
            host.setCommonname(map.get("COMMONNAME").toString());
            host.setService(map.get("SERVICE").toString());
            host.setService_code(map.get("CITYSERVICECODE").toString());
            if(l.size()>0){
                host.setId(l.get(0).getId());
                hostServiceDao.updateByPrimaryKey(host);
            }else{
                hostServiceDao.insert(host);
            }
        }
    }

    /**
     * cshn_num 从oracle 同步到mysql 中
     * @param list1
     */
    public void cshn(List list1){
        for (int i = 0; i < list1.size(); i++) {
            Map map= (Map) list1.get(i);
            map= MaptoUpperCaseUtils.transformUpperCase(map);
            List<CshNum> l= cshNumServiceDao.selectByCityCode(map.get("CITY").toString(),map.get("SERVICE").toString());
            CshNum cshn=new  CshNum();
            cshn.setCity(map.get("CITY").toString());
            cshn.setCshNum(map.get("CSHNUM").toString());
            cshn.setService(map.get("SERVICE").toString());
            if(l.size()>0){
                cshn.setId(l.get(0).getId());
                cshNumServiceDao.updateByPrimaryKey(cshn);
            }else{
                cshNumServiceDao.insert(cshn);
            }
        }
    }

    /**
     * 执行2遍 第一遍从orcale取数据 第二遍通过DSG接口匹配通道id
     * @param list
     */
    public void node_info(List list){
        for (int i = 0; i < list.size(); i++) {
            Map map= (Map) list.get(i);
            map= MaptoUpperCaseUtils.transformUpperCase(map);
            List l= serviceNumDao.selectByNodeName(map.get("NODENAME").toString());
            NodeInfo info=new NodeInfo();
            info.setNodeAlias(map.get("NODEALIAS").toString());
            info.setNodeName(map.get("NODENAME").toString());
            info.setSrcHostip(map.get("SRCHOSTIP").toString());
            info.setTargetHost(map.get("TARGETHOST").toString());
            if(l.size()>0){
                Map m= (Map) l.get(0);
                info.setId(Long.parseLong(m.get("id").toString()));
                info.setNodeId(m.get("cid").toString());
                nodeInfoServiceDao.updateByPrimaryKey(info);
            }else{
                nodeInfoServiceDao.insert(info);
            }
        }
    }


    /**
     * 通过接口获取的通道数据循环
     * @param jasonObject
     */
    private void insertChannel(JSONObject jasonObject) {
        JSONArray jasonArray = jasonObject.getJSONArray("result");
        for (int i = 0; i < jasonArray.size(); i++) {
            JSONObject obj = (JSONObject) jasonArray.get(i);
            JSONArray jsonArray = obj.getJSONArray("rows");
            for (int j = 0; j < jsonArray.size(); j++) {
                JSONObject jsonObject = (JSONObject) jsonArray.get(j);
                insertintoChannl(jsonObject);//通道基本信息入库
            }
        }
    }

    /**
     * 通道基本信息入库
     * @param jsonObject
     */
    private void insertintoChannl(JSONObject jsonObject) {
        String cid = jsonObject.get("cid").toString();
        List<Channel_info> list = channelServiceDao.selectByCid(cid);
        Channel_info chnl=new Channel_info();
        chnl.setChnlAliasName(jsonObject.get("chnlAliasName").toString());
        chnl.setChnlName(jsonObject.get("chnlName").toString());
        chnl.setCid(jsonObject.get("cid").toString());
        chnl.setDestProcStatus(jsonObject.get("destProcStatus").toString());
        chnl.setSrcAoxdPort(jsonObject.get("srcAoxdPort").toString());
        chnl.setSrcConfigDir(jsonObject.get("srcConfigDir").toString());
        chnl.setSrcDbType(jsonObject.get("srcDbType").toString());
        chnl.setSrcDbpsPort(jsonObject.get("srcDbpsPort").toString());
        chnl.setSrcDiskSize(jsonObject.get("srcDiskSize").toString());
        chnl.setSrcHome(jsonObject.get("srcHome").toString());
        chnl.setSrcNick(jsonObject.get("srcNick").toString());
        chnl.setSrcNickName(jsonObject.get("srcNickName").toString());
        chnl.setSrcOxadPort(jsonObject.get("srcOxadPort").toString());
        chnl.setSrcProcStatus(jsonObject.get("srcProcStatus").toString());
        chnl.setSrcReportTime(DateUtil.strToDate(jsonObject.get("srcReportTime").toString()));
        chnl.setSrcUsedDiskSize(jsonObject.get("srcUsedDiskSize").toString());
        chnl.setSrcVagentPort(jsonObject.get("srcVagentPort").toString());
        chnl.setTargetConfigDir(jsonObject.get("targetConfigDir").toString());
        chnl.setTargetDbType(jsonObject.get("targetDbType").toString());
        chnl.setTargetHome(jsonObject.get("targetHome").toString());
        chnl.setTargetNick(jsonObject.get("targetNick").toString());
        chnl.setTargetNickName(jsonObject.get("targetNickName").toString());
        chnl.setTargetUsedDiskSize(jsonObject.get("targetUsedDiskSize").toString());
        chnl.setTargetVagentPort(jsonObject.get("targetVagentPort").toString());
        chnl.setTargetReportTime(DateUtil.strToDate(jsonObject.get("targetReportTime").toString()));
        if (list.size() != 0) {
            chnl.setId(list.get(0).getId());
            channelServiceDao.updateByPrimaryKey(chnl);
        } else {
            channelServiceDao.insert(chnl);
        }
    }


    /**
     * 通过接口获取通道同步量数据循环
     * @param jasonObject
     */
    private void insertChannelCount(JSONObject jasonObject) {
        JSONArray jasonArray = jasonObject.getJSONArray("result");
        for (int i = 0; i < jasonArray.size(); i++) {
            JSONObject obj = (JSONObject) jasonArray.get(i);
            insertChannelCountTable(obj);//通道同步量入库
        }
    }

    /**
     * 通道同步量入库
     * @param obj
     */
    private void insertChannelCountTable(JSONObject obj) {
        String tableName=obj.get("tableName").toString();
        List<TableChannelCount> list = tableChannelCountDao.selectByTableName(tableName);
        TableChannelCount tableChannelCount=new TableChannelCount();
        tableChannelCount.setNodeId(obj.get("tableName").toString());
        tableChannelCount.setNodeName(obj.get("nodeName").toString());
        tableChannelCount.setSrcTargetId(obj.get("srcTargetId").toString());
        tableChannelCount.setTableName(obj.get("tableName").toString());
        tableChannelCount.setTarDdlNum(Long.parseLong(obj.get("tarDDLNum").toString()));
        tableChannelCount.setTarDeleteNum(Long.parseLong(obj.get("tarDeleteNum").toString()));
        tableChannelCount.setTarInsertNum(Long.parseLong(obj.get("tarInsertNum").toString()));
        tableChannelCount.setTarUpdateNum(Long.parseLong(obj.get("tarUpdateNum").toString()));
        tableChannelCount.setUsername(obj.get("username").toString());
        if (list.size() != 0) {
            tableChannelCount.setId(list.get(0).getId());
            tableChannelCountDao.updateByPrimaryKey(tableChannelCount);
        } else {
            tableChannelCountDao.insert(tableChannelCount);
        }

    }

    /**
     * 通过接口获取的数据
     * @param jasonObject
     */
    private void insertAlarmReportMsg(JSONObject jasonObject) {
        JSONArray jasonArray = jasonObject.getJSONArray("result");
        for (int i = 0; i < jasonArray.size(); i++) {
            JSONObject obj = (JSONObject) jasonArray.get(i);
            JSONArray jsonArray = obj.getJSONArray("rows");
            for (int j = 0; j < jsonArray.size(); j++) {
                JSONObject jsonObject = (JSONObject) jsonArray.get(j);
                insertAlarmMsg(jsonObject);//告警入库
            }
        }
    }

    /**
     * 告警入库
     * @param jsonObject
     */
    private void insertAlarmMsg(JSONObject jsonObject) {
        String meId = jsonObject.get("meId").toString();
        List<AlarmReportMsg> list = alarmReportMsgDao.selectByMeId(meId);
        AlarmReportMsg arm=new AlarmReportMsg();
        arm.setChnlName(jsonObject.get("chnlName").toString());
        arm.setDeviceIp(jsonObject.get("deviceIp").toString());
        arm.setDeviceName(jsonObject.get("deviceName").toString());
        arm.setExCount(jsonObject.get("exCount").toString());
        arm.setExMsg(jsonObject.get("exMsg").toString());
        arm.setExStatus(jsonObject.get("exStatus").toString());
        arm.setRecTime(DateUtil.parseStrToDate(jsonObject.get("recTime").toString(), DateUtil.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS));
        arm.setUpdateTime(DateUtil.parseStrToDate(jsonObject.get("updateTime").toString(), DateUtil.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS));
        arm.setMeId(jsonObject.get("meId").toString());
        if (list.size() != 0) {
             arm.setId(list.get(0).getId());
            alarmReportMsgDao.updateByPrimaryKey(arm);
        } else {
            alarmReportMsgDao.insert(arm);
        }
    }

    /**
     * 今日同步量
     * @param jasonObject
     */
    private void insertSyncDayInfo(JSONObject jasonObject) {
        Long num = 0L;
        JSONArray jasonArray = jasonObject.getJSONArray("result");
        for (int i = 0; i < jasonArray.size(); i++) {
            JSONArray josnArray = jasonArray.getJSONArray(i);
            for (int j = 0; j < josnArray.size(); j++) {
                JSONObject obj = (JSONObject) josnArray.get(j);
                insertSyncDayTable(obj);
                if (obj.get("syncNum") != null) {
                    num += Long.parseLong(obj.get("syncNum").toString());
                }
            }
        }
        Map map=new HashMap();
        map.put("NUM",num);
        insertintocity(DateUtil.parseDateToStr(new Date(),DateUtil.DATE_FORMAT_YYYY_MM_DD),"省本级",1,map);//入库地市同步量表
        List<SyncTotal> list = rstAllADUDCountDao.selectByType(1);
        SyncTotal total=new SyncTotal();
        total.setType(1);
        total.setSyncNum(num);
        total.setSyncNumstr(UnitUtils.conversion(num, 2));
        if (list.size() != 0) {
            total.setId(list.get(0).getId());
            rstAllADUDCountDao.updateByPrimaryKey(total);
        } else {
            rstAllADUDCountDao.insert(total);
        }

    }

    /**
     * 当天oracle_lj_sync同步量入库
     * @param obj
     */
    private void insertSyncDayTable(JSONObject obj) {
        String node_id=obj.get("nodeId").toString();
        String date_time=DateUtil.parseDateToStr(new Date(),DateUtil.DATE_FORMAT_YYYY_MM_DD);
        List<SyncCurrentDayInfo> list = syncCurrentDayInfoDao.selectBySyncDay(node_id,date_time);
        SyncCurrentDayInfo  info=new SyncCurrentDayInfo();
        info.setNodeId(Long.parseLong(node_id));
        info.setNodeName(obj.get("nodeName").toString());
        info.setSyncDate(date_time);
        info.setSyncNum(Long.parseLong(obj.get("syncNum").toString()));
        if (list.size() != 0) {
            info.setId(list.get(0).getId());
            syncCurrentDayInfoDao.updateByPrimaryKey(info);
        } else {
           syncCurrentDayInfoDao.insert(info);
        }
    }

    /**
     * 累计入库
     * @param m
     */
    public void insertAllADUDCount(Map m) {
        Map map=new HashMap();
        map.put("NUM",Long.parseLong(m.get("syncNum").toString()));
        insertintocity(DateUtil.parseDateToStr(new Date(),DateUtil.DATE_FORMAT_YYYY_MM_DD),"省本级",0,map);
        List<SyncTotal> list = rstAllADUDCountDao.selectByType(0);
        SyncTotal total=new SyncTotal();
        total.setSyncNum(Long.parseLong(m.get("syncNum").toString()));
        total.setSyncNumstr(UnitUtils.conversion(Long.parseLong(m.get("syncNum").toString()), 2));
        total.setType(0);
        if (list.size() != 0) {
            total.setId(list.get(0).getId());
            rstAllADUDCountDao.updateByPrimaryKey(total);
        } else {
            rstAllADUDCountDao.insert(total);
        }
    }

    public RstAllADUDCountDao getRstAllADUDCountDao() {
        return rstAllADUDCountDao;
    }

    public void setRstAllADUDCountDao(RstAllADUDCountDao rstAllADUDCountDao) {
        this.rstAllADUDCountDao = rstAllADUDCountDao;
    }

    public AlarmReportMsgDao getAlarmReportMsgDao() {
        return alarmReportMsgDao;
    }

    public void setAlarmReportMsgDao(AlarmReportMsgDao alarmReportMsgDao) {
        this.alarmReportMsgDao = alarmReportMsgDao;
    }

    public TableChannelCountDao getTableChannelCountDao() {
        return tableChannelCountDao;
    }

    public void setTableChannelCountDao(TableChannelCountDao tableChannelCountDao) {
        this.tableChannelCountDao = tableChannelCountDao;
    }

    public ChannelServiceDao getChannelServiceDao() {
        return channelServiceDao;
    }

    public void setChannelServiceDao(ChannelServiceDao channelServiceDao) {
        this.channelServiceDao = channelServiceDao;
    }

    public SyncCurrentDayInfoDao getSyncCurrentDayInfoDao() {
        return syncCurrentDayInfoDao;
    }

    public void setSyncCurrentDayInfoDao(SyncCurrentDayInfoDao syncCurrentDayInfoDao) {
        this.syncCurrentDayInfoDao = syncCurrentDayInfoDao;
    }

    public ServiceNumDao getServiceNumDao() {
        return serviceNumDao;
    }

    public void setServiceNumDao(ServiceNumDao serviceNumDao) {
        this.serviceNumDao = serviceNumDao;
    }

    public HostServiceDao getHostServiceDao() {
        return hostServiceDao;
    }

    public void setHostServiceDao(HostServiceDao hostServiceDao) {
        this.hostServiceDao = hostServiceDao;
    }

    public NodeInfoServiceDao getNodeInfoServiceDao() {
        return nodeInfoServiceDao;
    }

    public void setNodeInfoServiceDao(NodeInfoServiceDao nodeInfoServiceDao) {
        this.nodeInfoServiceDao = nodeInfoServiceDao;
    }

    public CshNumServiceDao getCshNumServiceDao() {
        return cshNumServiceDao;
    }

    public void setCshNumServiceDao(CshNumServiceDao cshNumServiceDao) {
        this.cshNumServiceDao = cshNumServiceDao;
    }

    public CitySyncDao getCitySyncDao() {
        return citySyncDao;
    }

    public void setCitySyncDao(CitySyncDao citySyncDao) {
        this.citySyncDao = citySyncDao;
    }

    public CitySyncServiceDao getCitySyncServiceDao() {
        return citySyncServiceDao;
    }

    public void setCitySyncServiceDao(CitySyncServiceDao citySyncServiceDao) {
        this.citySyncServiceDao = citySyncServiceDao;
    }

    public AconprocsbServiceDao getAconprocsbServiceDao() {
        return aconprocsbServiceDao;
    }

    public void setAconprocsbServiceDao(AconprocsbServiceDao aconprocsbServiceDao) {
        this.aconprocsbServiceDao = aconprocsbServiceDao;
    }

    public TableOracleCountDao getTableOracleCountDao() {
        return tableOracleCountDao;
    }

    public void setTableOracleCountDao(TableOracleCountDao tableOracleCountDao) {
        this.tableOracleCountDao = tableOracleCountDao;
    }
}
