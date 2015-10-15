angular.module(module.name).directive(current.name, [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 101,
        link: function(scope, element, attrs, ngModel) {
            var prefix = attrs[current.name];

            ngModel.$formatters.push(function(value){
                if(value && typeof value === 'string' && value.indexOf(prefix) === 0)
                    return value.substring(prefix.length, value.length);
            });

            ngModel.$parsers.push(function(value){
                return value ? prefix + value : value;
            });
        }
    }
}]);
