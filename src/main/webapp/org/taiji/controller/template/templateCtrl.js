cBoard.controller('templateCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval, FileUploader) {
    var translate = $filter('translate');
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadTemplateList();
        }
    };
    $scope.loadTemplateList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        var search=$scope.search;
        $http.post("template/list.do", {pageNum: pageNum, pageSize: pageSize,search:search}).success(function (response) {
            $scope.templateList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadTemplateList();
    $scope.new = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/template/template/create.html',
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
                        $scope.templateFile = response.data;
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
                            $scope.templateFile = "";
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
                    $scope.template.templateFile = $scope.templateFile;
                    $http.post("template/save.do", {json: angular.toJson($scope.template)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadTemplateList();
                            $uibModalInstance.close();
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
            }
        });
    }
    $scope.edit = function (id) {
        $uibModal.open({
            templateUrl: 'org/taiji/view/template/template/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.templateId=id;
                var uploader = $scope.uploader = new FileUploader({
                    url: '/file/upload.do',
                    autoUpload: true,
                    queueLimit: 1
                });
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.result) {
                        fileItem.isSuccess = true;
                        fileItem.file.id = response.data;
                        $scope.templateFile = response.data;
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
                            $scope.templateFile = "";
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
                }
                $scope.clearFile=function () {
                    uploader.clearQueue();
                }
                $scope.initData = function () {
                    $scope.clearFile();
                    $http.post("template/get.do", {id: id}).success(function (json) {
                        if (json.state == "1") {
                            $scope.template = json.data;
                            $scope.templateFile = json.data.templateFile;
                            $scope.loadFiles(json.data.templateFile);
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.template.templateFile = $scope.templateFile;
                    $http.post("template/update.do", {json: angular.toJson($scope.template)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadTemplateList();
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });
                };
            }
        });
    };

    $scope.delete = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("template/delete.do", {id: id}).success(function (json) {
                if (json.state == "1") {
                    $scope.loadTemplateList();
                } else {
                    ModalUtils.alert("删除失败", "modal-warning", "lg");
                }
            });
        });
    };
    $scope.trans = function (id) {
        $http.post("template/trans.do", {id: id}).success(function (json) {
            if (json.state == "1") {
                ModalUtils.alert("转换成功", "modal-success", "lg");
                $scope.loadTemplateList();
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
    $scope.view = function (id) {
        $http.post("template/view.do", {id: id}).success(function (json) {
            if (json.state == "1") {
                window.open("/app/"+json.msg,"_blank");
            } else {
                ModalUtils.alert(json.msg, "modal-warning", "lg");
            }
        });
    };
});