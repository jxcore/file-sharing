angular.module(module.name).directive(current.name, ['fsSrvc', function (fsSrvc) {
    return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: current.path + '/index.html',

        link: function (scope, element, attrs, modelCtrl) {
            scope.selected;
            scope.entries = [];

            fsSrvc.requestFileSystem(LocalFileSystem.PERSISTENT, 0).then(function (fileSystem) {
                scope.selected = fileSystem.root;
                scope.$watch('selected', function (selected) {
                    fsSrvc.readChildEntries(selected).then(function (entries) {
                        scope.entries = entries;
                    });
                });
            });

            scope.enter = function (entry) {
                scope.selected = entry;
            };

            scope.back = function () {
                fsSrvc.getParentEntry(scope.selected).then(function (parent) {
                    scope.selected = parent;
                });
            };

            scope.done = function () {
                modelCtrl.$setViewValue(scope.selected.toURL());
            };

            scope.cancel = function () {
                modelCtrl.$setViewValue(false);
            };
        }
    };
}]);