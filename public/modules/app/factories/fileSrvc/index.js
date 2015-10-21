angular.module(module.name).provider(current.name, [function () {
    var self = this;

    self.$get = ['$q', 'socketSrvc', 'loadingSrvc', 'host', function (q, socketSrvc, loadingSrvc, host) {
        return {
            upload: function (file) {
                var fd = new FormData(),
                    req = new XMLHttpRequest(),
                    defered = q.defer();

                fd.append('file', file);

                req.onload = function() {
                    loadingSrvc.pull();
                    if (req.status === 200) {
                        defered.resolve(req);
                    } else {
                        defered.reject(req);
                    }
                };
                
                req.onerror = function (err) {
                    loadingSrvc.pull();
                    defered.reject(err);
                };

                req.open('POST', host + '/upload');
                req.send(fd);
                loadingSrvc.push();
                return defered.promise;
            },

            remove: function (fileName) {
                return socketSrvc.emit('removeFile', {
                    name: fileName
                });
            }
        };
    }];
}]);