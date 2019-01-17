package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.CitySyncNum;
import org.taiji.rst.pojo.HostSerivce;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface CitySyncDao extends Mapper<CitySyncNum> {


    Long selectByUpDay(String city, String date_time, int istoday);
    List<CitySyncNum> selectCitySynNum(@Param("type") int type,@Param("city") String city);
}
