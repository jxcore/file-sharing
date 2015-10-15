angular.module(module.name).directive(current.name, ['$state', 'host', 'isMobile', 'loadingSrvc', function (state, host, isMobile, loadingSrvc) {
    function fail(e) {
        console.log(e.target.error.code);
    }

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.click(function (e) {
                var fileName = attrs[current.name];
                var url = encodeURI(host + '/download/' + fileName);

                if (isMobile) {
                    loadingSrvc.push();
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                        fileSystem.root.getFile(
                            fileName, {
                                create: true,
                                exclusive: false
                            },
                            function (fileEntry) {
                                var localPath = fileEntry.toURL();
                                if (device.platform === 'Android' && localPath.indexOf('file://') === 0) {
                                    localPath = localPath.substring(7);
                                }

                                var fileTransfer = new FileTransfer();
                                fileTransfer.download(
                                    url,
                                    localPath,
                                    function (theFile) {
                                        loadingSrvc.pull();
                                        alert('File saved to: ' + theFile.toURI());
                                    },
                                    function (err) {
                                        loadingSrvc.pull();
                                        alert('download error source: ' + err.source);
                                        alert('download error target: ' + err.target);
                                        alert('upload error code: ' + err.code);
                                    }
                                );
                            },
                            function () {
                                loadingSrvc.pull();
                                alert('Error getFile');
                            },
                            true);
                    }, function () {
                        loadingSrvc.pull();
                        alert('Error requestFileSystem');
                    });
                } else {
                    window.location.href = url;
                }
            });
        }
    };
}]);