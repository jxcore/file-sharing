angular.module(module.name).controller(module.name + '.c.' + current.name, [
    '$scope',
    '$state',
    'host',
    
    function (scope, state, host) {
        scope.host = host;
    }
]);