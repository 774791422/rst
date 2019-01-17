package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.taiji.rst.pojo.CshNum;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface CshNumServiceDao extends Mapper<CshNum> {

    List selectByCityCode(@Param("city") String city, @Param("service")String service);
}
