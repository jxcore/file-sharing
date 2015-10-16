angular.module(module.name).directive(current.name, ['$state', 'host', 'isMobile', 'fsSrvc', '$uibModal', function (state, host, isMobile, fsSrvc, uibModal) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.click(function (e) {
                var fileName = attrs[current.name];
                var url = encodeURI(host + '/download/' + fileName);

                if (isMobile) {
                    uibModal.open({
                        template: '<cd-entry-picker ng-model="entry"></cd-entry-picker>',
                        controller: ['$scope', '$modalInstance', function (scope_, modalInstance) {
                            scope_.$watch('entry', function (entry) {
                                if (entry !== undefined) {
                                    if (entry === false) {
                                        modalInstance.dismiss('cancel');
                                    } else {
                                        modalInstance.close(entry);
                                    }
                                }
                            });
                        }]
                    }).result.then(function (path) {
                        fsSrvc.download(url, path + fileName).then(function (file) {
                            alert('Saved to: ' + file.toURI());
                        }, function (err) {
                            alert('Saving error: ' + err);
                        });
                    });
                } else {
                    window.location.href = url;
                }
            });
        }
    };
}]);