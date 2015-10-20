angular.module(module.name).provider(current.name, [function () {
    var self = this;

    self.$get = ['$q', 'socketSrvc', 'loadingSrvc', function (q, socketSrvc, loadingSrvc) {
        return {
            upload: function (file) {
                var fd = new FormData(),
                    req = new XMLHttpRequest(),
                    defered = q.defer();

                fd.append('file', file);

                req.onload = function() {
                    loadingSrvc.pull();
                    if (req.status == 200) {
                        defered.resolve(req);
                    } else {
                        defered.reject(req);
                    }
                };

                req.open('POST', '/upload');
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