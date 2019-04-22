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
cBoard.controller('monitorCtrl', function ($scope, $location, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    var translate = $filter('translate');
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadList();
        }
    };
    $scope.loadList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("monitor/list.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.monitorList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList();
    $scope.interval = $interval(function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("monitor/list.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.monitorList = response.list;
        });
    }, 5000);

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'monitorCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );


    $scope.newMonitor = function () {
        $uibModal.open({
            templateUrl: 'org/taiji/view/moniter/monitor/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("monitor/getHost.do", {json: angular.toJson($scope.monitor)}).success(function (flag) {
                        if (flag) {
                            $http.post("monitor/save.do", {json: angular.toJson($scope.monitor)}).success(function (serviceStatus) {
                                if (serviceStatus == 1) {
                                    ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                    $scope.$parent.loadList();
                                    $uibModalInstance.close();
                                } else {

                                }
                            });
                        } else {
                            ModalUtils.alert("ip地址重复，请重新输入");
                        }
                    });


                };
            }
        })
    };
    $scope.updateMonitor = function (id) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/moniter/monitor/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $http.post("monitor/get.do", {id: id}).success(function (json) {
                    if (json.state == "1") {
                        $scope.monitor = json.data;
                        $scope.monitor.id=id;
                    } else {
                        //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                    }
                });
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("monitor/getHost.do", {json: angular.toJson($scope.monitor)}).success(function (flag) {
                        if (flag) {
                            $http.post("monitor/update.do", {json: angular.toJson($scope.monitor)}).success(function (serviceStatus) {
                                if (serviceStatus == 1) {
                                    ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                    $scope.$parent.loadList();
                                    $uibModalInstance.close();
                                } else {
                                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                                }
                            });
                        } else {
                            ModalUtils.alert("ip地址重复，请重新输入");
                        }
                    });
                };
            }
        });
    };

    $scope.deleteMonitor = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("monitor/delete.do", {id: id}).success(function (serviceStatus) {
                if (serviceStatus == 1) {
                    $scope.loadList();
                } else {
                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                }
            });
        });
    };
    $scope.chartsMonitor = function (id) {
        var url = window.location.href;
        url = url.split("#")[0];
        window.location.href = url + "#/config/monitorChart?id=" + id;
    };
    $scope.getTime = function (t) {
        if (t) {
            return moment(Number(t)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "N/A"
        }
    };
    $scope.getState = function (t) {
        if (t) {
            switch (t) {
                case 0:
                    return "等待监控";
                case 1:
                    return "监控正常";
                case 2:
                    return "监控异常";
            }
        } else {
            return "N/A"
        }
    };

});