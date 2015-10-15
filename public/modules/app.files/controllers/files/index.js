angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'host',
    'fileMetadatas',
    'fileUpload',
    
    function (scope, state, host, fileMetadatas, fileUpload) {
        scope.host = host;
        scope.fileMetadatas = fileMetadatas;
        scope.file;

        scope.$watch('file', function (file) {
            if (file) {
                fileUpload.upload(file).then(function () {
                    scope.file = null;
                });
            }
        });

        scope.addFile = function () {
            fileUpload.upload();
        };

        scope.$on('file-added', function (e, fileMetadata) {
            scope.fileMetadatas.push(fileMetadata);
        });

        scope.removeFile = function (fileName) {
            if (confirm('Sure?')) {
                fileUpload.remove(fileName);
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