var rstApp = angular.module('rstApp', ['ionic']);
rstApp.controller('rstAppCtrl', function ($scope, $http, $interval, $filter,$ionicPopup) {
    $scope.today = new Date();
    $scope.loadGjxxList = function () {
        var pageNum = 1;
        var pageSize = 5;
        $http.post("rst/listGjxx.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            if (response.list.length > 0) {
                $scope.isList = false;
            } else {
                $scope.isList = true;
            }
            $scope.gjxxList = response.list;
        });
    };
    $scope.loadJkqkList = function () {
        $http.post("rst/listJkqk.do").success(function (response) {
            var length = response.length;
            var i = 0;
            if (length > 1) {
                if (i >= length) {
                    i = 0;
                }
                $scope.host = response[i];
                $scope.host.cpuRate = parseFloat($scope.host.cpuRate).toFixed(1);
                $scope.host.diskRate = parseFloat($scope.host.diskRate).toFixed(1);
                $scope.host.memRate = parseFloat($scope.host.memRate).toFixed(1);
                $(".ybpbox").each(function (j, item) {
                    var per = 0;
                    switch (j) {
                        case 0:
                            per = $scope.host.cpuRate / 100;
                            break;
                        case 1:
                            per = $scope.host.diskRate / 100;
                            break;
                        case 2:
                            per = $scope.host.memRate / 100;
                            break;
                    }
                    var zper = per * 240 + 60;
                    $(this).find(".zhizhen").css({
                        "transform": 'rotate(' + zper + 'deg)'
                    });
                });
                i++;
                $interval(function () {
                    if (i >= length) {
                        i = 0;
                    }
                    $scope.host = response[i];
                    $scope.host.cpuRate = parseFloat($scope.host.cpuRate).toFixed(1);
                    $scope.host.diskRate = parseFloat($scope.host.diskRate).toFixed(1);
                    $scope.host.memRate = parseFloat($scope.host.memRate).toFixed(1);
                    $(".ybpbox").each(function (j, item) {
                        var per = 0;
                        switch (j) {
                            case 0:
                                per = $scope.host.cpuRate / 100;
                                break;
                            case 1:
                                per = $scope.host.diskRate / 100;
                                break;
                            case 2:
                                per = $scope.host.memRate / 100;
                                break;
                        }
                        var zper = per * 240 + 60;
                        $(this).find(".zhizhen").css({
                            "transform": 'rotate(' + zper + 'deg)'
                        });
                    });
                    i++;
                }, 5000);
            }
        });
    };
    $scope.loadTableChange = function () {
        var option = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    },
                    axisLabel: {
                        show: true,
                        rotate: 15,
                        interval: 0,
                        height: '50px',
                        textStyle: {
                            color: '#ffffff'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    }
                }
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: '60%',
                    data: [],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            color: "#ffffff"
                        }
                    },
                }
            ]
        };
        var tableChart = echarts.init(document.getElementById('tableChange'));
        var pageNum = 1;
        var pageSize = 7;
        $http.post("rst/listTableChange.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            var data = [];
            var xData = [];
            for (var i = 0; i < response.list.length; i++) {
                data[i] = response.list[i].tar_ddl_num;
                xData[i] = response.list[i].table_name;
            }
            option.series[0].data = data;
            option.xAxis[0].data = xData;
            tableChart.setOption(option);
        });
    };
    $scope.tbl = function () {
        $http.get("rst/tbl.do").success(function (response) {
            $scope.tbl_ = response.tbl;
            $("#tbl_line").css("width", $scope.tbl_ + "%");
            $("#stbl_line").css("width", $scope.tbl_ + "%");
        });
    };


    $scope.sync_ljs = function () {
        $http.get("rst/sync_num.do?type=0&datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
            $scope.sync_lj = response.sync_num;
        });
    };


    $scope.sync_days = function () {
        $http.get("rst/sync_num.do?type=1&datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
            $scope.sync_day = response.sync_num;
        });
    };


    $scope.sync_service = function () {
        $http.get("rst/service_num.do?datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
            $scope.sync_services = response;
            if($scope.sync_services.length>0) {
                $("#sync_services0_bl").css("width", $scope.sync_services[0].bl + "%");
                $("#span0_bl").css("width", $scope.sync_services[0].bl + "%");
                $("#sync_services1_bl").css("width", $scope.sync_services[1].bl + "%");
                $("#span1_bl").css("width", $scope.sync_services[1].bl + "%");
                $("#sync_services2_bl").css("width", $scope.sync_services[2].bl + "%");
                $("#span2_bl").css("width", $scope.sync_services[2].bl + "%");
                $("#sync_services3_bl").css("width", $scope.sync_services[3].bl + "%");
                $("#span3_bl").css("width", $scope.sync_services[3].bl + "%");
            }
        });
    };

    $scope.sync_city_today = function () {
        $http.get("rst/sync_city_today.do?datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
            $scope.y_today = response.ydata;
            $scope.x_today = response.xdata;
            var option_today = {
                // backgroundColor: '#00265f',
                grid: {
                    left: '3%',
                    right: '4%',
                    // bottom: '1%',
                    top: '10%',
                    containLabel: true
                },
                tooltip: {
                    show: true
                },
                xAxis: [{
                    type: 'category',
                    data: $scope.x_today,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        rotate: 40,
                        textStyle: {
                            color: "#00c7ff",
                        }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '单位(万)',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: false,

                        lineStyle: {
                            color: "#00c7ff",
                            width: 20,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#063374",
                        }
                    }
                }],
                series: [{
                    type: 'bar',
                    data: $scope.y_today,
                    barWidth: 20, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#00c7ff',
                                    fontSize: 16
                                },
                                formatter: function (a) {
                                    var n;
                                    n = Math.round((a.data / 10000) * 100) / 100;
                                    n = n + "万";
                                    return n;
                                }
                            },
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#01B1C0'
                            }, {
                                offset: 1,
                                color: '#073355'
                            }]),
                            opacity: 1,
                        }
                    }
                }]
            };
            var myChart = echarts.init(document.getElementById('today'));
            myChart.setOption(option_today);
        });
    };

    $scope.sync_city_lj = function () {
        $http.get("rst/sync_city_lj.do?datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
            $scope.y_today = response.ydata;
            $scope.x_today = response.xdata;
            var option_lj = {
                grid: {
                    left: '3%',
                    right: '4%',
                    // bottom: '1%',
                    top: '10%',
                    containLabel: true
                },
                tooltip: {
                    show: true
                },
                xAxis: [{
                    type: 'category',
                    data: $scope.x_today,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        rotate: 40,
                        textStyle: {
                            color: "#00c7ff",
                        }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '单位(亿)',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: false,

                        lineStyle: {
                            color: "#00c7ff",
                            width: 20,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#063374",
                        }
                    }
                }],
                series: [{
                    type: 'bar',
                    data: $scope.y_today,
                    barWidth: 20, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#00c7ff',
                                    fontSize: 16
                                },
                                formatter: function (a) {
                                    var n;
                                    // n = Math.round((a.data /10000) * 100) / 100;
                                    n = a.data + "亿";
                                    return n;
                                }
                            },
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#B18A34'
                            }, {
                                offset: 1,
                                color: '#0E1B35'
                            }]),
                            opacity: 1,
                        }
                    }
                }]
            };
            var myChart = echarts.init(document.getElementById('lj'));
            myChart.setOption(option_lj);
        });
    };

    $scope.dw = function (num) {
        var result = [], counter = 0;
        num = (num || 0).toString().split('');
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result.unshift(num[i]);
            if (!(counter % 3) && i != 0) {
                result.unshift(',');
            }
        }
        return result.join('');
    }
    //只提取汉字  
    $scope.GetChinese = function (strValue) {
        if (strValue != null && strValue != "") {
            var reg = /[\u4e00-\u9fa5]/g;
            return strValue.match(reg).join("");
        } else
            return "";
    }
    //去掉汉字  
    $scope.RemoveChinese = function (strValue) {
        if (strValue != null && strValue != "") {
            var reg = /[\u4e00-\u9fa5]/g;
            return strValue.replace(reg, "");
        } else
            return "";
    }


    $scope.dayChange = function () {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [],
                align: "left",
                width: 500,
                textStyle: {
                    color: '#ffffff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                axisLabel: {
                    show: true,
                    rotate: 15,
                    interval: 0,
                    height: '50px',
                    textStyle: {
                        color: '#ffffff'
                    }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    }
                }
            ],
            series: []
        };
        var dayChart = echarts.init(document.getElementById('dayChange'));
        $http.post("rst/listDayChange.do").success(function (response) {
            var legendData = [];
            var xData = [];
            var seriesData = [];
            for (var i = 0; i < response.dayList.length; i++) {
                xData[0] = response.dayList[i].day1;
                xData[1] = response.dayList[i].day2;
                xData[2] = response.dayList[i].day3;
                xData[3] = response.dayList[i].day4;
                xData[4] = response.dayList[i].day5;
                xData[5] = response.dayList[i].day6;
                xData[6] = response.dayList[i].day7;
            }
            for (var i = 0; i < response.dayInfoList.length; i++) {
                var data = [];
                data[0] = response.dayInfoList[i].day1;
                data[1] = response.dayInfoList[i].day2;
                data[2] = response.dayInfoList[i].day3;
                data[3] = response.dayInfoList[i].day4;
                data[4] = response.dayInfoList[i].day5;
                data[5] = response.dayInfoList[i].day6;
                data[6] = response.dayInfoList[i].day7;
                seriesData[i] = {
                    name: response.dayInfoList[i].city,
                    type: 'line',
                    data: data
                };
                legendData[i] = response.dayInfoList[i].city;
            }
            option.series = seriesData;
            option.xAxis.data = xData;
            option.legend.data = legendData;
            dayChart.setOption(option);
        });
    }
    $scope.loadMap = function () {
        var dataInfo = {};
        var geoCoordMap = {
            '太原市': [112.551234, 37.871234],
            '大同市': [113.3, 40.12],
            '朔州市': [112.43, 39.33],
            '忻州市': [112.73, 38.42],
            '阳泉市': [113.57, 37.85],
            '吕梁市': [111.13, 37.52],
            '晋中市': [112.75, 37.68],
            '长治市': [113.12, 36.2],
            '晋城市': [112.83, 35.5],
            '临汾市': [111.52, 36.08],
            '运城市': [111.006284, 35.040862]
        };
        var option = {
            geo: {
                show: true,
                map: '山西',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        label: {show: true, textStyle: {color: '#fff'}},
                        areaColor: '#1C65D5',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#1C65D5'
                    }
                }
            },
            // tooltip: {
            //     trigger: 'item',
            //     formatter: function(params) {
            //         var city = params.name;
            //             var list = dataInfo[city];
            //             var tableHtml = '<div class="maptable"><div class="scrol"><table>'+
            //                 '<tr><td>业务</td><td>今日同步量</td></tr>';
            //             for (var i = 0; i < list.length; i++) {
            //                 tableHtml = tableHtml + "<tr>" +
            //                     "<td>" + list[i].service + "</td>" +
            //                     "<td>" + list[i].sync_num + "</td>" +
            //                     "</tr>";
            //             }
            //             tableHtml=tableHtml+ '</table></div></div>';
            //             return tableHtml;
            //     }
            // },
            series: [
                {
                    name: '同步量',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbol: 'pin', //气泡
                    symbolSize: function (val) {
                        return 60;
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 9,
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#F62157', //标志颜色
                        }
                    },
                    zlevel: 2,
                    data: []
                }, {
                    name: '名称',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: [],
                    symbolSize: function (val) {
                        return 10;
                    },
                    label: {
                        normal: {
                            formatter: function (params) {
                                return params.name;
                            },
                            position: 'right',
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ffffff'
                        }
                    }
                }]
        };
        var mapChart = echarts.init(document.getElementById('map'));
        $http.post("rst/listMap.do").success(function (response) {
            var seriesData = [];
            for (var i = 0; i < response.length; i++) {
                if (response[i].city != '省本级') {
                    seriesData.push({
                        name: response[i].city,
                        value: geoCoordMap[response[i].city].concat(response[i].sync_num)
                    });
                }else{
                    $("#sheng_services").html(response[i].sync_num);
                }
            }
            option.series[0].data = seriesData;
            option.series[1].data = seriesData;
            mapChart.setOption(option);
            mapChart.on('mouseover', function (params) {
                var city = params.name;
                $http.get("rst/cityServiceMap.do?city=" + encodeURI(city) + "&datetime=" +$filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
                    var list = response;
                    var h = "";
                    for (var i = 0; i < list.length; i++) {
                        if(list[i].state>0){
                            h = h + "<tr style='color:red'>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].city + list[i].service + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].sync_num + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t</tr>";
                        }else {
                            h = h + "<tr>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].city + list[i].service + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].sync_num + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t</tr>";
                        }
                    }
                    $("#sev_table").html(h);
                })
            });
            mapChart.on('click', function (params) {
                var city = params.name;
                $http.get("rst/cityData.do?city="+encodeURI(city)).success(function (response) {
                    if(response.result){
                        window.open("/cityIndex.html?city="+encodeURI(city),"_blank");
                    }else{
                         $ionicPopup.alert({
                             title: '提示',
                             template: '点击'+city+'无同步数据'
                         });
                    }
                });

            });

            // $http.get("rst/cityInfoMap.do").success(function (response) {
            //     dataInfo = response;
            // });
        })
    }
        $(".map-data").on({
            mouseover: function () {
                $http.get("rst/cityServiceMap.do?city=" + encodeURI("省本级") + "&datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
                    var list = response;
                    var h = "";
                    for (var i = 0; i < list.length; i++) {
                        if(list[i].state>0){
                            h = h + "<tr style='color:red'>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].city + list[i].service + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].sync_num + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t</tr>";
                        }else {
                            h = h + "<tr>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].city + list[i].service + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].sync_num + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t</tr>";
                        }
                    }
                    $("#sev_table").html(h);
                })
            },
            mouseout: function () {
                $http.get("rst/cityServiceMap.do?city=&datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
                    var list = response;
                    var h = "";
                    for (var i = 0; i < list.length; i++) {
                        if(list[i].state>0){
                            h = h + "<tr style='color:red'>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].city + list[i].service + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].sync_num + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t</tr>";
                        }else {
                            h = h + "<tr>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].city + list[i].service + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].sync_num + "</td>\n" +
                                "\t\t\t\t\t\t\t\t\t\t</tr>";
                        }
                    }
                    $("#sev_table").html(h);
                })
            },
            click:function () {
                $http.get("rst/cityData.do?city="+encodeURI("省本级")).success(function (response) {
                    if(response.result){
                        window.open("/cityIndex.html?city="+encodeURI("省本级"),"_blank");
                    }else{
                        $ionicPopup.alert({
                            title: '提示',
                            template: '点击省本级无同步数据'
                        });
                    }
                });

            }
        });
        $scope.cityServiceMap = function () {
            $http.get("rst/cityServiceMap.do?city=&datetime=" + $filter('date')($scope.today, 'yyyy-MM-dd')).success(function (response) {
                var list = response;
                var h = "";
                for (var i = 0; i < list.length; i++) {
                    if(list[i].state>0){
                        h = h + "<tr style='color:red'>\n" +
                            "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].city + list[i].service + "</td>\n" +
                            "\t\t\t\t\t\t\t\t\t\t\t<td style='color:red'>" + list[i].sync_num + "</td>\n" +
                            "\t\t\t\t\t\t\t\t\t\t</tr>";
                    }else {
                        h = h + "<tr>\n" +
                            "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].city + list[i].service + "</td>\n" +
                            "\t\t\t\t\t\t\t\t\t\t\t<td>" + list[i].sync_num + "</td>\n" +
                            "\t\t\t\t\t\t\t\t\t\t</tr>";
                    }
                }
                $("#sev_table").html(h);
            })
        };
        $scope.system_run = function () {
            $http.get("rst/health.do?type=0").success(function (response) {
                $scope.sers = response.services;
                $scope.run_day = response.run_day;
            });
        };
        $scope.sync_days();
        $scope.sync_city_today();
        $scope.sync_city_lj();
        $scope.sync_service();
        $scope.tbl();
        $scope.sync_ljs();
        $scope.system_run();
        $scope.cityServiceMap();
        $scope.loadGjxxList();
        $scope.loadJkqkList();
        $scope.loadTableChange();
        $scope.dayChange();
        $scope.loadMap();
        $interval(function () {
            $scope.sync_city_today();
            $scope.sync_city_lj();
            $scope.sync_service();
            $scope.sync_ljs();
            $scope.sync_days();
            $scope.tbl();
            $scope.cityServiceMap();
            $scope.sync_days();
            $scope.loadGjxxList();
            $scope.loadJkqkList();
            $scope.loadTableChange();
            $scope.dayChange();
            $scope.loadMap();
        }, 60000);
    }
);