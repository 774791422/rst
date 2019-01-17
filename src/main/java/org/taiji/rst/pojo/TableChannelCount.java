package org.taiji.rst.pojo;


import javax.persistence.*;

@Entity
@Table(name = "table_channel_count")
public class TableChannelCount {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * 通道号
     */
    @Column(name = "node_id")
    private String nodeId;
    /**
     *通道名称
     */
    @Column(name = "node_name")
    private String nodeName;
    /**
     * 目标端target_id
     */
    @Column(name = "src_target_id")
    private String srcTargetId;
    /**
     * 表名
     */
    @Column(name = "table_name")
    private String tableName;
    /**
     * 累计ddl数量
     */
    @Column(name = "tar_ddl_num")
    private Long tarDdlNum;
    /**
     * 累计删除量
     */
    @Column(name = "tar_delete_num")
    private Long tarDeleteNum;
    /**
     * 累计新增量
     */
    @Column(name = "tar_insert_num")
    private Long tarInsertNum;
    /**
     * 累计修改量
     */
    @Column(name = "tar_update_num")
    private Long tarUpdateNum;
    /**
     * 用户名
     */
    @Column(name = "username")
    private String username;

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

    public String getSrcTargetId() {
        return srcTargetId;
    }

    public void setSrcTargetId(String srcTargetId) {
        this.srcTargetId = srcTargetId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Long getTarDdlNum() {
        return tarDdlNum;
    }

    public void setTarDdlNum(Long tarDdlNum) {
        this.tarDdlNum = tarDdlNum;
    }

    public Long getTarDeleteNum() {
        return tarDeleteNum;
    }

    public void setTarDeleteNum(Long tarDeleteNum) {
        this.tarDeleteNum = tarDeleteNum;
    }

    public Long getTarInsertNum() {
        return tarInsertNum;
    }

    public void setTarInsertNum(Long tarInsertNum) {
        this.tarInsertNum = tarInsertNum;
    }

    public Long getTarUpdateNum() {
        return tarUpdateNum;
    }

    public void setTarUpdateNum(Long tarUpdateNum) {
        this.tarUpdateNum = tarUpdateNum;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}

