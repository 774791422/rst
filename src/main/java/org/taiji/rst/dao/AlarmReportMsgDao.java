package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.AlarmReportMsg;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface AlarmReportMsgDao extends Mapper<AlarmReportMsg>{
    List selectByMeId(String meId);

    List<AlarmReportMsg> selectMsgList();

    List selectByOracle();

    List<AlarmReportMsg> selectCityMsgList(@Param("city") String city);
}
