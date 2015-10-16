angular.module(module.name).factory(current.name, ['$q', 'loadingSrvc', function (q, loadingSrvc) {
    return {
        requestFileSystem: function (a, b) {
            var defered = q.defer();
            window.requestFileSystem(a, b, function (fileSystem) {
                defered.resolve(fileSystem);
            }, function (e) {
                defered.reject(e.target.error);
            });
            return defered.promise;
        },

        getParentEntry: function (entry) {
            var defered = q.defer();
            entry.getParent(function (parent) {
                defered.resolve(parent);
            }, function (err) {
                defered.reject(err);
            });
            return defered.promise;
        },

        readChildEntries: function (entry) {
            var defered = q.defer();
            var reader = entry.createReader();
            reader.readEntries(function(entries){
                defered.resolve(Array.prototype.slice.call(entries).filter(function (centry) {
                    return centry.name && centry.name[0] !== '.';
                }));
            }, function (err) {
                defered.reject(err);
            });
            return defered.promise;
        },

        download: function (url, path) {
            var fileTransfer = new FileTransfer(),
                defered = q.defer();

            if (device.platform === 'Android' && path.indexOf('file://') === 0) {
                path = path.substring(7);
            }

            fileTransfer.download(
                url,
                path,
                function (file) {
                    defered.resolve(file);
                },
                function (err) {
                    defered.reject([
                        'source: ' + err.source,
                        'target: ' + err.target,
                        'code: ' + err.code
                    ].join('\n'));
                }
            );
            return defered.promise;
        }
    };
}]);
