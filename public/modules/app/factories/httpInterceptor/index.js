angular
    .module(module.name)
    .factory(current.name, ['$q', '$injector', '$location', '$rootScope', 'notify', function(q, injector, location, rootScope, notify) {
        var loading = 0;

        return {
            request: function (config) {
                if(++loading === 1) rootScope.$broadcast('loading:progress');
                return config || $q.when(config);
            },

            response: function (response) {
                if(--loading === 0) rootScope.$broadcast('loading:finish');
                return response || $q.when(response);
            },
            
            responseError: function (response) {
                var state = injector.get('$state');
                switch(response.status){
                    case 404:
                        notify.info(response.data || 'რესურსი არ მოიძებნა');
                    break;
                    case 500:
                        notify.info(response.data || 'სერვერის შეცდომა');
                    break;
                }

                if(--loading === 0) rootScope.$broadcast('loading:finish');
                return q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function(httpProvider){
        httpProvider.interceptors.push(current.name);
    }]);