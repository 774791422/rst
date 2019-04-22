cBoard.controller('sceneCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval, FileUploader) {
    var translate = $filter('translate');
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadSceneList();
        }
    };
    $scope.loadSceneList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        var search=$scope.search;
        $http.post("scene/list.do", {pageNum: pageNum, pageSize: pageSize,search:search}).success(function (response) {
            $scope.sceneList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadSceneList();
    $scope.getStatus=function(status){
        if(status==1){
            return "是";
        }else{
            return "否";
        }
    }
    $scope.newScene = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/visual/scene/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("scene/save.do", {json: angular.toJson($scope.scene)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadSceneList();
                            $uibModalInstance.close();
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
            }
        });
    }
    $scope.editScene = function (id) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/visual/scene/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initData = function () {
                    $http.post("scene/get.do", {id: id}).success(function (json) {
                        if (json.state == "1") {
                            $scope.scene = json.data;
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("scene/update.do", {json: angular.toJson($scope.scene)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadSceneList();
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });
                };
            }
        });
    };

    $scope.deleteScene = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("scene/delete.do", {id: id}).success(function (json) {
                if (json.state == "1") {
                    $scope.loadSceneList();
                } else {
                    ModalUtils.alert("删除失败", "modal-warning", "lg");
                }
            });
        });
    };
    $scope.generateScene = function (id) {
        $http.post("scene/generateHtml.do", {id: id}).success(function (json) {
            if (json.state == "1") {
                ModalUtils.alert("生成成功", "modal-success", "lg");
                $scope.loadSceneList();
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
    $scope.view = function (id) {
        $http.post("scene/view.do", {id: id}).success(function (json) {
            if (json.state == "1") {
                window.open("/app/"+json.msg,"_blank");
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
});