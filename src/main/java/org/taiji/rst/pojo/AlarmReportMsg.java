package org.taiji.rst.pojo;


import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "alarm_report_msg")
public class AlarmReportMsg {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * 异常编号
     */
    @Column(name = "me_id")
    private String meId;
    /**
     * 设备名称
     */
    @Column(name = "device_name")
    private String deviceName;
    /**
     * 设备IP
     */
    @Column(name = "device_ip")
    private String deviceIp;
    /**
     * 通道名称
     */
    @Column(name = "chnl_name")
    private String chnlName;
    /**
     * 异常信息
     */
    @Column(name = "ex_msg")
    private String exMsg;
    @Column(name = "rec_time")
    /**
     * 记录时间
     */
    private Date recTime;
    @Column(name = "ex_count")
    /**
     * 错误次数
     */
    private String exCount;
    /**
     * 更新时间
     */
    @Column(name = "update_time")
    private Date updateTime;
    /**
     * 异常处理状态（0：异常未处理；1：异常已处理；2：忽略异常）
     */
    @Column(name = "ex_status")
    private String exStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMeId() {
        return meId;
    }

    public void setMeId(String meId) {
        this.meId = meId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getDeviceIp() {
        return deviceIp;
    }

    public void setDeviceIp(String deviceIp) {
        this.deviceIp = deviceIp;
    }

    public String getChnlName() {
        return chnlName;
    }

    public void setChnlName(String chnlName) {
        this.chnlName = chnlName;
    }

    public String getExMsg() {
        return exMsg;
    }

    public void setExMsg(String exMsg) {
        this.exMsg = exMsg;
    }

    public Date getRecTime() {
        return recTime;
    }

    public void setRecTime(Date recTime) {
        this.recTime = recTime;
    }

    public String getExCount() {
        return exCount;
    }

    public void setExCount(String exCount) {
        this.exCount = exCount;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getExStatus() {
        return exStatus;
    }

    public void setExStatus(String exStatus) {
        this.exStatus = exStatus;
    }


}

