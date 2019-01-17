package org.taiji.rst.pojo;


import javax.persistence.*;
@Entity
@Table(name = "rst_sync_total")
public class SyncTotal {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * 累计或者今日 0累计 1今日
     */
    @Column(name = "type")
    private int type;
    /**
     * 同步量
     */
    @Column(name = "sync_num")
    private Long syncNum;

    /**
     * 单位级同步量  千 万  亿  百亿
     */
    @Column(name = "sync_numstr")
    private String syncNumstr;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public Long getSyncNum() {
        return syncNum;
    }

    public void setSyncNum(Long syncNum) {
        this.syncNum = syncNum;
    }

    public String getSyncNumstr() {
        return syncNumstr;
    }

    public void setSyncNumstr(String syncNumstr) {
        this.syncNumstr = syncNumstr;
    }
}

