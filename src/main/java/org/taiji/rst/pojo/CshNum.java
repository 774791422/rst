package org.taiji.rst.pojo;

import javax.persistence.*;

@Entity
@Table(name = "csh_num")
public class CshNum {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "city")
    private String city;
    @Column(name = "service")
    private String  service;
    @Column(name = "csh_num")
    private String cshNum ;

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

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getCshNum() {
        return cshNum;
    }

    public void setCshNum(String cshNum) {
        this.cshNum = cshNum;
    }
}
