package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.AlarmReportMsg;
import org.taiji.rst.pojo.Channel_info;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface ChannelServiceDao extends Mapper<Channel_info> {

    List<Channel_info> selectByCid(String cid);

    Long selectZc_channel(@Param("i") int i);

    Long selectChannel(@Param("i") int i);

    Long oracle_zc();

    Long oracle_all();

    Long zcOracleCity(@Param("city") String city);

    Long allOracleCity(@Param("city") String city);
}
