package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.HostSerivce;
import org.taiji.rst.pojo.SyncCurrentDayInfo;
import org.taiji.rst.pojo.SyncTotal;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;
import java.util.Map;

@Repository
public interface SyncCurrentDayInfoDao extends Mapper<SyncCurrentDayInfo> {

    List<SyncCurrentDayInfo> selectBySyncDay(String node_id, String date_time);

    List<Map> selectDayChangeList();

    List<Map> selectDay();
    List<Map> selectMap();

    List sxServiceMap(@Param("date_time")String date_time);

    List cityServiceMap(@Param("date_time")String date_time,@Param("city")String city);

    List shengServiceMap(@Param("date_time") String date_time);

    List<Map> listCity();

    Long selectCityGaojingCount(@Param("city") String city,@Param("service") String service);

    Long selectSxGaojingCount(@Param("service")String service);

    List<Map> selectCityDayChangeList(@Param("city") String city);
}
