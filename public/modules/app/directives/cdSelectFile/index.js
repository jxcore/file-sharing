angular.module(module.name).directive(current.name, [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            init();

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
                element.empty();
                angular
                    .element('<input type="file"/>')
                    .on('change', change)
                    .appendTo(element);
            }
        }
    };
}]);
