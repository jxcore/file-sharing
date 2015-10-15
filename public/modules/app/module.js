var app = angular
	.module(module.name, [
        'ui.router',
        'ngResource',
        'ngSanitize',
        'ngAnimate'
    ].concat(module.dependencies))
	.config(['$stateProvider', '$urlRouterProvider','$locationProvider',
		function(stateProvider, urlRouterProvider, locationProvider){
			stateProvider.state(module.name, {
				url: '',
				template: '<div ui-view></div>',
				abstract: true
			});
			locationProvider.html5Mode(false).hashPrefix('!');
		}
	])
	.run(['$rootScope', 'enums', function (rootScope, enums) {
        rootScope.enums = enums;
    }]);

// start angular after jxcore is ready
(function check() {
    if (typeof jxcore === 'undefined') {
        setTimeout(check, 5);
    } else if (jxcore === 'none' || cordova === 'none') {
        init(window.location.origin, false);
    } else {
        jxcore.isReady(function () {
            jxcore('alert').register(alert);
            jxcore('app.js').loadMainFile(function(result, err) {
                if (err) {
                    alert(err);
                } else {
                    jxcore('getHost').call(function (host) {
                        init(host, true);
                    });
                }
            });
        });
    }
})();

function init(host, isMobile) {
    var s = document.createElement('script');
    s.async = false;
    s.src = host + '/socket.io/socket.io.js';
    document.body.appendChild(s);

    (function _check() {
        if (window.io) {
            app.value('enums', enums);
            app.value('host', host);
            app.value('isMobile', isMobile);
            angular.bootstrap(document, [app.name]);
        } else {
            setTimeout(_check, 5);
        }
    })();
}