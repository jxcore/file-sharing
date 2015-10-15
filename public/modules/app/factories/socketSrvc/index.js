angular.module(module.name).provider(current.name, [function () {
    var self = this;

    this.socket;

    this.broadcasts = [
        'message:sent',
        'message:received'
    ];

    this.$get = ['$q', '$rootScope', '$location', 'notify', function (q, rootScope, location, notify) {
        var socket = this.socket || io.connect(':' + location.port(), {
            forceNew: true
        });

        this.broadcasts.forEach(function (name) {
            socket.on(name, function (data) {
                rootScope.$broadcast(name, data);
            });
        });

        return {
            emit: function (name, data) {
                var defered = q.defer();
                socket.emit(name, data, function (err, result) {
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