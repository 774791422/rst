cBoard.controller('menuAdminCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval) {
    var translate = $filter('translate');
    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    };
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function(){
            $scope.loadMenuList();
        }
    };
    var zNodes =[];
    $scope.loadMenuList = function () {
        var pageNum=$scope.paginationConf.currentPage;
        var pageSize=$scope.paginationConf.itemsPerPage;
        $http.post("menu/list.do",{pageNum:pageNum,pageSize:pageSize}).success(function (response) {
            $scope.menuList = response.list;
            $scope.paginationConf.totalItems=response.total;
        });
    };
    $scope.loadMenuList();

    $scope.newMenu = function () {
        var modalInstance= $uibModal.open({
            templateUrl: 'org/taiji/view/admin/menu/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initTree=function(){
                    $http.post("menu/initTree.do").success(function (json) {
                        if (json.state == "1") {
                            zNodes=json.data;
                            $.fn.zTree.init($("#tree"), setting, zNodes);
                        } else {
                            //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    console.log($scope.menu);
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    var nodes = treeObj.getCheckedNodes(true);
                    for (var i = 0; i < nodes.length; i++) {
                        $scope.menu.parentId=nodes[i].id;
                    }
                    $http.post("menu/save.do", {json: angular.toJson($scope.menu)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadMenuList();
                            $uibModalInstance.close();
                        } else {
                            //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
            }
        });
    }
    $scope.editMenu = function (menuId) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/admin/menu/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initData=function(){
                    $http.post("menu/get.do",{menuId:menuId}).success(function (json) {
                        if (json.state == "1") {
                            $scope.menu=json.data;
                        } else {
                            //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.initTree=function(){
                    $http.post("menu/initTree.do",{menuId:menuId}).success(function (json) {
                        if (json.state == "1") {
                            zNodes=json.data;
                            $.fn.zTree.init($("#tree"), setting, zNodes);
                        } else {
                            //$scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                        $http.post("menu/update.do", {json: angular.toJson($scope.menu)}).success(function (serviceStatus) {
                            if (serviceStatus == 1) {
                                ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                $scope.$parent.loadMenuList();
                                $uibModalInstance.close();
                            } else {
                                ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                            }
                        });
                };
            }
        });
    };

    $scope.deleteMenu = function (menuId) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("menu/delete.do", {menuId: menuId}).success(function (serviceStatus) {
                if (serviceStatus == 1) {
                    $scope.loadMenuList();
                } else {
                    ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                }
            });
        });
    };
});