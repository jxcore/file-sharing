angular.module(module.name).provider(current.name, [function () {
    var self = this;

    this.socket;

    this.broadcasts = [
        'file-added',
        'file-removed'
    ];

    this.$get = ['$q', '$rootScope', '$location', 'notify', 'host', 'loadingSrvc', function (q, rootScope, location, notify, host, loadingSrvc) {
        var socket = this.socket || io.connect(host, {
            forceNew: true
        });

        this.broadcasts.forEach(function (name) {
            socket.on(name, function (data) {
                rootScope.$apply(function () {
                    rootScope.$broadcast(name, data);
                });
            });
        });

        return {
            emit: function (name, data) {
                var defered = q.defer();
                loadingSrvc.push();
                socket.emit(name, data, function (err, result) {
                    loadingSrvc.pull();
                    if (err) {
                        console.error('ws error:', err);
                        defered.reject(err);
                    } else {
                        defered.resolve(result);
                    }
                });
                return defered.promise;
            },
            on: function (name, fn) {
                socket.on(name, function () {
                    fn.apply(this, arguments);
                    rootScope.$apply();
                });
            }
        };
    }];
}]);