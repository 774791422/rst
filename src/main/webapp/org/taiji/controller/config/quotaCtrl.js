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
cBoard.controller('quotaCtrl', function ($scope, $location, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
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
    $scope.interval = $interval(function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("quota/list.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.quotaList = response.list;

        });
    }, 5000);

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'quotaCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );

    $scope.loadList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("quota/list.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.quotaList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList();
    $scope.newQuota = function () {
        $uibModal.open({
            templateUrl: 'org/taiji/view/quota/quota/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("quota/save.do", {json: angular.toJson($scope.quota)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadList();
                            $uibModalInstance.close();
                        } else {

                        }
                    });
                };
            }
        })
    };
    $scope.updateQuota = function (id) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/quota/quota/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $http.post("quota/get.do", {id: id}).success(function (json) {
                    if (json.state == "1") {
                        $scope.quota = json.data;
                    } else {

                    }
                });
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("quota/update.do", {json: angular.toJson($scope.quota)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadList();
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });
                };


            }
        });
    };
    $scope.wrenchQuota = function (id) {
        var url=window.location.href;
        url=url.split("#")[0];
        window.location.href=url+"#/config/quotaData?parentid="+id;
    };
    $scope.warnQuota = function (id) {
        var url=window.location.href;
        url=url.split("#")[0];
        window.location.href=url+"#/config/quotaWarn?parentid="+id;
    };


    $scope.deleteQuota = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("quota/delete.do", {id: id}).success(function (serviceStatus) {
                if (serviceStatus == 1) {
                    $scope.loadList();
                } else {
                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                }
            });
        });
    };
    $scope.getTime = function (t) {
        if (t) {
            return moment(Number(t)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "N/A"
        }
    };
});