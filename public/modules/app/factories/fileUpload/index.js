angular.module(module.name).provider(current.name, [function () {
    var self = this;

    self.defaultOptions = {
        name: 'file',
        action: '/upload',
        typeValidator: 'image.*'
    };

    self.$get = ['$q', function (q) {
        return {
            upload: function (files, options) {
                var options = angular.extend({}, self.defaultOptions, options),
                    formData = new FormData(),
                    defered = q.defer();

                for (var i = 0, file; i < files.length; i++) {
                    file = files[i];
                    if (!file.type.match(options.typeValidator)) {
                        return defered.reject('Wrong file type: ' + file.type);
                    }
                    formData.append(options.name, file, file.name);
                }

                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        defered.resolve(xhr.response);
                    } else {
                        defered.reject(xhr);
                    }
                };
                
                xhr.open('POST', options.action, true);
                xhr.send(formData);

                return defered.promise;
            }
        };
    }];
}]);