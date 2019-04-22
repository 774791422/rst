/**
 * Created by yfyuan on 2016/8/12.
 */
'use strict';
cBoard.controller('templateViewCtrl', function ($scope, $state, $stateParams, $http, $uibModal, dataService, ModalUtils, updateService, $filter, chartService, $timeout) {

        var translate = $filter('translate');
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
        $scope.getWidget=function(elementId,widgetId,isCockpit){
            $http.post("/dashboard/dashboardWidget.do", {id: widgetId}).success(function (response) {
                $scope.curWidget=response.data;
                $scope.preview(elementId,isCockpit);
            });
        }
        $scope.preview = function (elementId,isCockpit) {
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
                            option.toolbox = {
                                feature: {
                                    dataView: {
                                        show : true,
                                        readOnly : false,
                                        lang: ['数据视图', '关闭', '导出'],
                                        optionToContent : function(opt) {
                                            var axisData = opt.xAxis[0].data;
                                            var series = opt.series;
                                            var tdHeaders = '<td>维度\\指标</td>';
                                            series.forEach(function(item) {
                                                tdHeaders += '<td>' + item.name + '</td>';
                                            });
                                            var table = '<div class="table-responsive"><table id="export_table_id" class="table table-bordered table-striped table-hover" style="text-align:center"><tr>' + tdHeaders + '</tr>';
                                            var tdBodys = '';
                                            for (let i = 0, l = axisData.length; i < l; i++) {
                                                for (let j = 0; j < series.length; j++) {
                                                    tdBodys += '<td>' + series[j].data[i] + '</td>';
                                                }
                                                table += '<tr><td>' + axisData[i] + '</td>' + tdBodys + '</tr>';
                                                tdBodys = '';
                                            }

                                            table += '</table></div>';
                                            return table;
                                        },
                                        contentToOption: function (opt) {
                                            $("#export_table_id").table2excel({
                                                filename: new Date().toISOString().replace(/[\-\:\.]/g, "")+"数据视图",
                                                fileext: ".xls",
                                                exclude_img: true,
                                                exclude_links: true,
                                                exclude_inputs: true
                                            });
                                        },
                                    }
                                }
                            };
                            break;
                        case 'pie':
                            $scope.previewDivWidth = 12;
                            option.toolbox = {
                                feature: {
                                    dataView: {
                                        show: true,
                                        readOnly: true
                                    }
                                }
                            };
                            break;
                        case 'kpi':
                            $scope.previewDivWidth = 6;
                            break;
                        case 'table':
                            $scope.previewDivWidth = 12;
                            break;
                        case 'funnel':
                            $scope.previewDivWidth = 12;
                            option.toolbox = {
                                feature: {
                                    dataView: {
                                        show: true,
                                        readOnly: true
                                    }
                                }
                            };
                            break;
                        case 'sankey':
                            $scope.previewDivWidth = 12;
                            option.toolbox = {
                                feature: {
                                    dataView: {
                                        show: true,
                                        readOnly: true
                                    }
                                }
                            };
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
                }, null, !$scope.loadFromCache,null,null,isCockpit);
            }
        };
    });
