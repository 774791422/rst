cBoard.directive('ngRemote', function($http){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(newValue){
                if(!newValue){
                    c.$setValidity('remote', true);
                    return;
                }
                $http.post(attrs.ngRemote, {value: newValue}).success(function(data){
                    c.$setValidity('remote', data);
                }).error(function(data){
                    c.$setValidity('remote', false);
                })
            });
        }
    }
});