package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.taiji.rst.pojo.SyncTotal;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface RstAllADUDCountDao extends Mapper<SyncTotal> {
    public void getAllADUCount();
    public  List<SyncTotal> selectByType(int i);

    Long selectByTypeDateTime(int type, String datetime);
}
