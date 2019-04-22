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
cBoard.controller('quotaDataCtrl', function ($scope, $location, $rootScope, $stateParams, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    var translate = $filter('translate');
    var url = window.location.href;
    var string = url.split("?")[1].split("&");
    let obj = {};
    for (let i of string) {
        obj[i.split("=")[0]] = i.split("=")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
    }
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadList(obj.parentid);
        }
    };


    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'quotaDataCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );

    $scope.loadList = function (parentid) {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("quota/listData.do", {
            parentid: parentid,
            pageNum: pageNum,
            pageSize: pageSize
        }).success(function (response) {
            $scope.quotaDataList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList(obj.parentid);
    /////////////////////数据集获取开始////////////////////////////////

    var loadDataset = function () {
        $http.get("dashboard/getDatasetList.do").success(function (response) {
            $scope.datasetList = response;
        });
    };

    loadDataset();


    $scope.datasetGroup = function (item) {
        return item.categoryName;
    };


    $scope.change = function (dataset){
        $scope.quota.datasource=dataset.data.datasource;
        $scope.quotaList=dataset.data.schema.measure;
        if($scope.quotaList.length>0){
            $scope.quota.quota=$scope.quotaList[0].column;
        }
    }
    var dataset_="";
    $scope.change_update = function (dataset){
        $("#quotaData").empty();
        $("#datasource").val("");
        $("#datasource").val(dataset.data.datasource);
        dataset_=dataset.id;
        var quotaList=dataset.data.schema.measure;
        for (var i = 0; i <quotaList.length ; i++) {
            $("#quotaData").append("<option value='"+quotaList[i].column+"'>"+quotaList[i].column+"</option>");
        }
    }
    $scope.quotaType=function(){
        if($scope.quota.quotatype==0){
            $("#quota_value").css('display','block');

        }else{
            $("#quota_value").css('display','none');

        }
    }


////////////////////////////////数据集获取结束///////////////////////////////
    $scope.quota={};
    $scope.quota.parentid=obj.parentid;
    $scope.newQuota = function () {
        $scope.quota={};
        $uibModal.open({
            templateUrl: 'org/taiji/view/quota/quotaData/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.quota.quotatype="0";
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    var t=$("#warnValue").val();//这个就是我们要判断的值了
                    if($scope.quota.quotatype=="0") {
                        if (!isNaN(t)) {
                            var json = {};
                            json.warnValue = $("#warnValue").val();
                            json.quota_value = $("#quota_value").val();
                            $scope.quota.warnValue = json;
                            $scope.quota.parentid = obj.parentid;
                            $http.post("quota/saveData.do", {json: angular.toJson($scope.quota)}).success(function (serviceStatus) {
                                if (serviceStatus== '1') {
                                    ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                    $scope.loadList(obj.parentid);
                                    $uibModalInstance.close();
                                } else {

                                }
                            });
                        } else {
                            alert("预警值设置的为非数值");
                        }
                    }else{
                        var json = {};
                        json.warnValue = $("#warnValue").val();
                        $scope.quota.warnValue = json;
                        $scope.quota.parentid = obj.parentid;
                        $http.post("quota/saveData.do", {json: angular.toJson($scope.quota)}).success(function (serviceStatus) {
                            if (serviceStatus == '1') {
                                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                $scope.loadList(obj.parentid);
                                $uibModalInstance.close();
                            } else {

                            }
                        });
                    }
                };
            }
        })
    };
    $scope.updateQuota = function (id,dataset) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/quota/quotaData/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $http.post("quota/getData.do", {id: id}).success(function (json) {
                    if (json.state == "1") {
                        $scope.quota = json.data;
                        $scope.quota.quotatype = "" + $scope.quota.quotatype;
                        var j = $.parseJSON($scope.quota.warnValue);
                        $scope.quota_value = j.quota_value + "";
                        $scope.warnValue = j.warnValue + "";
                        $("#parentid").val($scope.quota.parentid);
                        $("#datasource").val($scope.quota.datasource);
                    } else {
                        //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                    }
                });
                $http.post("quota/getDataSet.do", {id: dataset}).success(function (json) {
                    if (json.state == "1") {
                        var d = $.parseJSON(json.data.data);
                        $scope.quotaList = d.schema.measure;

                    } else {
                        //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                    }
                });
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.quota.parentid = $("#parentid").val();
                    $scope.quota.datasource = $("#datasource").val();
                    console.info($("#quotaData").val().indexOf("string:"));
                    if($("#quotaData").val().indexOf("string:")==0){
                        $scope.quota.quota = $("#quotaData").val().split(":")[1];
                    }else{
                        $scope.quota.quota = $("#quotaData").val();
                    }

                    var t = $("#warnValue").val();//这个就是我们要判断的值了
                    if ($scope.quota.quotatype == "0") {
                        if (!isNaN(t)) {
                            var json = {};
                            json.warnValue = $("#warnValue").val();
                            json.quota_value = $("#quota_value").val();
                            $scope.quota.warnValue = json;
                            $http.post("quota/updateData.do", {json: angular.toJson($scope.quota)}).success(function (serviceStatus) {
                                if (serviceStatus == '1') {
                                    ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                    $scope.loadList(obj.parentid);
                                    $uibModalInstance.close();
                                } else {
                                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                                }
                            });
                        } else {
                            alert("预警值设置的为非数值");
                        }
                    } else {
                        var json = {};
                        json.warnValue = $("#warnValue").val();
                        $scope.quota.warnValue = json;
                        $scope.quota.parentid = obj.parentid;
                        $http.post("quota/updateData.do", {json: angular.toJson($scope.quota)}).success(function (serviceStatus) {
                            if (serviceStatus == '1') {
                                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                $scope.loadList(obj.parentid);
                                $uibModalInstance.close();
                            } else {
                                ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                            }
                        });
                    }
                };
            }

        });
    };

    $scope.deleteQuota = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("quota/deleteData.do", {id: id}).success(function (serviceStatus) {
                if (serviceStatus== '1') {
                    $scope.loadList(obj.parentid);
                } else {
                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                }
            });
        });
    };
    $scope.back = function () {
        var url = window.location.href;
        url = url.split("#")[0];
        window.location.href = url + "#/config/quota";
    };

    $scope.getTime = function (t) {
        if (t) {
            return moment(Number(t)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "N/A"
        }
    };

})
