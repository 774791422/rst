package org.taiji.rst.pojo;


import javax.persistence.*;

@Entity
@Table(name = "sync_current_day_info")
public class SyncCurrentDayInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "node_id")
    private  Long nodeId;
    @Column(name = "node_name")
    private String nodeName;
    @Column(name = "sync_num")
    private Long syncNum;
    @Column(name = "sync_date")
    private String syncDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNodeId() {
        return nodeId;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public Long getSyncNum() {
        return syncNum;
    }

    public void setSyncNum(Long syncNum) {
        this.syncNum = syncNum;
    }

    public String getSyncDate() {
        return syncDate;
    }

    public void setSyncDate(String syncDate) {
        this.syncDate = syncDate;
    }
}

