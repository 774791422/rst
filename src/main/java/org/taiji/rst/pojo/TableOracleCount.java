package org.taiji.rst.pojo;


import javax.persistence.*;

@Entity
@Table(name = "table_oracle_count")
public class TableOracleCount {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "er_name")
    private String erName;

    /**
     * 表名
     */
    @Column(name = "table_name")
    private String tableName;

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
    @Column(name = "table_op_tm")
    private String tableOpTm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getErName() {
        return erName;
    }

    public void setErName(String erName) {
        this.erName = erName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
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

    public String getTableOpTm() {
        return tableOpTm;
    }

    public void setTableOpTm(String tableOpTm) {
        this.tableOpTm = tableOpTm;
    }
}

