cBoard.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(
        {
            enabled: true,
            requireBase: false
        }
    );
}]);
cBoard.controller('xmlayoutCtrl', function ($scope, $state, $stateParams, $http, $uibModal, dataService, ModalUtils, updateService, $filter, chartService, $timeout,$location,uuid4) {
    var translate = $filter('translate');
    $scope.layout= $location.search().layout;
    $scope.optype= $location.search().optype;
    var xm_main = $.xmlayout.layout($("#main_div"));
    var rootObj=null;
    var disableDiv=[];
    $scope.initLayout=function () {
        $http.post("/layout/getInit.do", {id:$scope.layout}).success(function (response) {
            rootObj=xm_main.design(response.data.rows,response.data.cols,0,null,[false, false]);
            xm_main.init({
                data: xm_main.getData(),
                isdestroy : false,
                playuseable : true,
                drag_bar_color : "white",
                pborder : "1px solid #CCCCCC",
                drag_bar_unit : 3
            });
            var panels=xm_main.getPanels();
            for(var i = 0; i < panels.length; i++){
                var div_id=panels[i].prop("indexp");
                document.getElementById(div_id).onclick=function () {
                    var divId=this.id;
                    var modalInstance = $uibModal.open({
                        templateUrl: '/org/taiji/view/visual/layout/widget.html',
                        windowTemplateUrl: '/org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'lg',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.initWidget = function () {
                                $http.post("/layout/listWidget.do").success(function (json) {
                                    $scope.widgetList = json;
                                });
                            };
                            $scope.changeDs=function(){
                                $scope.widgetId=$scope.widgetSelect.id;
                                $scope.widgetName=$scope.widgetSelect.name;
                            }
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                $http.post("/layout/updateWidget.do", {"id":$scope.$parent.layout,"div":divId,"widgetId":$scope.widgetId,"widgetName":$scope.widgetName}).success(function (serviceStatus) {
                                    if (serviceStatus == 1) {
                                        ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "mid");
                                        $scope.$parent.bindWidget(divId,$scope.widgetName);
                                        $uibModalInstance.close();
                                    } else {
                                        $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                                    }
                                });
                            };
                        }
                    });
                };
                document.getElementById(div_id).oncontextmenu=function () {
                    var divId=this.id;
                    var modalInstance = $uibModal.open({
                        templateUrl: '/org/taiji/view/visual/layout/design.html',
                        windowTemplateUrl: '/org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'lg',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.initWidget = function () {
                                $http.post("/layout/listWidget.do").success(function (json) {
                                    $scope.widgetList = json;
                                });
                            };
                            $scope.changeDs=function(){
                                $scope.widgetId=$scope.widgetSelect.id;
                                $scope.widgetName=$scope.widgetSelect.name;
                            }
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                $http.post("/layout/updateWidgetDesign.do", {"id":$scope.$parent.layout,"div":divId,"rows":$scope.rows,"cols":$scope.cols}).success(function (serviceStatus) {
                                    if (serviceStatus == 1) {
                                        ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "mid");
                                        disableDiv.push(divId);
                                        $scope.$parent.initDedign(divId,$scope.rows,$scope.cols);
                                        $uibModalInstance.close();
                                    } else {
                                        $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                                    }
                                });
                            };
                        }
                    });
                }
            }
        });
    };
    $scope.initDedign=function(id,rows,cols){
        rootObj.getData(id).design(rows,cols,0,null,[false, false]);
        xm_main.init({
            data: xm_main.getData(),
            isdestroy : false,
            playuseable : false,
            drag_bar_color : "white",
            pborder : "1px solid #CCCCCC",
            drag_bar_unit : 3
        });
        var panels=xm_main.getPanels();
        for(var i = 0; i < panels.length; i++){
            var div_id=panels[i].prop("indexp");
            if(disableDiv.indexOf(div_id)==-1){
                document.getElementById(div_id).onclick=function () {
                    var divId=this.id;
                    var modalInstance = $uibModal.open({
                        templateUrl: '/org/taiji/view/visual/layout/widget.html',
                        windowTemplateUrl: '/org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'lg',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.initWidget = function () {
                                $http.post("/layout/listWidget.do").success(function (json) {
                                    $scope.widgetList = json;
                                });
                            };
                            $scope.changeDs=function(){
                                $scope.widgetId=$scope.widgetSelect.id;
                                $scope.widgetName=$scope.widgetSelect.name;
                            }
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                $http.post("/layout/updateWidget.do", {"id":$scope.$parent.layout,"div":divId,"widgetId":$scope.widgetId,"widgetName":$scope.widgetName}).success(function (serviceStatus) {
                                    if (serviceStatus == 1) {
                                        ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "mid");
                                        $scope.$parent.bindWidget(divId,$scope.widgetName);
                                        $uibModalInstance.close();
                                    } else {
                                        $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                                    }
                                });
                            };
                        }
                    });
                }
                if(div_id.split(";").length==1){
                    document.getElementById(div_id).oncontextmenu=function () {
                        var divId=this.id;
                        var modalInstance = $uibModal.open({
                            templateUrl: '/org/taiji/view/visual/layout/design.html',
                            windowTemplateUrl: '/org/taiji/view/util/modal/window.html',
                            backdrop: false,
                            size: 'lg',
                            scope: $scope,
                            controller: function ($scope, $uibModalInstance) {
                                $scope.initWidget = function () {
                                    $http.post("/layout/listWidget.do").success(function (json) {
                                        $scope.widgetList = json;
                                    });
                                };
                                $scope.changeDs=function(){
                                    $scope.widgetId=$scope.widgetSelect.id;
                                    $scope.widgetName=$scope.widgetSelect.name;
                                }
                                $scope.close = function () {
                                    $uibModalInstance.close();
                                };
                                $scope.ok = function () {
                                    $http.post("/layout/updateWidgetDesign.do", {"id":$scope.$parent.layout,"div":divId,"rows":$scope.rows,"cols":$scope.cols}).success(function (serviceStatus) {
                                        if (serviceStatus == 1) {
                                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "mid");
                                            disableDiv.push(divId);
                                            $scope.$parent.initDedign(divId,$scope.rows,$scope.cols);
                                            $uibModalInstance.close();
                                        } else {
                                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                                        }
                                    });
                                };
                            }
                        });
                    }
                }
            }
        }
    }
    $scope.bindWidget=function(div_id,widgetName){
        document.getElementById(div_id).innerHTML=widgetName;
    };
    $scope.saveXmlayout=function () {
        var data=xm_main.getData();
        $http.post("/layout/updateInfo.do", {"id":$scope.layout,"data":angular.toJson(data)}).success(function (serviceStatus) {
            if (serviceStatus == 1) {
                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "mid");
            } else {
                $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
            }
        });
    }
    $scope.loadLayout=function () {
        $http.post("/layout/get.do", {id:$scope.layout}).success(function (json) {
            $scope.layoutData=angular.fromJson(json.data.layoutInfo);
            xm_main.design(json.data.rows,json.data.cols,0,null,[false, false]);
            xm_main.init({
                data: $scope.layoutData,
                isdestroy : false,
                playuseable : false,
                drag_bar_color : "white",
                pborder : "1px solid #CCCCCC",
                drag_bar_unit : 3
            });
            var panels=xm_main.getPanels();
            var widgetJson=angular.fromJson(json.data.layoutWidget);
            for(var i = 0; i < panels.length; i++){
                var div_id=panels[i].prop("indexp");
                $scope.bindWidget(div_id,widgetJson[div_id].widgetName);
                document.getElementById(div_id).onclick=function () {
                    var divId=this.id;
                    var modalInstance = $uibModal.open({
                        templateUrl: '/org/taiji/view/visual/layout/widget.html',
                        windowTemplateUrl: '/org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'lg',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.initWidget = function () {
                                $http.post("/layout/listWidget.do").success(function (json) {
                                    $scope.widgetList = json;
                                });
                            };
                            $scope.changeDs=function(){
                                $scope.widgetId=$scope.widgetSelect.id;
                                $scope.widgetName=$scope.widgetSelect.name;
                            }
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                $http.post("/layout/updateWidget.do", {"id":$scope.$parent.layout,"div":divId,"widgetId":$scope.widgetId,"widgetName":$scope.widgetName}).success(function (serviceStatus) {
                                    if (serviceStatus == 1) {
                                        ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "mid");
                                        $scope.$parent.bindWidget(divId,$scope.widgetName);
                                        $uibModalInstance.close();
                                    } else {
                                        $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                                    }
                                });
                            };
                        }
                    });
                }
            }
        });
    }
    $scope.viewLayout=function(){
        $http.post("/layout/get.do", {id:$scope.layout}).success(function (json) {
            $scope.layoutData=angular.fromJson(json.data.layoutInfo);
            xm_main.init({
                data: $scope.layoutData,
                isdestroy : false,
                playuseable : true,
                drag_bar_color : "white",
                pborder : "1px solid #CCCCCC",
                drag_bar_unit : 3
            });
            var panels=xm_main.getPanels();
            var widgetJson=angular.fromJson(json.data.layoutWidget);
            for(var i = 0; i < panels.length; i++){
                var div_id=panels[i].prop("indexp");
                var uuid=uuid4.generate();
                document.getElementById(div_id).innerHTML="<div id='"+uuid+"' style='width: 100%;height: 100%'></div>";
                if(widgetJson[div_id]){
                    if(widgetJson[div_id].widget){
                        $scope.getWidget(uuid,widgetJson[div_id].widgetId);
                        panels[i].loadElement($("#"+uuid),null,"幻灯片",null);
                    }
                }
            }
        });
    }
    $scope.loadData=function(){
        if($scope.optype=="design"){
            $scope.shows=true;
        }else{
            $scope.shows=false;
            $scope.viewLayout();
        }
    }
    $scope.loadData();
    //图表类型初始化
    $scope.chart_types = [
        {
            name: translate('CONFIG.WIDGET.TABLE'), value: 'table', class: 'cTable',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.LINE_BAR'), value: 'line', class: 'cLine',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.CONTRAST'), value: 'contrast', class: 'cContrast',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_2')
        },
        {
            name: translate('CONFIG.WIDGET.SCATTER'), value: 'scatter', class: 'cScatter',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.PIE'), value: 'pie', class: 'cPie',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.KPI'), value: 'kpi', class: 'cKpi',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.FUNNEL'), value: 'funnel', class: 'cFunnel',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.SANKEY'), value: 'sankey', class: 'cSankey',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.RADAR'), value: 'radar', class: 'cRadar',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.MAP'), value: 'map', class: 'cMap',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.GAUGE'), value: 'gauge', class: 'cGauge',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.WORD_CLOUD'), value: 'wordCloud', class: 'cWordCloud',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.TREE_MAP'), value: 'treeMap', class: 'cTreeMap',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.HEAT_MAP_CALENDER'), value: 'heatMapCalendar', class: 'cHeatMapCalendar',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.HEAT_MAP_TABLE'), value: 'heatMapTable', class: 'cHeatMapTable',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.LIQUID_FILL'), value: 'liquidFill', class: 'cLiquidFill',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.AREA_MAP'), value: 'areaMap', class: 'cAreaMap',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.CHINA_MAP'), value: 'chinaMap', class: 'cChinaMap',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.CHINA_MAP_BMAP'), value: 'chinaMapBmap', class: 'cChinaMapBmap',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE')
        },
        {
            name: translate('CONFIG.WIDGET.RELATION'), value: 'relation', class: 'cRelation',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_2'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_2'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        },
        {
            name: translate('CONFIG.WIDGET.WORLD_MAP'), value: 'worldMap', class: 'cWorldMap',
            row: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1_MORE'),
            column: translate('CONFIG.WIDGET.TIPS_DIM_NUM_0_MORE'),
            measure: translate('CONFIG.WIDGET.TIPS_DIM_NUM_1')
        }
    ];

    $scope.chart_types_status = {
        "line": true, "pie": true, "kpi": true, "table": true,
        "funnel": true, "sankey": true, "radar": true, "map": true,
        "scatter": true, "gauge": true, "wordCloud": true, "treeMap": true,
        "heatMapCalendar": true, "heatMapTable": true, "liquidFill": true,
        "areaMap": true, "contrast": true,"chinaMap":true,"chinaMapBmap":true,
        "relation":true, "worldMap": true
    };

    $scope.value_series_types = [
        {name: translate('CONFIG.WIDGET.LINE'), value: 'line'},
        {name: translate('CONFIG.WIDGET.AREA_LINE'),value:'arealine'},
        {name: translate('CONFIG.WIDGET.STACKED_LINE'),value:'stackline'},
        {name: translate('CONFIG.WIDGET.PERCENT_LINE'),value:'percentline'},
        {name: translate('CONFIG.WIDGET.BAR'), value: 'bar'},
        {name: translate('CONFIG.WIDGET.STACKED_BAR'), value: 'stackbar'},
        {name: translate('CONFIG.WIDGET.PERCENT_BAR'), value: 'percentbar'}
    ];

    $scope.china_map_types = [
        {name: translate('CONFIG.WIDGET.SCATTER_MAP'), value: 'scatter'},
        {name: translate('CONFIG.WIDGET.HEAT_MAP'), value: 'heat'},
        {name: translate('CONFIG.WIDGET.MARK_LINE_MAP'), value: 'markLine'}
    ];

    $scope.value_aggregate_types = [
        {name: 'sum', value: 'sum'},
        {name: 'count', value: 'count'},
        {name: 'avg', value: 'avg'},
        {name: 'max', value: 'max'},
        {name: 'min', value: 'min'},
        {name: 'distinct', value: 'distinct'}
    ];

    $scope.value_pie_types = [
        {name: translate('CONFIG.WIDGET.PIE'), value: 'pie'},
        {name: translate('CONFIG.WIDGET.DOUGHNUT'), value: 'doughnut'},
        {name: translate('CONFIG.WIDGET.COXCOMB'), value: 'coxcomb'}
    ]

    $scope.kpi_styles = [
        {name: translate('CONFIG.WIDGET.AQUA'), value: 'bg-aqua'},
        {name: translate('CONFIG.WIDGET.RED'), value: 'bg-red'},
        {name: translate('CONFIG.WIDGET.GREEN'), value: 'bg-green'},
        {name: translate('CONFIG.WIDGET.YELLOW'), value: 'bg-yellow'}
    ];

    $.getJSON('/plugins/FineMap/mapdata/citycode.json', function (data) {
        $scope.provinces = data.provinces;
    });



    $scope.treemap_styles = [
        {name: translate('CONFIG.WIDGET.RANDOM'), value: 'random'},
        {name: translate('CONFIG.WIDGET.MULTI'), value: 'multi'},
        {name: translate('CONFIG.WIDGET.BLUE'), value: 'blue'},
        {name: translate('CONFIG.WIDGET.RED'), value: 'red'},
        {name: translate('CONFIG.WIDGET.GREEN'), value: 'green'},
        {name: translate('CONFIG.WIDGET.YELLOW'), value: 'yellow'},
        {name: translate('CONFIG.WIDGET.PURPLE'), value: 'purple'}
    ];

    $scope.heatmap_styles = [
        {name: translate('CONFIG.WIDGET.BLUE'), value: 'blue'},
        {name: translate('CONFIG.WIDGET.RED'), value: 'red'},
        {name: translate('CONFIG.WIDGET.GREEN'), value: 'green'},
        {name: translate('CONFIG.WIDGET.YELLOW'), value: 'yellow'},
        {name: translate('CONFIG.WIDGET.PURPLE'), value: 'purple'}
    ];

    $scope.heatmap_date_format = [
        {name: 'yyyy-MM-dd', value: 'yyyy-MM-dd'},
        {name: 'yyyy/MM/dd', value: 'yyyy/MM/dd'},
        {name: 'yyyyMMdd', value: 'yyyyMMdd'}
    ];

    $scope.liquid_fill_style = [
        {name: translate('CONFIG.WIDGET.CIRCLE'), value: 'circle'},
        {name: translate('CONFIG.WIDGET.PIN'), value: 'pin'},
        {name: translate('CONFIG.WIDGET.RECT'), value: 'rect'},
        {name: translate('CONFIG.WIDGET.ARROW'), value: 'arrow'},
        {name: translate('CONFIG.WIDGET.TRIANGLE'), value: 'triangle'},
        {name: translate('CONFIG.WIDGET.ROUND_RECT'), value: 'roundRect'},
        {name: translate('CONFIG.WIDGET.SQUARE'), value: 'square'},
        {name: translate('CONFIG.WIDGET.DIAMOND'), value: 'diamond'}
    ];

    /***************************************
     *  0:  None items
     *  1:  only 1 item
     * -1:  None Restrict
     *  2:  1 or more
     ***************************************/
    $scope.configRule = {
        line: {keys: 2, groups: -1, filters: -1, values: 2},
        pie: {keys: 2, groups: -1, filters: -1, values: 2},
        kpi: {keys: 0, groups: 0, filters: -1, values: 1},
        table: {keys: -1, groups: -1, filters: -1, values: -1},
        funnel: {keys: -1, groups: 0, filters: -1, values: 2},
        sankey: {keys: 2, groups: 2, filters: -1, values: 1},
        radar: {keys: 2, groups: -1, filters: -1, values: 2},
        map: {keys: 2, groups: -1, filters: -1, values: 2},
        scatter: {keys: 2, groups: -1, filters: -1, values: 2},
        gauge: {keys: 0, groups: 0, filters: -1, values: 1},
        wordCloud: {keys: 2, groups: 0, filters: -1, values: 1},
        treeMap: {keys: 2, groups: 0, filters: -1, values: 1},
        areaMap: {keys: 2, groups: -1, filters: -1, values: 1},
        heatMapCalendar: {keys: 1, groups: 0, filters: -1, values: 1},
        heatMapTable: {keys: 2, groups: 2, filters: -1, values: 1},
        liquidFill: {keys: 0, groups: 0, filters: -1, values: 1},
        contrast: {keys: 1, groups: 0, filters: -1, values: 2},
        chinaMap:{keys: 2, groups: -1, filters: -1, values: 2},
        chinaMapBmap:{keys: 2, groups: -1, filters: -1, values: 2},
        relation: {keys: 2, groups: 2, filters: -1, values: 1},
        worldMap: {keys: 2, groups: -1, filters: -1, values: 1}
    };

    $scope.switchLiteMode = function (mode) {
        if (mode) {
            $scope.liteMode = mode;
            $scope.$parent.$parent.liteMode = mode;
        } else {
            $scope.liteMode = !$scope.liteMode;
            $scope.$parent.$parent.liteMode = $scope.liteMode;
        }
    }

    //界面控制
    $scope.loading = false;
    $scope.toChartDisabled = true;
    $scope.optFlag = '';
    $scope.alerts = [];
    $scope.treeData = [];
    var originalData = [];
    var treeID = 'widgetTreeID'; // Set to a same value with treeDom

    $scope.datasource;
    $scope.widgetName;
    $scope.widgetCategory;
    $scope.widgetId;
    $scope.curWidget = {};
    $scope.previewDivWidth = 12;
    $scope.expressions = [];
    $scope.customDs = false;
    $scope.loadFromCache = true;
    $scope.filterSelect = {};
    $scope.verify = {widgetName: true};
    $scope.params = [];
    $scope.curDataset;
    $scope.getWidget=function(elementId,widgetId){
        $http.post("/dashboard/dashboardWidget.do", {id: widgetId}).success(function (response) {
            $scope.curWidget=response.data;
            $scope.preview(elementId);
        });
    }
    $scope.preview = function (elementId) {
        var charType = $scope.curWidget.config.chart_type;
        if (charType == 'chinaMapBmap') {
            chartService.render($('#'+elementId), {
                config: $scope.curWidget.config,
                datasource: $scope.datasource ? $scope.datasource.id : null,
                query: $scope.curWidget.query,
                datasetId: $scope.customDs ? undefined : $scope.curWidget.datasetId
            });
            $scope.loadingPre = false;
        } else {
            chartService.render($('#'+elementId), {
                config: $scope.curWidget.config,
                datasource: $scope.datasource ? $scope.datasource.id : null,
                query: $scope.curWidget.query,
                datasetId: $scope.customDs ? undefined : $scope.curWidget.datasetId
            }, function (option) {
                switch ($scope.curWidget.config.chart_type) {
                    case 'line':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'pie':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'kpi':
                        $scope.previewDivWidth = 6;
                        break;
                    case 'table':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'funnel':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'sankey':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'map':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'areaMap':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'chinaMap':
                        $scope.previewDivWidth = 12;
                        break;
                    case 'relation':
                        $scope.previewDivWidth = 12;
                        break;
                }
                $scope.loadingPre = false;
            }, null, !$scope.loadFromCache);
        }
    };
});