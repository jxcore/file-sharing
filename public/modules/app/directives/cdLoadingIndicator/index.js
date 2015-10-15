angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs, ctrl) {
            scope.$on("loading:progress", function () {
                element.show();
            });
            
            scope.$on("loading:finish", function () {
                element.hide();
            });
        }
    };
}]);