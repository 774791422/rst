package org.taiji.rst.services.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.taiji.rst.dao.HostServiceDao;
import org.taiji.rst.dao.JkzjDao;
import org.taiji.rst.pojo.AlarmReportMsg;
import org.taiji.rst.pojo.HostSerivce;
import org.taiji.rst.pojo.HostSiteMonitor;
import org.taiji.util.http.HttpsClientUtil;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JkServiceImpl {
    public Logger LOG = LoggerFactory.getLogger(this.getClass());
//    String url = "http://59.195.199.190:8080/cloud/h3c/vms/queryVmsPerformance";//云监控政务网地址
    String url = "http://192.166.11.5/cloud/h3c/vms/queryVmsPerformance";//云监控内网地址
    String param = "";
    private JkzjDao jkzjDao;
    private HostServiceDao hostServiceDao;

    /**
     * 通过ip监控获取服务信息
     */
    public void jkzj() {
        List<HostSerivce> hosts = hostServiceDao.selectAll();
        for (int i = 0; i < hosts.size(); i++) {
            String ip = hosts.get(i).getCommonname();
            param = "{\"vmsIp\":\"" + ip + "\"}";//请求参数
            Map m = doHttpsPost(url, param);
            if (m.get("status").toString().equals("200")) {//成功
                JSONObject jasonObject = JSONObject.parseObject(m.get("result").toString());
                insertjkzj(jasonObject, ip);
            }

        }
    }

    /**
     *
     * @param jasonObject
     * @param ip
     */
    private void insertjkzj(JSONObject jasonObject, String ip) {
        JSONArray jasonArray = jasonObject.getJSONArray("resultObj");
        for (int i = 0; i < jasonArray.size(); i++) {
            JSONObject jsonObject = jasonArray.getJSONObject(i);
            if (jsonObject.get("ip").equals(ip)) {
                insertintojkzj(jsonObject);
            }
        }

    }

    /**
     * 插入主机ip
     * @param jsonObject
     */
    private void insertintojkzj(JSONObject jsonObject) {
        String ip = jsonObject.get("ip").toString();
        List<HostSiteMonitor> list = jkzjDao.selectByIp(ip);
        HostSiteMonitor hostsm=new HostSiteMonitor();
        hostsm.setCpuRate(jsonObject.get("cpuRate").toString());
        hostsm.setMemRate(jsonObject.get("memRate").toString());
        hostsm.setDiskRate(jsonObject.get("diskRate").toString());
        hostsm.setIp(ip);
        if (list.size() != 0) {
            hostsm.setId(list.get(0).getId());
            jkzjDao.updateByPrimaryKey(hostsm);
        } else {
            jkzjDao.insert(hostsm);
        }
    }


    private Map doHttpsPost(String url, String param) {
        Map<String, String> res = new HashMap<String, String>();
        HttpClient httpClient = null;
        HttpPost httpPost = null;
        HttpResponse response = null;
        String result = null;
        try {
            URL urls = new URL(url);
            httpClient = HttpsClientUtil.getHttpClient();
            httpPost = new HttpPost(url);
            RequestConfig config = RequestConfig.custom()
                    .setConnectTimeout(3000).setConnectionRequestTimeout(3000)
                    .setSocketTimeout(3000).build();
            httpPost.setConfig(config);
            httpPost.setHeader("Content-Type",
                    "application/x-www-form-urlencoded;charset=UTF-8");
            List<NameValuePair> paramList = new ArrayList<NameValuePair>();
            paramList.add(new BasicNameValuePair("param", param));
            UrlEncodedFormEntity urlEncodedFormEntity = new UrlEncodedFormEntity(
                    paramList, "utf-8");
            httpPost.setEntity(new UrlEncodedFormEntity(paramList));
            response = httpClient.execute(httpPost);
            if (response != null) {
                HttpEntity resEntity = response.getEntity();
                if (resEntity != null) {
                    result = EntityUtils.toString(resEntity, "UTF-8");
                }
                res.put("result", result);
                res.put("status", "200");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            res.put("status", "999");
        } finally {
            if (httpPost != null) {
                httpPost.releaseConnection();
            }
        }
        return res;
    }

    public JkzjDao getJkzjDao() {
        return jkzjDao;
    }

    public void setJkzjDao(JkzjDao jkzjDao) {
        this.jkzjDao = jkzjDao;
    }

    public HostServiceDao getHostServiceDao() {
        return hostServiceDao;
    }

    public void setHostServiceDao(HostServiceDao hostServiceDao) {
        this.hostServiceDao = hostServiceDao;
    }
}
