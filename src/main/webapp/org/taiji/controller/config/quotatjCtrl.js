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
cBoard.controller('quotatjCtrl', function ($scope, $location, $rootScope, $stateParams, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50]
    };
    $scope.search={};
    $scope.search.selected = "";
    $scope.search.daterange={};
    $scope.searchSumbit = function () {
        if ($scope.search.daterange.startDate==undefined&&$scope.search.daterange.endDate==undefined) {
            alert("时间区间不为空");
        } else {
            $scope.loadList();
        }
    };
    $scope.flag = false;
    $scope.loadList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        $scope.search.pageNum=$scope.paginationConf.currentPage;
        $scope.search.pageSize=$scope.paginationConf.itemsPerPage;
        if($scope.search.selected==undefined||$scope.search.selected==""){
            $scope.search.id=0;
        }else{
            $scope.search.id=$scope.search.selected.id
        }

        $http.post("quota/search.do",  {json: angular.toJson($scope.search)}).success(function (response) {
            $scope.quotatjList = response.list;
            if (response.list.length > 0) {
                $scope.flag = true;
            } else {
                $scope.flag = false;
            }
            $scope.paginationConf.totalItems = response.total;
        });

        // $http.post("quota/search.do", {
        //     id: $scope.selected.id,
        //     startDate: moment($scope.daterange.startDate),
        //     endDate: moment($scope.daterange.endDate),
        //     pageNum: pageNum,
        //     pageSize: pageSize
        // }).success(function (response) {
        //     $scope.quotatjList = response.list;
        //     if (response.list.length > 0) {
        //         $scope.flag = true;
        //     } else {
        //         $scope.flag = false;
        //     }
        //     $scope.paginationConf.totalItems = response.total;
        // });
    };


    $scope.loadData = function () {
        $scope.dateRangeCfg = {
            locale: {
                format: "YYYY-MM-DD HH:mm:ss "
            }
        };
        $http.get("quota/getQuotaList.do").success(function (response) {
            $scope.quotaList = response.data;
        });
    };
    $scope.loadData();


})
