angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'host',
    'fileMetadatas',
    'fileSrvc',
    
    function (scope, state, host, fileMetadatas, fileSrvc) {
        scope.host = host;
        scope.fileMetadatas = fileMetadatas;
        scope.file;

        scope.$watch('file', function (file) {
            if (file) {
                fileSrvc.upload(file).then(function () {
                    scope.file = null;
                });
            }
        });

        scope.addFile = function () {
            fileSrvc.upload();
        };

        scope.$on('file-added', function (e, fileMetadata) {
            scope.fileMetadatas.push(fileMetadata);
        });

        scope.removeFile = function (fileName) {
            if (confirm('Sure?')) {
                fileSrvc.remove(fileName);
            }
        };

        scope.$on('file-removed', function (e, fileMetadata) {
            for (var i = 0; i < scope.fileMetadatas.length; i++) {
                if (scope.fileMetadatas[i].name === fileMetadata.name) {
                    scope.fileMetadatas.splice(i, 1);
                    break;
                }
            }
        });
    }
]);