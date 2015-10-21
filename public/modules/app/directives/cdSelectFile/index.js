angular.module(module.name).directive(current.name, [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        transclude: true,
        link: function (scope, element, attrs, ngModel, transclude) {
            var transclElement;

            transclude(scope, function (clone) {
                transclElement = clone;
                init();
            });

            function change(e) {
                var files = e.target.files,
                    multiple = e.target.multiple;

                scope.$apply(function () {
                    if (multiple) {
                        ngModel.$setViewValue(files);
                    } else {
                        ngModel.$setViewValue(files.length ? files[0] : null);
                    }
                });

                init();
            }

            function init() {
                element.empty().append(transclElement);
                angular
                    .element('<input type="file"/>')
                    .on('change', change)
                    .appendTo(element);
            }
        }
    };
}]);
