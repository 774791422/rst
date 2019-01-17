package org.taiji.rst.pojo;

import javax.persistence.*;

@Entity
@Table(name = "aconprocsb")
public class Aconprocsb {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "uristring")
    private String uristring;
    @Column(name = "commonname")
    private String commonname;
    @Column(name = "processname")
    private String processname;
    @Column(name = "processtype")
    private String processtype;
    @Column(name = "tasktype")
    private String tasktype;
    @Column(name = "taskdesc")
    private String taskdesc;
    @Column(name = "laststatus")
    private String laststatus;
    @Column(name = "statustimestamp")
    private String statustimestamp;
    @Column(name = "agenttimestamp")
    private String agenttimestamp;
    @Column(name = "lastrecordtime")
    private String lastrecordtime;
    @Column(name = "lastcheckpointlag")
    private String lastcheckpointlag;
    @Column(name = "datasource")
    private String datasource;
    @Column(name = "datasourcetype")
    private String datasourcetype;
    @Column(name = "paramfile")
    private String paramfile;
    @Column(name = "tandemcpu")
    private int tandemcpu;
    @Column(name = "tandempriority")
    private int tandempriority;
    @Column(name = "tandemprocess")
    private String tandemprocess;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUristring() {
        return uristring;
    }

    public void setUristring(String uristring) {
        this.uristring = uristring;
    }

    public String getCommonname() {
        return commonname;
    }

    public void setCommonname(String commonname) {
        this.commonname = commonname;
    }

    public String getProcessname() {
        return processname;
    }

    public void setProcessname(String processname) {
        this.processname = processname;
    }

    public String getProcesstype() {
        return processtype;
    }

    public void setProcesstype(String processtype) {
        this.processtype = processtype;
    }

    public String getTasktype() {
        return tasktype;
    }

    public void setTasktype(String tasktype) {
        this.tasktype = tasktype;
    }

    public String getTaskdesc() {
        return taskdesc;
    }

    public void setTaskdesc(String taskdesc) {
        this.taskdesc = taskdesc;
    }

    public String getLaststatus() {
        return laststatus;
    }

    public void setLaststatus(String laststatus) {
        this.laststatus = laststatus;
    }

    public String getStatustimestamp() {
        return statustimestamp;
    }

    public void setStatustimestamp(String statustimestamp) {
        this.statustimestamp = statustimestamp;
    }

    public String getAgenttimestamp() {
        return agenttimestamp;
    }

    public void setAgenttimestamp(String agenttimestamp) {
        this.agenttimestamp = agenttimestamp;
    }

    public String getLastrecordtime() {
        return lastrecordtime;
    }

    public void setLastrecordtime(String lastrecordtime) {
        this.lastrecordtime = lastrecordtime;
    }

    public String getLastcheckpointlag() {
        return lastcheckpointlag;
    }

    public void setLastcheckpointlag(String lastcheckpointlag) {
        this.lastcheckpointlag = lastcheckpointlag;
    }

    public String getDatasource() {
        return datasource;
    }

    public void setDatasource(String datasource) {
        this.datasource = datasource;
    }

    public String getDatasourcetype() {
        return datasourcetype;
    }

    public void setDatasourcetype(String datasourcetype) {
        this.datasourcetype = datasourcetype;
    }

    public String getParamfile() {
        return paramfile;
    }

    public void setParamfile(String paramfile) {
        this.paramfile = paramfile;
    }

    public int getTandemcpu() {
        return tandemcpu;
    }

    public void setTandemcpu(int tandemcpu) {
        this.tandemcpu = tandemcpu;
    }

    public int getTandempriority() {
        return tandempriority;
    }

    public void setTandempriority(int tandempriority) {
        this.tandempriority = tandempriority;
    }

    public String getTandemprocess() {
        return tandemprocess;
    }

    public void setTandemprocess(String tandemprocess) {
        this.tandemprocess = tandemprocess;
    }
}
