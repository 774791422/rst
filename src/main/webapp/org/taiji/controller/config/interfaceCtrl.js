/**
 * Created by yuys on 2018/12/19
 */
cBoard.filter('textLengthSet', function() {
    return function(value, wordwise, max, tail) {
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
cBoard.controller('interfaceCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    var translate = $filter('translate');
    $scope.apiType = [{name: 'POST', type: 'post'},{name: 'GET', type: 'get'}];
    $scope.apiMode = [{name: 'HTTP', type: 'http'},{name: 'WEBSERVICE', type: 'webservice'}];
    $scope.interval = $interval(function () {
        $http.get("interface/getInterfaceList.do").success(function (response) {
            _.each($scope.apiList, function (e) {
                var j = _.find(response, function (r) {
                    return e.id == r.id;
                });
                e.apiStatus = j.apiStatus;
                e.apiState=j.apiState;
                e.lastExecTime = j.lastExecTime;
            });
        });
    }, 5000);
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function(){
            $scope.loadApiList();
        }
    };
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'interfaceCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );

    $scope.loadApiList = function () {
        var pageNum=$scope.paginationConf.currentPage;
        var pageSize=$scope.paginationConf.itemsPerPage;
        $http.get("interface/getInterfaceList.do",{pageNum:pageNum,pageSize:pageSize}).success(function (response) {
            $scope.apiList = response.list;
            $scope.paginationConf.totalItems=response.total;
        });
    };
    $scope.loadApiList();


    $scope.getTime = function (t) {
        if (t) {
            return moment(Number(t)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "N/A"
        }
    };

    $scope.getDateRange = function (d) {
        if (d) {
            return moment(d.startDate).format("YYYY-MM-DD") + ' ~ ' + moment(d.endDate).format("YYYY-MM-DD");
        } else {
            return "N/A"
        }
    };

    $scope.getStatus = function (t) {
        if (t != null) {
            switch (t) {
                case 0:
                    return "接口异常";
                case 1:
                    return "接口正常";
                case 2:
                    return "接口待检查";
                case 3:
                    return "接口暂停";
            }
        } else {
            return "N/A"
        }
    };

    $scope.showLog = function (api) {
        ModalUtils.alert(api.execLog ? api.execLog : "N/A", null, "lg");
    };

    $scope.runApi = function (api,state) {
       $http.post("interface/execApi.do", {id: api.id,state:state}).success(function (serviceStatus) {
           if (serviceStatus.status == '1') {
               $scope.loadApiList();
           } else {
               $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
           }
       });
    };

    $scope.editApi = function (api) {
       $uibModal.open({
           templateUrl: 'org/taiji/view/config/modal/api/edit.html',
           windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
           backdrop: false,
           size: 'lg',
           scope: $scope,
           controller: function ($scope, $uibModalInstance) {
               $scope.selectChange = function () {
                   return $scope.api.apiMode=="webservice";
               }
               $scope.cronConfig = {
                   quartz: true,
                   allowMultiple: true,
                   options: {
                       allowYear: false
                   }
               };
               $scope.dateRangeCfg = {
                   locale: {
                       format: "YYYY-MM-DD"
                   }
               };

               if (api) {
                   $scope.api = angular.copy(api);
               }
               $scope.close = function () {
                   $uibModalInstance.close();
               };
               $scope.ok = function () {
                   if (api) {
                       $http.post("interface/updateApi.do", {json: angular.toJson($scope.api)}).success(function (serviceStatus) {
                           if (serviceStatus.status == '1') {
                               ModalUtils.alert(translate("修改成功"), "modal-success", "sm");
                               $scope.$parent.loadApiList();
                               $uibModalInstance.close();
                           } else {
                               ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                           }
                       });
                   } else {
                       $http.post("interface/saveApi.do", {json: angular.toJson($scope.api)}).success(function (serviceStatus) {
                           if (serviceStatus.status == '1') {
                               ModalUtils.alert(translate("保存成功"), "modal-success", "sm");
                               $scope.$parent.loadApiList();
                               $uibModalInstance.close();
                           } else {
                               //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                           }
                       });
                   }
               };
           }
       });
    };
    $scope.deleteApi = function (api) {
       ModalUtils.confirm(translate("是否删除"), "modal-info", "lg", function () {
           $http.post("interface/deleteApi.do", {id: api.id}).success(function (serviceStatus) {
               if (serviceStatus.status == '1') {
                   $scope.loadApiList();
               } else {
                   ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
               }
           });
       });
    };
});