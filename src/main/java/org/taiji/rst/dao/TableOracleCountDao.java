package org.taiji.rst.dao;

import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.TableChannelCount;
import org.taiji.rst.pojo.TableOracleCount;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;
import java.util.Map;

@Repository
public interface TableOracleCountDao extends Mapper<TableOracleCount> {

    List<Map> selectOracleTable();

    List<TableOracleCount> selectByOracleTableOne(String tableName);
}
