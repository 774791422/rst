/**
 * Created by yuys on 2018/12/19
 */
cBoard.filter('textLengthSet', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');//'...'可以换成其它文字
    };
});
cBoard.controller('monitorChartCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    $scope.chartsMonitor = function () {
        var url = window.location.href;
        var string = url.split("?")[1].split("&");
        let obj = {};
        for (let i of string) {
            obj[i.split("=")[0]] = i.split("=")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
        }
        $http.post("monitor/charts.do", {id: obj.id}).success(function (data) {
            $scope.y_datetime = data.y_datetime;
            $scope.cpu = data.cpu;
            $scope.disk = data.disk;
            $scope.men = data.men;
            $scope.netIo = data.netIo;
            $scope.netIoOut = data.netIoOut;
            var option_cpu = {
                color: ['#3398DB'],
                title : {
                    text: 'CPU使用率', //主标题
                    x: 'left' //标题位置
                }, //图表标题
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    //top: '10%',
                    containLabel: true
                },
                tooltip: {
                    // show: true,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    name: '',
                    data: $scope.y_datetime,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        }
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        show: true,
                        interval: 0
                        //,
                        //rotate: 20,
                        // textStyle: {
                        //     color: "#00c7ff",
                        // }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '单位(%)',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        lineStyle: {
                            // color: "#063374",
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    name:'CPU使用率',
                    data: $scope.cpu,
                    barWidth: 10, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                   // color: '#00c7ff',
                                    color: '#FF0000',
                                    fontSize: 12
                                },
                                formatter: function (a) {
                                    var n;
                                    // n = Math.round((a.data /10000) * 100) / 100;
                                    n = a.data ;
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
            var option_disk = {
                color: ['#3398DB'],
                title : {
                    text: '存储使用率', //主标题
                    x: 'left' //标题位置
                }, //图表标题
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    //top: '10%',
                    containLabel: true
                },
                tooltip: {
                    // show: true,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: $scope.y_datetime,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        }
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        //rotate: 20,
                        // textStyle: {
                        //     color: "#00c7ff",
                        // }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '单位(%)',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    splitLine: {
                        lineStyle: {
                          //  color: "#063374",
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    name:'存储使用率',
                    data: $scope.disk,
                    barWidth: 10, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#9A32CD',
                                    fontSize: 12
                                },
                                formatter: function (a) {
                                    var n;
                                    // n = Math.round((a.data /10000) * 100) / 100;
                                    n = a.data ;
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
            var option_men = {
                color: ['#3398DB'],
                title : {
                    text: '内存使用率', //主标题
                    x: 'left' //标题位置
                }, //图表标题
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    //top: '10%',
                    containLabel: true
                },
                tooltip: {
                    // show: true,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: $scope.y_datetime,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        }
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        //rotate: 20,
                        // textStyle: {
                        //     color: "#00c7ff",
                        // }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '单位(%)',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    splitLine: {
                        lineStyle: {
                           // color: "#063374",
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    name:'内存使用率',
                    data: $scope.men,
                    barWidth: 10, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#00EE00',
                                    fontSize: 12
                                },
                                formatter: function (a) {
                                    var n;
                                    // n = Math.round((a.data /10000) * 100) / 100;
                                    n = a.data ;
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
            var option_netio = {
                color: ['#3398DB'],
                title : {
                    text: '网络接收/发送流量', //主标题
                    x: 'left' //标题位置
                }, //图表标题
                // legend: {
                //     x: 'left',
                //     width: 500,
                //     itemWidth: 14,
                //     itemHeight: 14,
                //     itemBorderRadius: 8,
                //     data:['接收','发送']
                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    //top: '10%',
                    containLabel: true
                },
                tooltip: {
                    // show: true,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: $scope.y_datetime,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        }
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        //rotate: 20,
                        textStyle: {
                          //  color: "#00c7ff",
                        }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '单位(MB)',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#063374",
                            width: 1,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        // show: false,
                        alignWithLabel: true
                    },
                    splitLine: {
                        lineStyle: {
                          //  color: "#063374",
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    name:'网络接收流量',
                    data: $scope.netIo,
                    barWidth: 10, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#009ACD',
                                    fontSize: 12
                                },
                                formatter: function (a) {
                                    var n;
                                    // n = Math.round((a.data /10000) * 100) / 100;
                                    n = a.data ;
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
                },{
                    type: 'line',
                    name:'网络发送流量',
                    data: $scope.netIoOut,
                    barWidth: 10, //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#00688B',
                                    fontSize: 12
                                },
                                formatter: function (a) {
                                    var n;
                                    // n = Math.round((a.data /10000) * 100) / 100;
                                    n = a.data ;
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
            var myChart_cpu = echarts.init(document.getElementById('cpu'));
            myChart_cpu.setOption(option_cpu);
            var myChart_disk = echarts.init(document.getElementById('disk'));
            myChart_disk.setOption(option_disk);
            var myChart_men = echarts.init(document.getElementById('men'));
            myChart_men.setOption(option_men);
            var myChart_netio = echarts.init(document.getElementById('netio'));
            myChart_netio.setOption(option_netio);
        });
    };
    $scope.interval = $interval(function () {
        $scope.chartsMonitor();
    }, 60000);

    $scope.chartsMonitor();
    $scope.back = function () {
        var url = window.location.href;
        url = url.split("#")[0];
        window.location.href = url + "#/config/monitor";
    };

});