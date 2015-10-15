angular.module(module.name).filter(current.name, [function(){
    return function(items){
        return items.reduce(function (p, n) {
            return p.concat(n);
        }, []);
    };
}]);