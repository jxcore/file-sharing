angular.module(module.name).factory(current.name, [
    '$rootScope',

    function (rootScope) {
        var loading = 0;
        return {
            loading: loading,
            push: function () {
                if(++loading === 1) {
                    rootScope.$broadcast('loading:progress');
                }
            },
            pull: function () {
                if (--loading === 0) {
                    rootScope.$broadcast('loading:finish');
                }
            }
        };
    }
]);