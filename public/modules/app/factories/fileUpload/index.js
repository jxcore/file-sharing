angular.module(module.name).provider(current.name, [function () {
    var self = this;

    self.$get = ['$q', 'socketSrvc', function (q, socketSrvc) {
        return {
            upload: function (file) {
                var self = this;
                return socketSrvc.emit('addFile', {
                    metadata: {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    },
                    content: file
                });
            },

            remove: function (fileName) {
                return socketSrvc.emit('removeFile', {
                    name: fileName
                });
            }
        };
    }];
}]);