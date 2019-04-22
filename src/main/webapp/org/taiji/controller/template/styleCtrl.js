cBoard.controller('styleCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval, FileUploader) {
    var translate = $filter('translate');
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadStyleList();
        }
    };
    $scope.loadStyleList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        var search=$scope.search;
        $http.post("style/list.do", {pageNum: pageNum, pageSize: pageSize,search:search}).success(function (response) {
            $scope.styleList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadStyleList();
    $scope.newStyle = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/template/style/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                var uploader = $scope.uploader = new FileUploader({
                    url: '/file/upload.do',
                    autoUpload: true,
                    queueLimit: 1
                });
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.result) {
                        fileItem.isSuccess = true;
                        fileItem.file.id = response.data;
                        $scope.styleFile = response.data;
                        $scope.alerts = [{
                            msg: '上传成功!',
                            type: 'success'
                        }];
                    } else {
                        fileItem.isSuccess = false;
                        $scope.alerts = [{
                            msg: '上传失败!',
                            type: 'danger'
                        }];
                    }
                };
                $scope.removeFile = function (fileItem) {
                    $http.post("/file/delete.do", {id: fileItem.file.id}).success(function (response) {
                        if (response.result) {
                            var fileIds = []
                            fileItem.remove();
                            $scope.styleFile = "";
                            $scope.alerts = [{
                                msg: '删除成功!',
                                type: 'success'
                            }];
                        } else {
                            fileItem.isSuccess = false;
                            $scope.alerts = [{
                                msg: '删除失败!',
                                type: 'danger'
                            }];
                        }
                    });
                };
                $scope.loadFiles = function (ids) {
                    $http.post("/file/list.do", {ids: ids}).success(function (response) {
                        for (var i = 0; i < response.length; i++) {
                            response[i].progress = 100;
                            response[i].isSuccess = true;
                            var fileInfo = new FileUploader.FileItem(uploader, {
                                lastModifiedDate: new Date(),
                                size: response[i].fileSize,
                                name: response[i].fileName
                            });
                            fileInfo.file.id = response[i].id;
                            fileInfo.progress = 100;
                            fileInfo.isUploaded = true;
                            fileInfo.isSuccess = true;
                            uploader.queue.push(fileInfo);
                        }

                    });
                };
                $scope.clearFile=function () {
                    uploader.clearQueue();
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.style.styleFile = $scope.styleFile;
                    $http.post("style/save.do", {json: angular.toJson($scope.style)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadStyleList();
                            $uibModalInstance.close();
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
            }
        });
    }
    $scope.editStyle = function (styleId) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/template/style/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.styleId=styleId;
                var uploader = $scope.uploader = new FileUploader({
                    url: '/file/upload.do',
                    autoUpload: true,
                    queueLimit: 1
                });
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.result) {
                        fileItem.isSuccess = true;
                        fileItem.file.id = response.data;
                        $scope.styleFile = response.data;
                        $scope.alerts = [{
                            msg: '上传成功!',
                            type: 'success'
                        }];
                    } else {
                        fileItem.isSuccess = false;
                        $scope.alerts = [{
                            msg: '上传失败!',
                            type: 'danger'
                        }];
                    }
                };
                $scope.removeFile = function (fileItem) {
                    $http.post("/file/delete.do", {id: fileItem.file.id}).success(function (response) {
                        if (response.result) {
                            var fileIds = []
                            fileItem.remove();
                            $scope.styleFile = "";
                            $scope.alerts = [{
                                msg: '删除成功!',
                                type: 'success'
                            }];
                        } else {
                            fileItem.isSuccess = false;
                            $scope.alerts = [{
                                msg: '删除失败!',
                                type: 'danger'
                            }];
                        }
                    });
                };
                $scope.loadFiles = function (ids) {
                    $http.post("/file/list.do", {ids: ids}).success(function (response) {
                        for (var i = 0; i < response.length; i++) {
                            response[i].progress = 100;
                            response[i].isSuccess = true;
                            var fileInfo = new FileUploader.FileItem(uploader, {
                                lastModifiedDate: new Date(),
                                size: response[i].fileSize,
                                name: response[i].fileName
                            });
                            fileInfo.file.id = response[i].id;
                            fileInfo.progress = 100;
                            fileInfo.isUploaded = true;
                            fileInfo.isSuccess = true;
                            uploader.queue.push(fileInfo);
                        }

                    });
                };
                $scope.clearFile=function () {
                    uploader.clearQueue();
                };
                $scope.initData = function () {
                    $scope.clearFile();
                    $http.post("style/get.do", {styleId: styleId}).success(function (json) {
                        if (json.state == "1") {
                            $scope.style = json.data;
                            $scope.styleFile = json.data.styleFile;
                            $scope.loadFiles(json.data.styleFile);
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.style.styleFile = $scope.styleFile;
                    $http.post("style/update.do", {json: angular.toJson($scope.style)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadStyleList();
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });
                };
            }
        });
    };

    $scope.deleteStyle = function (styleId) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("style/delete.do", {styleId: styleId}).success(function (json) {
                if (json.state == "1") {
                    $scope.loadStyleList();
                } else {
                    ModalUtils.alert("删除失败", "modal-warning", "lg");
                }
            });
        });
    };
    $scope.unzipStyle = function (styleId) {
        $http.post("style/unzip.do", {styleId: styleId}).success(function (json) {
            if (json.state == "1") {
                ModalUtils.alert("解压成功", "modal-success", "lg");
                $scope.loadStyleList();
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
});