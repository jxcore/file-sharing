angular.module(module.name).factory(current.name, ['$q', '$rootScope', 'loadingSrvc', function (q, rootScope, loadingSrvc) {
    return {
        callAsyncFunction: function (name, data) {
            var defered = q.defer();
            loadingSrvc.push();
            jxcore(name).call(data, function(err, result){
                loadingSrvc.pull();
                rootScope.$apply(function () {
                    if (err) {
                        defered.reject(err);
                    } else {
                        defered.resolve(result);
                    }
                });
            });
            return defered.promise;
        }
    };
}]);