angular
    .module(module.name)
    .factory(current.name, ['$q', '$injector', '$location', 'loadingSrvc', 'notify', function(q, injector, location, loadingSrvc, notify) {
        return {
            request: function (config) {
                loadingSrvc.push();
                return config || $q.when(config);
            },

            response: function (response) {
                loadingSrvc.pull();
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

                loadingSrvc.pull();
                return q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function(httpProvider){
        httpProvider.interceptors.push(current.name);
    }]);