package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.HostSerivce;
import org.taiji.rst.pojo.TableChannelCount;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface HostServiceDao extends Mapper<HostSerivce> {


    List<HostSerivce> selectByCityCode(@Param("city_service_code") String city_service_code, @Param("city") String city, @Param("commonname") String commonname, @Param("service") String service);

    List<HostSerivce> selectByCityService(@Param("city")String city,@Param("service") String service);
}
