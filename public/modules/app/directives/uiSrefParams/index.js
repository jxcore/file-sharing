angular.module(module.name).directive(current.name, ['$state', function(state) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$on('$stateChangeSuccess', function(){
                var newparams = angular.extend({}, state.params, scope.$eval(attrs[current.name]));
                var newhref = state.href(state.current, newparams);
                attrs.$set('href', newhref);
            });
        }
    };
}]);
