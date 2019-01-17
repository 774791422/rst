package org.taiji.rst.pojo;

import javax.persistence.*;

@Entity
@Table(name = "city_sync_num")
public class CitySyncNum {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "city")
    private String city;
    @Column(name = "istoday")
    private  int  istoday;
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

    public int getIstoday() {
        return istoday;
    }

    public void setIstoday(int istoday) {
        this.istoday = istoday;
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
