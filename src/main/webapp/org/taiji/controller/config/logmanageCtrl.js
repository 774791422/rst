/**
 * Created by niemj on 2019-2-22.
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
cBoard.controller('logmanageCtrl', function ($scope, $location, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
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
        $http.post("monitor/loglist.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.logmanageList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList();
    $scope.interval = $interval(function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("monitor/loglist.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.logmanageList = response.list;
        });
    }, 5000);
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'logmanageCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );
    $scope.getTime = function (t) {
        if (t) {
            return moment(Number(t)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "N/A"
        }
    };
});