/**
 * Created by Peter on 2016/10/22.
 */


angular.module('cBoard').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'org/taiji/view/cboard/homepage.html',
            controller: 'homepageCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('mine', {
            url: '/mine',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('mine.view', {
            url: '/{id}',
            params: {id: null},
            templateUrl: 'org/taiji/view/dashboard/view.html',
            controller: 'dashboardViewCtrl'
        })
        .state('dashboard.category', {
            url: '/{category}',
            params: {category: null},
            abstract: true,
            template: '<div ui-view></div>',
        })
        .state('dashboard.category.view', {
            url: '/{id}',
            params: {id: null},
            templateUrl: 'org/taiji/view/dashboard/view.html',
            controller: 'dashboardViewCtrl'
        })
        .state('config', {
            url: '/config',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('config.board', {
            url: '/board/{boardId}',
            params: {boardId: null},
            templateUrl: 'org/taiji/view/config/board.html',
            controller: 'boardCtrl'
        })
        .state('config.widget', {
            url: '/widget?id&datasetId',
            params: {id: null, datasetId: null},
            templateUrl: 'org/taiji/view/config/widget.html',
            controller: 'widgetCtrl'
        })
        .state('config.datasource', {
            url: '/datasource/{id}',
            params: {id: null},
            templateUrl: 'org/taiji/view/config/datasource.html',
            controller: 'datasourceCtrl'
        })
        .state('config.interface', {
            url: '/interface/',
            templateUrl: 'org/taiji/view/config/interfaceSource.html',
            controller: 'interfaceCtrl'
        })
        .state('config.category', {
            url: '/category',
            templateUrl: 'org/taiji/view/config/category.html',
            controller: 'categoryCtrl'
        })
        .state('config.dataset', {
            url: '/dataset/{id}',
            params: {id: null},
            templateUrl: 'org/taiji/view/config/dataset.html',
            controller: 'datasetCtrl'
        })
        .state('config.job', {
            url: '/job',
            templateUrl: 'org/taiji/view/config/job.html',
            controller: 'jobCtrl'
        })
        .state('config.role', {
            url: '/role',
            templateUrl: 'org/taiji/view/config/shareResource.html',
            controller: 'shareResCtrl'
        })
        .state('admin', {
            url: '/admin',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('admin.user', {
            url: '/user',
            templateUrl: 'org/taiji/view/admin/user.html',
            controller: 'userAdminCtrl'
        })
        .state('config.cockpit', {
            url: '/cockpit/{boardId}',
            params: {boardId: null},
            templateUrl: 'org/taiji/view/config/board/cockpit/view.html',
            controller: 'cockpitLayoutCtrl'
        })
        .state('admin.menu', {
            url: '/menu',
            templateUrl: 'org/taiji/view/admin/menu.html',
            controller: 'menuAdminCtrl'
        })
        .state('config.monitor', {
            url: '/monitor',
            templateUrl: 'org/taiji/view/moniter/sys_moniter.html',
            controller: 'monitorCtrl'
        })
        .state('config.monitorChart', {
            url: '/monitorChart',
            templateUrl: 'org/taiji/view/moniter/charts_moniter.html',
            controller: 'monitorChartCtrl'
        })
        .state('config.quota', {
            url: '/quota',
            templateUrl: 'org/taiji/view/quota/quota_list.html',
            controller: 'quotaCtrl'
        })
        .state('config.quotaData', {
            url: '/quotaData',
            templateUrl: 'org/taiji/view/quota/quotaData_list.html',
            controller: 'quotaDataCtrl'
        })
        .state('config.quotaWarn', {
            url: '/quotaWarn',
            templateUrl: 'org/taiji/view/quota/quotaWarn_list.html',
            controller: 'quotaWarnCtrl'
        })
        .state('config.quotatj', {
            url: '/quotatj',
            templateUrl: 'org/taiji/view/quota/tj/quota_tj.html',
            controller: 'quotatjCtrl'
        })
        .state('config.logmanage', {
            url: '/monitorlog',
            templateUrl: 'org/taiji/view/moniter/monitorlog/sys_logmanage.html',
            controller: 'logmanageCtrl'
        })
        .state('message', {
            url: '/message',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('config.message', {
            url: '/message',
            templateUrl: 'org/taiji/view/message/message_list.html',
            controller: 'messageCtrl'
        })
        .state('template', {
            url: '/template',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('template.style', {
            url: '/style',
            templateUrl: 'org/taiji/view/template/style.html',
            controller: 'styleCtrl'
        })
        .state('template.template', {
            url: '/template',
            templateUrl: 'org/taiji/view/template/template.html',
            controller: 'templateCtrl'
        })
        .state('visual', {
            url: '/visual',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('visual.scene', {
            url: '/scene',
            templateUrl: 'org/taiji/view/visual/scene.html',
            controller: 'sceneCtrl'
        })
        .state('visual.layout', {
            url: '/layout',
            templateUrl: 'org/taiji/view/visual/layout.html',
            controller: 'layoutCtrl'
        })
        .state('monitor', {
            url: '/monitor',
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('monitor.knowledge', {
            url: '/knowledge',
            templateUrl: 'org/taiji/view/knowledge/knowledge.html',
            controller: 'knowledgeCtrl'
        })
        .state('config.merge', {
            url: '/merge',
            templateUrl: 'org/taiji/view/config/merge.html',
            controller: 'mergeCtrl'
        })
}]);

angular.module('cBoard').factory('sessionHelper', ["$rootScope", "$q", function ($rootScope, $q) {
    var sessionHelper = {
        responseError: function (response) {
            if (response.data.status == 2) {
                if ($rootScope.alert) {
                    $rootScope.alert(response.data.msg);
                }
            }
            return $q.reject(response);
        }
    };
    return sessionHelper;
}]);


angular.module('cBoard').config(function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];

    $httpProvider.interceptors.push('sessionHelper');

});


angular.module('cBoard').config(function ($translateProvider, $translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('language');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/i18n/{lang}/{part}.json'
    });

    $translateProvider.preferredLanguage(settings.preferredLanguage);
});