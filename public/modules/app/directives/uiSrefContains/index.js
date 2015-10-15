angular.module(module.name).directive(current.name, ['$state', function(state) {
    function getStateContext(el) {
        var stateData = el.parent().inheritedData('$uiView');
        if (stateData && stateData.state && stateData.state.name)
            return stateData.state;
    }

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var activeClass = attrs[current.name + 'Class'] || 'active';
            scope.$on('$stateChangeSuccess', function(){
                var base = getStateContext(element) || state.$current,
                    includes = state.includes(attrs[current.name], null, { relative: base });

                if(includes)
                    attrs.$addClass(activeClass);
                else
                    attrs.$removeClass(activeClass);
            });
        }
    };
}]);
