package org.taiji.rst.pojo;


import javax.persistence.*;

@Entity
@Table(name = "host_site_monitor")
public class HostSiteMonitor {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * ip
     */
    @Column(name = "ip")
    private String ip;
    /**
     * cpu 使用率
     */
    @Column(name = "cpu_rate")
    private String cpuRate;
    /**
     * 硬盘使用率
     */
    @Column(name = "disk_rate")
    private String diskRate;
    /**
     * 内存使用率
     */
    @Column(name = "mem_rate")
    private String memRate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getCpuRate() {
        return cpuRate;
    }

    public void setCpuRate(String cpuRate) {
        this.cpuRate = cpuRate;
    }

    public String getDiskRate() {
        return diskRate;
    }

    public void setDiskRate(String diskRate) {
        this.diskRate = diskRate;
    }

    public String getMemRate() {
        return memRate;
    }

    public void setMemRate(String memRate) {
        this.memRate = memRate;
    }
}

