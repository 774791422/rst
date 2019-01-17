package org.taiji.rst.pojo;

import javax.persistence.*;

@Entity
@Table(name = "city_service_num_today")
public class CitySyncService {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "city")
    private String city;
    @Column(name = "service_code")
    private  String  serviceCode;
    @Column(name = "sync_num")
    private Long syncNum;
    @Column(name = "synctime")
    private String synctime;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public Long getSyncNum() {
        return syncNum;
    }

    public void setSyncNum(Long syncNum) {
        this.syncNum = syncNum;
    }

    public String getSynctime() {
        return synctime;
    }

    public void setSynctime(String synctime) {
        this.synctime = synctime;
    }
}
