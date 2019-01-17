package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.CitySyncService;
import org.taiji.rst.pojo.SyncCurrentDayInfo;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;
import java.util.Map;

@Repository
public interface CitySyncServiceDao extends Mapper<CitySyncService> {


    List<CitySyncService> selectCityToDay(@Param("service_code")String service_code,@Param("date_time") String date_time);
}
