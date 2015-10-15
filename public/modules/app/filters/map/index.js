angular.module(module.name).filter(current.name, [function(){
    return function(items, prop){
        return items.map(function (item) {
            return item[prop];
        });
    };
}]);