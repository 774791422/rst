package org.taiji.rst.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface ServiceNumDao {

    List<Map> selectByService(@Param("datetime") String datetime);

    List selectByCity(@Param("istoday") String istoday, @Param("datetime") String datetime);

    List selectNodeInfo_oracle();

    List selectChs_num_oracle();

    List selectCODESTRING_oracle();

    List selectByServiceCode(@Param("city_service_code") String city_service_code);

    List selectByNodeName(@Param("node_name") String node_name);

    List selectSyncToDayOracle(@Param("date_time")String date_time);

    List selectSyncLjOracle();

    List selectCity(@Param("code")String code);

    List<Map> selectCityToDay(@Param("code")String code,@Param("date_time") String date_time,@Param("type")int type);

    BigDecimal selectCityCount(@Param("city") String city);

    Long selectCityNum(@Param("city") String city,@Param("date_time")  String date_time);

    Map selectCityLj();

    Long selectService();

    List<Map<String, Object>> selectServiceByCity(@Param("city") String city);

    List selectCityServiceLj(@Param("city") String city);

    Long selectCityService(@Param("city") String city);

    List<Map> selectCityRunDay(@Param("city") String city);

    Long cityData(@Param("city")String city);
}
