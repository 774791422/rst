cBoard.controller('knowledgeCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval, FileUploader) {
    var translate = $filter('translate');
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.loadList();
        }
    };
    $scope.loadList = function () {
        var pageNum = $scope.paginationConf.currentPage;
        var pageSize = $scope.paginationConf.itemsPerPage;
        var search=$scope.search;
        $http.post("knowledge/list.do", {pageNum: pageNum, pageSize: pageSize,search:search}).success(function (response) {
            $scope.knowledgeList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList();
    $scope.new = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/knowledge/knowledge/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initType=function () {
                    $scope.typeList=[{name:"故障",value:"0"},{name:"事件",value:"1"},{name:"问题",value:"2"}];
                };
                $scope.changeDs=function(){
                    $scope.type=$scope.typeSelect.value;
                };
                var uploader = $scope.uploader = new FileUploader({
                    url: '/file/upload.do',
                    autoUpload: true
                });
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.result) {
                        fileItem.isSuccess = true;
                        fileItem.file.id = response.data;
                        var fileIds=[]
                        for (var i=0;i<uploader.queue.length;i++){
                            fileIds.push(uploader.queue[i].file.id);
                        }
                        $scope.file=fileIds.toString();
                    } else {
                        fileItem.isSuccess = false;
                    }
                };
                $scope.removeFile = function (fileItem) {
                    $http.post("/file/delete.do", {id: fileItem.file.id}).success(function (response) {
                        if (response.result) {
                            var fileIds=[]
                            fileItem.remove();
                            for (var i=0;i<uploader.queue.length;i++){
                                fileIds.push(uploader.queue[i].file.id);
                            }
                            $scope.file=fileIds.toString();
                        } else {
                            fileItem.isSuccess = false;
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.knowledge.file = $scope.file;
                    $scope.knowledge.type = $scope.type;
                    $http.post("knowledge/save.do", {json: angular.toJson($scope.knowledge)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadList();
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
            templateUrl: 'org/taiji/view/knowledge/knowledge/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initType=function (type) {
                    $scope.typeList=[{name:"故障",value:"0"},{name:"事件",value:"1"},{name:"问题",value:"2"}];
                    for (var i=0;i<$scope.typeList.length;i++){
                        if($scope.typeList[i].value==type){
                            $scope.typeSelect=$scope.typeList[i];
                        }
                    }
                };
                $scope.changeDs=function(){
                    $scope.type=$scope.typeSelect.value;
                };
                var uploader = $scope.uploader = new FileUploader({
                    url: '/file/upload.do',
                    autoUpload: true
                });
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.result) {
                        fileItem.isSuccess = true;
                        fileItem.file.id = response.data;
                        var fileIds=[]
                        for (var i=0;i<uploader.queue.length;i++){
                            fileIds.push(uploader.queue[i].file.id);
                        }
                        $scope.file=fileIds.toString();
                    } else {
                        fileItem.isSuccess = false;
                    }
                };
                $scope.removeFile = function (fileItem) {
                    $http.post("/file/delete.do", {id: fileItem.file.id}).success(function (response) {
                        if (response.result) {
                            fileItem.remove();
                            var fileIds=[]
                            for (var i=0;i<uploader.queue.length;i++){
                                fileIds.push(uploader.queue[i].file.id);
                            }
                            $scope.file=fileIds.toString();
                        } else {
                            fileItem.isSuccess = false;
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
                    $http.post("knowledge/get.do", {id: id}).success(function (json) {
                        if (json.state == "1") {
                            $scope.knowledge = json.data;
                            $scope.type = json.data.type;
                            $scope.file = json.data.file;
                            $scope.loadFiles(json.data.file);
                            $scope.initType(json.data.type);
                        } else {
                            $scope.alerts = [{msg: serviceStatus.msg, type: 'danger'}];
                        }
                    });
                };
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $scope.knowledge.file = $scope.file;
                    $scope.knowledge.type = $scope.type;
                    $http.post("knowledge/update.do", {json: angular.toJson($scope.knowledge)}).success(function (serviceStatus) {
                        if (serviceStatus == 1) {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $scope.$parent.loadList();
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
            $http.post("knowledge/delete.do", {id: id}).success(function (json) {
                if (json.state == "1") {
                    $scope.loadList();
                } else {
                    ModalUtils.alert("删除失败", "modal-warning", "lg");
                }
            });
        });
    };
});