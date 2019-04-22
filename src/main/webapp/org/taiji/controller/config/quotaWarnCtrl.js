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
cBoard.controller('quotaWarnCtrl', function ($scope, $location, $rootScope, $stateParams, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    var translate = $filter('translate');
    var url = window.location.href;
    let obj = {};
    if (url.indexOf("?") != -1) {
        var string = (url || "").split("?")[1].split("&");
        for (let i of string) {
            obj[i.split("=")[0]] = i.split("=")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
        }
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
    $scope.interval = $interval(function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("quota/listQuotaWarn.do", {
            parentid: obj.parentid,
            pageNum: pageNum,
            pageSize: pageSize
        }).success(function (response) {
            $scope.quotaDataList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    }, 5000);

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'quotaWarnCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );

    $scope.loadList = function (parentid) {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("quota/listQuotaWarn.do", {
            parentid: parentid,
            pageNum: pageNum,
            pageSize: pageSize
        }).success(function (response) {
            $scope.quotaDataList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.updateQuota = function (id, state) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/quota/quotaWarn/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $http.post("quota/getDataWarn.do", {id: id}).success(function (json) {
                    if (json.state == "1") {
                        $scope.warn = json.data;
                    } else {
                        //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                    }
                });
                $scope.cronConfig = {
                    quartz: true,
                    allowMultiple: true,
                    options: {
                        allowYear: false
                    }
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };

                $scope.ok = function () {
                    if (state != "1") {
                        $http.post("quota/okWarn.do", {json: angular.toJson($scope.warn)}).success(function (serviceStatus) {
                            if (serviceStatus == 1) {
                                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                $scope.$parent.loadList(obj.parentid);
                                $uibModalInstance.close();
                            } else {
                                ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                            }
                        });
                    } else {
                        $scope.$parent.loadList(obj.parentid);
                        $uibModalInstance.close();
                    }

                };
                $scope.save = function () {
                    if (state != "1") {
                        $http.post("quota/saveWarn.do", {json: angular.toJson($scope.warn)}).success(function (serviceStatus) {
                            if (serviceStatus == 1) {
                                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                $scope.$parent.loadList(obj.parentid);
                                $uibModalInstance.close();
                            } else {
                                ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                            }
                        });
                    } else {
                        $scope.$parent.loadList(obj.parentid);
                        $uibModalInstance.close();
                    }
                };
            }
        });
    };
    $scope.loadList(obj.parentid);

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
    $scope.getState = function (t) {
        if (t) {
            switch (t) {
                case 0:
                    return "未处理";
                case 1:
                    return "已处理";
            }
        } else {
            return "未处理"
        }
    };

});
