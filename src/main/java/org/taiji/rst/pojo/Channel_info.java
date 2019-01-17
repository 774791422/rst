package org.taiji.rst.pojo;


import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "chnl_info_state")
public class Channel_info {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "chnl_alias_name")
    private String chnlAliasName;
    @Column(name = "chnl_name")
    private String chnlName;
    @Column(name = "cid")
    private String cid;
    @Column(name = "dest_proc_status")
    private String destProcStatus;
    @Column(name = "src_aoxd_port")
    private String srcAoxdPort;
    @Column(name = "src_config_dir")
    private String srcConfigDir;
    @Column(name = "src_db_type")
    private String srcDbType;
    @Column(name = "src_dbps_port")
    private String srcDbpsPort;
    @Column(name = "src_disk_size")
    private String srcDiskSize;
    @Column(name = "src_home")
    private String srcHome;
    @Column(name = "src_nick")
    private String srcNick;
    @Column(name = "src_nick_name")
    private String srcNickName;
    @Column(name = "src_oxad_port")
    private String srcOxadPort;
    @Column(name = "src_proc_status")
    private String srcProcStatus;

    public Date getSrcReportTime() {
        return srcReportTime;
    }

    public void setSrcReportTime(Date srcReportTime) {
        this.srcReportTime = srcReportTime;
    }

    public Date getTargetReportTime() {
        return targetReportTime;
    }

    public void setTargetReportTime(Date targetReportTime) {
        this.targetReportTime = targetReportTime;
    }

    @Column(name = "src_report_time")
    private Date srcReportTime;
    @Column(name = "src_used_disk_size")
    private String srcUsedDiskSize;
    @Column(name = "src_vagent_port")
    private String srcVagentPort;
    @Column(name = "target_config_dir")
    private String targetConfigDir;
    @Column(name = "target_db_type")
    private String targetDbType;
    @Column(name = "target_disk_size")
    private String targetDiskSize;
    @Column(name = "target_home")
    private String targetHome;
    @Column(name = "target_nick")
    private String targetNick;
    @Column(name = "target_nick_name")
    private String targetNickName;
    @Column(name = "target_report_time")
    private Date targetReportTime;
    @Column(name = "target_used_disk_size")
    private String targetUsedDiskSize;
    @Column(name = "target_vagent_port")
    private String targetVagentPort;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChnlAliasName() {
        return chnlAliasName;
    }

    public void setChnlAliasName(String chnlAliasName) {
        this.chnlAliasName = chnlAliasName;
    }

    public String getChnlName() {
        return chnlName;
    }

    public void setChnlName(String chnlName) {
        this.chnlName = chnlName;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getDestProcStatus() {
        return destProcStatus;
    }

    public void setDestProcStatus(String destProcStatus) {
        this.destProcStatus = destProcStatus;
    }

    public String getSrcAoxdPort() {
        return srcAoxdPort;
    }

    public void setSrcAoxdPort(String srcAoxdPort) {
        this.srcAoxdPort = srcAoxdPort;
    }

    public String getSrcConfigDir() {
        return srcConfigDir;
    }

    public void setSrcConfigDir(String srcConfigDir) {
        this.srcConfigDir = srcConfigDir;
    }

    public String getSrcDbType() {
        return srcDbType;
    }

    public void setSrcDbType(String srcDbType) {
        this.srcDbType = srcDbType;
    }

    public String getSrcDbpsPort() {
        return srcDbpsPort;
    }

    public void setSrcDbpsPort(String srcDbpsPort) {
        this.srcDbpsPort = srcDbpsPort;
    }

    public String getSrcDiskSize() {
        return srcDiskSize;
    }

    public void setSrcDiskSize(String srcDiskSize) {
        this.srcDiskSize = srcDiskSize;
    }

    public String getSrcHome() {
        return srcHome;
    }

    public void setSrcHome(String srcHome) {
        this.srcHome = srcHome;
    }

    public String getSrcNick() {
        return srcNick;
    }

    public void setSrcNick(String srcNick) {
        this.srcNick = srcNick;
    }

    public String getSrcNickName() {
        return srcNickName;
    }

    public void setSrcNickName(String srcNickName) {
        this.srcNickName = srcNickName;
    }

    public String getSrcOxadPort() {
        return srcOxadPort;
    }

    public void setSrcOxadPort(String srcOxadPort) {
        this.srcOxadPort = srcOxadPort;
    }

    public String getSrcProcStatus() {
        return srcProcStatus;
    }

    public void setSrcProcStatus(String srcProcStatus) {
        this.srcProcStatus = srcProcStatus;
    }



    public String getSrcUsedDiskSize() {
        return srcUsedDiskSize;
    }

    public void setSrcUsedDiskSize(String srcUsedDiskSize) {
        this.srcUsedDiskSize = srcUsedDiskSize;
    }

    public String getSrcVagentPort() {
        return srcVagentPort;
    }

    public void setSrcVagentPort(String srcVagentPort) {
        this.srcVagentPort = srcVagentPort;
    }

    public String getTargetConfigDir() {
        return targetConfigDir;
    }

    public void setTargetConfigDir(String targetConfigDir) {
        this.targetConfigDir = targetConfigDir;
    }

    public String getTargetDbType() {
        return targetDbType;
    }

    public void setTargetDbType(String targetDbType) {
        this.targetDbType = targetDbType;
    }

    public String getTargetDiskSize() {
        return targetDiskSize;
    }

    public void setTargetDiskSize(String targetDiskSize) {
        this.targetDiskSize = targetDiskSize;
    }

    public String getTargetHome() {
        return targetHome;
    }

    public void setTargetHome(String targetHome) {
        this.targetHome = targetHome;
    }

    public String getTargetNick() {
        return targetNick;
    }

    public void setTargetNick(String targetNick) {
        this.targetNick = targetNick;
    }

    public String getTargetNickName() {
        return targetNickName;
    }

    public void setTargetNickName(String targetNickName) {
        this.targetNickName = targetNickName;
    }



    public String getTargetUsedDiskSize() {
        return targetUsedDiskSize;
    }

    public void setTargetUsedDiskSize(String targetUsedDiskSize) {
        this.targetUsedDiskSize = targetUsedDiskSize;
    }

    public String getTargetVagentPort() {
        return targetVagentPort;
    }

    public void setTargetVagentPort(String targetVagentPort) {
        this.targetVagentPort = targetVagentPort;
    }
}

