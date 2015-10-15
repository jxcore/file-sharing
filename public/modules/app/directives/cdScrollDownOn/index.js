/**
 * For the given events, scroll the element to the bottom content.
 */
angular.module(module.name).directive(current.name, [
    'scrollSrvc',
    function (scrollSrvc) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$eval(attrs[current.name]).forEach(function (eventName) {
                    scope.$on(eventName, function () {
                        scrollSrvc.scrollDown(element);
                    });
                });
            }
        }
    }
]);
