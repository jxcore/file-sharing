/**
 * When the return key is pressed, trigger the defined function.
 */
angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            element.keypress(function (e) {
                // 13 is the return key
                if(e.which == 13) {
                    scope.$apply(attrs[current.name]);
                }
            });
        }
    }
}]);
