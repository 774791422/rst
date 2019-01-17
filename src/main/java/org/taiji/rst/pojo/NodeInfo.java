package org.taiji.rst.pojo;

import javax.persistence.*;

@Entity
@Table(name = "node_info")
public class NodeInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "node_id")
    private String nodeId;
    @Column(name = "node_name")
    private String nodeName;
    @Column(name = "node_alias")
    private String nodeAlias;
    @Column(name = "src_hostip")
    private String srcHostip;
    @Column(name = "target_host")
    private String targetHost;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeAlias() {
        return nodeAlias;
    }

    public void setNodeAlias(String nodeAlias) {
        this.nodeAlias = nodeAlias;
    }

    public String getSrcHostip() {
        return srcHostip;
    }

    public void setSrcHostip(String srcHostip) {
        this.srcHostip = srcHostip;
    }

    public String getTargetHost() {
        return targetHost;
    }

    public void setTargetHost(String targetHost) {
        this.targetHost = targetHost;
    }
}
