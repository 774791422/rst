package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.SyncTotal;
import org.taiji.rst.pojo.TableChannelCount;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;
import java.util.Map;

@Repository
public interface TableChannelCountDao extends Mapper<TableChannelCount> {
    List<TableChannelCount> selectByTableName(String tableName);

    List<Map> selectTableChangeList();

    List<Map> selectCityTableChangeList(@Param("city") String city);

    Map table_change(@Param("city")String city);
}
