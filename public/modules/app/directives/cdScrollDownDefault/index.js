angular.module(module.name).directive(current.name, ['$timeout', 'scrollSrvc', function (timeout, scrollSrvc) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs[current.name], function (isDefault) {
                if (isDefault) {
                    scrollSrvc.scrollDown(element, 0);
                }
            });
        }
    }
}]);
