package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.taiji.rst.pojo.Aconprocsb;
import org.taiji.rst.pojo.CitySyncNum;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface AconprocsbServiceDao extends Mapper<Aconprocsb> {
    List selectByUriString(@Param("uristring")String uristring);
    List selectByGaojing();
}
