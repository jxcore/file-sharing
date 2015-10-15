angular.module(module.name).factory(current.name, [function () {
    return {
        info: function (text) {
            alert('info: ' + text);
        },
        
        error: function (text) {
            alert('error: ' + text);
        }
    };
}]);