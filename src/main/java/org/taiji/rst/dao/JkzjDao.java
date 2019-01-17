package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.HostSiteMonitor;
import org.taiji.rst.pojo.TableChannelCount;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface JkzjDao extends Mapper<HostSiteMonitor> {

    List<HostSiteMonitor> selectByIp(String ip);

    List<HostSiteMonitor> selectJkqkByCity(@Param("city") String city);
}
