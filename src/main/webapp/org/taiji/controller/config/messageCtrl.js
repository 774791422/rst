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
cBoard.controller('messageCtrl', function ($scope, $location, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
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


    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (fromState.controller == 'messageCtrl') {
                $interval.cancel($scope.interval);
            }
        }
    );

    $scope.loadList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $http.post("message/list.do", {pageNum: pageNum, pageSize: pageSize}).success(function (response) {
            $scope.messageList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList();
    $scope.viewMessage = function (id) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/message/message/view.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $http.post("message/get.do", {id: id}).success(function (json) {
                    if (json.state == "1") {
                        $scope.message = json.data;
                    } else {

                    }
                });
                $scope.close = function () {
                    $scope.$parent.loadList();
                    $uibModalInstance.close();
                };

            }
        })
    };
    $scope.getTipState = function (t) {
        if (t) {
            switch (t) {
                case 0:
                    return "未提醒";
                case 1:
                    return "已提醒";
            }
        } else {
            return "N/A"
        }
    };

    $scope.getReadstate = function (t) {
        if (t) {
            switch (t) {
                case 0:
                    return "未读";
                case 1:
                    return "已读";
            }
        } else {
            return "未读"
        }
    };


    $scope.getTime = function (t) {
        if (t) {
            return moment(Number(t)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "N/A"
        }
    };
});