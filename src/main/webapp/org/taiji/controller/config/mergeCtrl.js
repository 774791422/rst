cBoard.controller('mergeCtrl', function ($scope, $rootScope, $http, dataService, $uibModal, ModalUtils, $filter, $interval, FileUploader) {
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
        $http.post("merge/list.do", {pageNum: pageNum, pageSize: pageSize,search:search}).success(function (response) {
            $scope.mergeList = response.list;
            $scope.paginationConf.totalItems = response.total;
        });
    };
    $scope.loadList();
    $scope.getActive=function(active){
        if(active==1){
            return "已发布";
        }else{
            return "未发布";
        }
    }
    $scope.new = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/config/merge/create.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initWizard=function(){
                    $('#fuelux-wizard-container')
                        .ace_wizard()
                        .on('actionclicked.fu.wizard' , function(e, info){
                            if(info.step == 1) {
                                $scope.merge.dataset=$scope.dataset.toString();
                                $http.post("merge/saveJbxx.do", {json: angular.toJson($scope.merge)}).success(function (response) {
                                    if (response.state=="1") {
                                        $scope.merge.id=response.data.id;
                                        $scope.loadColumnList();
                                    } else {
                                        $scope.alerts = [{msg: "保存失败", type: 'danger'}];
                                        e.preventDefault();
                                    }
                                });
                            }
                        })
                        .on('finished.fu.wizard', function(e) {
                            $scope.$parent.loadList();
                            $uibModalInstance.close();
                        });
                };
                $scope.initDataset=function(){
                    $http.post("merge/getDatasetList.do").success(function (response) {
                        if(response.state=="1"){
                           $scope.datasetList=response.data;
                        }
                    });
                };
                $scope.setSelect=function(){
                    var dataset=[];
                    for (var i=0;i<$scope.datasetSelect.length;i++){
                        dataset.push($scope.datasetSelect[i].dataset_id);
                    }
                    $scope.dataset=dataset;
                };
                $scope.paginationConf = {
                    currentPage: 1,
                    totalItems: 0,
                    itemsPerPage: 10,
                    pagesLength: 15,
                    perPageOptions: [10, 20, 30, 40, 50],
                    onChange: function () {
                        $scope.loadColumnList();
                    }
                };
                $scope.loadColumnList=function(){
                    if($scope.merge) {
                        var pageNum = $scope.paginationConf.currentPage;
                        var pageSize = $scope.paginationConf.itemsPerPage;
                        $http.post("merge/listColumn.do", {
                            pageNum: pageNum,
                            pageSize: pageSize,
                            merge: $scope.merge.id
                        }).success(function (response) {
                            $scope.columnList = response.list;
                            $scope.paginationConf.totalItems = response.total;
                        });
                    }
                };
                $scope.getState=function(state){
                    if(state==1){
                        return "是";
                    }else{
                        return "否";
                    }
                }
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.newColumn = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'org/taiji/view/config/merge/column_create.html',
                        windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'md',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.getDatasetList=function(){
                                $http.post("merge/getDatasetListOfMerge.do", {merge:$scope.$parent.merge.id}).success(function (response) {
                                    if(response.state=="1"){
                                        $scope.datasetList=response.data;
                                    }
                                });
                            };
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                var selectArray=$("select[name='columns']");
                                var flag=true;
                                var jsonArray={};
                                for(var i=0;i<selectArray.length;i++){
                                    var id=selectArray[i].id;
                                    var val=$("#"+id+" option:selected").val();
                                    if(!val){
                                        $("#"+id).parent().children("span").empty();
                                        $("#"+id).parent().children("span").append("<span style=\"color:red\">此项为必填项</span>");
                                        var flag=false;
                                    }else{
                                        jsonArray[id]=val;
                                    }
                                }
                                if(flag){
                                    $scope.column.merge=$scope.$parent.merge.id;
                                    $scope.column.dataset=jsonArray;
                                    $http.post("merge/saveColumn.do", {json: angular.toJson($scope.column)}).success(function (response) {
                                        if (response.state=="1") {
                                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                            $scope.$parent.loadColumnList();
                                            $uibModalInstance.close();
                                        } else {
                                            $scope.alerts = [{msg: "保存失败", type: 'danger'}];
                                        }
                                    });
                                }
                            };
                        }
                    });
                };
                $scope.editColumn = function (id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'org/taiji/view/config/merge/column_edit.html',
                        windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'md',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.initColumn=function(){
                                $http.post("merge/getColumn.do", {id:id}).success(function (response) {
                                    if(response.state=="1"){
                                        $scope.column=response.data;
                                        $scope.column.dataset=angular.fromJson(response.data.dataset);
                                        $scope.getDatasetList();
                                    }
                                });
                            };
                            $scope.getDatasetList=function(){
                                $http.post("merge/getDatasetListOfMerge.do", {merge:$scope.$parent.merge.id}).success(function (response) {
                                    if(response.state=="1"){
                                        $scope.datasetList=response.data;
                                    }
                                });
                            };
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                var selectArray=$("select[name='columns']");
                                var flag=true;
                                var jsonArray={};
                                for(var i=0;i<selectArray.length;i++){
                                    var id=selectArray[i].id;
                                    var val=$("#"+id+" option:selected").val();
                                    if(!val){
                                        $("#"+id).parent().children("span").empty();
                                        $("#"+id).parent().children("span").append("<span style=\"color:red\">此项为必填项</span>");
                                        var flag=false;
                                    }else{
                                        jsonArray[id]=val;
                                    }
                                }
                                if(flag){
                                    $scope.column.merge=$scope.$parent.merge.id;
                                    $scope.column.dataset=jsonArray;
                                    $http.post("merge/updateColumn.do", {json: angular.toJson($scope.column)}).success(function (response) {
                                        if (response.state=="1") {
                                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                            $scope.$parent.loadColumnList();
                                            $uibModalInstance.close();
                                        } else {
                                            $scope.alerts = [{msg: "保存失败", type: 'danger'}];
                                        }
                                    });
                                }
                            };
                        }
                    });
                };
                $scope.deleteColumn = function (id) {
                    ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "sm", function () {
                        $http.post("merge/deleteColumn.do", {id: id}).success(function (json) {
                            if (json.state == "1") {
                                $scope.loadColumnList();
                            } else {
                                ModalUtils.alert("删除失败", "modal-warning", "sm");
                            }
                        });
                    });
                };
            }
        });
    };
    $scope.publish=function(merge){
        $http.post("merge/publish.do", {id:merge}).success(function (response) {
            if(response.state=="1"){
                ModalUtils.alert("发布成功", "modal-success", "lg");
                $scope.loadList();
            }else{
                ModalUtils.alert(response.msg, "modal-warning", "lg");
            }
        });
    };
    $scope.edit = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: 'org/taiji/view/config/merge/edit.html',
            windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
            backdrop: false,
            size: 'lg',
            scope: $scope,
            controller: function ($scope, $uibModalInstance) {
                $scope.initWizard=function(){
                    $('#fuelux-wizard-container')
                        .ace_wizard()
                        .on('actionclicked.fu.wizard' , function(e, info){
                            if(info.step == 1) {
                                $scope.merge.dataset=$scope.dataset.toString();
                                $http.post("merge/saveJbxx.do", {json: angular.toJson($scope.merge)}).success(function (response) {
                                    if (response.state=="1") {
                                        $scope.merge.id=response.data.id;
                                        $scope.loadColumnList();
                                    } else {
                                        $scope.alerts = [{msg: "保存失败", type: 'danger'}];
                                        e.preventDefault();
                                    }
                                });
                            }
                        })
                        .on('finished.fu.wizard', function(e) {
                            $scope.$parent.loadList();
                            $uibModalInstance.close();
                        });
                    $scope.initJbxx();
                };
                $scope.initJbxx=function(){
                    $http.post("merge/get.do",{id:id}).success(function (response) {
                        if(response.state=="1"){
                            $scope.merge=response.data;
                            $scope.dataset=response.data.dataset;
                            $scope.initDataset();
                        }
                    });
                };
                $scope.initDataset=function(){
                    $http.post("merge/getDatasetList.do").success(function (response) {
                        if(response.state=="1"){
                            $scope.datasetList=response.data;
                            var select=[];
                            var datasets=$scope.merge.dataset;
                            var datasetArray=datasets.split(",");
                            for (var i=0;i<$scope.datasetList.length;i++){
                                for (var j=0;j<datasetArray.length;j++){
                                    if($scope.datasetList[i].dataset_id==datasetArray[j]){
                                        select.push($scope.datasetList[i]);
                                    }
                                }
                            }
                            $scope.datasetSelect=select;
                        }
                    });
                };
                $scope.setSelect=function(){
                    var dataset=[];
                    for (var i=0;i<$scope.datasetSelect.length;i++){
                        dataset.push($scope.datasetSelect[i].dataset_id);
                    }
                    $scope.dataset=dataset;
                };
                $scope.paginationConf = {
                    currentPage: 1,
                    totalItems: 0,
                    itemsPerPage: 10,
                    pagesLength: 15,
                    perPageOptions: [10, 20, 30, 40, 50],
                    onChange: function () {
                        $scope.loadColumnList();
                    }
                };
                $scope.loadColumnList=function(){
                    if($scope.merge) {
                        var pageNum = $scope.paginationConf.currentPage;
                        var pageSize = $scope.paginationConf.itemsPerPage;
                        $http.post("merge/listColumn.do", {
                            pageNum: pageNum,
                            pageSize: pageSize,
                            merge: $scope.merge.id
                        }).success(function (response) {
                            $scope.columnList = response.list;
                            $scope.paginationConf.totalItems = response.total;
                        });
                    }
                };
                $scope.getState=function(state){
                    if(state==1){
                        return "是";
                    }else{
                        return "否";
                    }
                }
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.newColumn = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'org/taiji/view/config/merge/column_create.html',
                        windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'md',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.getDatasetList=function(){
                                $http.post("merge/getDatasetListOfMerge.do", {merge:$scope.$parent.merge.id}).success(function (response) {
                                    if(response.state=="1"){
                                        $scope.datasetList=response.data;
                                    }
                                });
                            };
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                var selectArray=$("select[name='columns']");
                                var flag=true;
                                var jsonArray={};
                                for(var i=0;i<selectArray.length;i++){
                                    var id=selectArray[i].id;
                                    var val=$("#"+id+" option:selected").val();
                                    if(!val){
                                        $("#"+id).parent().children("span").empty();
                                        $("#"+id).parent().children("span").append("<span style=\"color:red\">此项为必填项</span>");
                                        var flag=false;
                                    }else{
                                        jsonArray[id]=val;
                                    }
                                }
                                if(flag){
                                    $scope.column.merge=$scope.$parent.merge.id;
                                    $scope.column.dataset=jsonArray;
                                    $http.post("merge/saveColumn.do", {json: angular.toJson($scope.column)}).success(function (response) {
                                        if (response.state=="1") {
                                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                            $scope.$parent.loadColumnList();
                                            $uibModalInstance.close();
                                        } else {
                                            $scope.alerts = [{msg: "保存失败", type: 'danger'}];
                                        }
                                    });
                                }
                            };
                        }
                    });
                };
                $scope.editColumn = function (id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'org/taiji/view/config/merge/column_edit.html',
                        windowTemplateUrl: 'org/taiji/view/util/modal/window.html',
                        backdrop: false,
                        size: 'md',
                        scope: $scope,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.initColumn=function(){
                                $http.post("merge/getColumn.do", {id:id}).success(function (response) {
                                    if(response.state=="1"){
                                        $scope.column=response.data;
                                        $scope.column.dataset=angular.fromJson(response.data.dataset);
                                        $scope.getDatasetList();
                                    }
                                });
                            };
                            $scope.getDatasetList=function(){
                                $http.post("merge/getDatasetListOfMerge.do", {merge:$scope.$parent.merge.id}).success(function (response) {
                                    if(response.state=="1"){
                                        $scope.datasetList=response.data;
                                    }
                                });
                            };
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.ok = function () {
                                var selectArray=$("select[name='columns']");
                                var flag=true;
                                var jsonArray={};
                                for(var i=0;i<selectArray.length;i++){
                                    var id=selectArray[i].id;
                                    var val=$("#"+id+" option:selected").val();
                                    if(!val){
                                        $("#"+id).parent().children("span").empty();
                                        $("#"+id).parent().children("span").append("<span style=\"color:red\">此项为必填项</span>");
                                        var flag=false;
                                    }else{
                                        jsonArray[id]=val;
                                    }
                                }
                                if(flag){
                                    $scope.column.merge=$scope.$parent.merge.id;
                                    $scope.column.dataset=jsonArray;
                                    $http.post("merge/updateColumn.do", {json: angular.toJson($scope.column)}).success(function (response) {
                                        if (response.state=="1") {
                                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                                            $scope.$parent.loadColumnList();
                                            $uibModalInstance.close();
                                        } else {
                                            $scope.alerts = [{msg: "保存失败", type: 'danger'}];
                                        }
                                    });
                                }
                            };
                        }
                    });
                };
                $scope.deleteColumn = function (id) {
                    ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "sm", function () {
                        $http.post("merge/deleteColumn.do", {id: id}).success(function (json) {
                            if (json.state == "1") {
                                $scope.loadColumnList();
                            } else {
                                ModalUtils.alert("删除失败", "modal-warning", "sm");
                            }
                        });
                    });
                };
            }
        });
    };
    $scope.delete = function (id) {
        ModalUtils.confirm(translate("COMMON.CONFIRM_DELETE"), "modal-info", "lg", function () {
            $http.post("merge/delete.do", {id: id}).success(function (json) {
                if (json.state == "1") {
                    $scope.loadList();
                } else {
                    ModalUtils.alert("删除失败", "modal-warning", "lg");
                }
            });
        });
    };
});