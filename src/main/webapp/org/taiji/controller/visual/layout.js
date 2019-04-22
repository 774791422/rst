cBoard.controller('layoutCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval, FileUploader) {
    var translate = $filter('translate');
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadLayoutList();
        }
    };
    $scope.loadLayoutList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        var search=$scope.search;
        $http.post("layout/list.do", {pageNum: pageNum, pageSize: pageSize,search:search}).success(function (response) {
            $scope.layoutList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadLayoutList();
    $scope.newLayout = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/visual/layout/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initScene = function () {
                    $http.post("scene/listGenerate.do").success(function (json) {
                        $scope.sceneList = json;
                    });
                };
                $scope.changeDs=function(){
                    $scope.sceneId=$scope.sceneSelect.id;
                }
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.layout.sceneId=$scope.sceneId;
                    $http.post("layout/save.do", {json: angular.toJson($scope.layout)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadLayoutList();
                            $uibModalInstance.close();
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
            }
        });
    }

    $scope.deleteLayout = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("layout/delete.do", {id: id}).success(function (json) {
                if (json.state == "1") {
                    $scope.loadLayoutList();
                } else {
                    ModalUtils.alert("删除失败", "modal-warning", "lg");
                }
            });
        });
    };
    $scope.xmlayout = function (id) {
        $http.post("layout/layout.do", {id: id}).success(function (json) {
            if (json.state == "1") {
                window.open("/app/"+json.msg+"?layout="+json.layout+"&optype=design","_blank");
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
    $scope.view = function (id) {
        $http.post("layout/layout.do", {id: id}).success(function (json) {
            if (json.state == "1") {
                window.open("/app/"+json.msg+"?layout="+json.layout,"_blank");
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
});