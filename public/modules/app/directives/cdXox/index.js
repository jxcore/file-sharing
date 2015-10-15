angular.module(module.name).directive(current.name, [function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<canvas width="400" height="400" id="canvas"></canvas>',
        scope: {
            dimWidth: '=',
            dimHeight: '=',
            winningScore: '=',
            turnIndex: '=',
            meIndex: '=',
            letters: '=',
            onInit: '='
        },
        link: function(scope, element, attrs){
            var game = new xox.Game({
                context: element.get(0).getContext('2d'),
                width: scope.dimWidth,
                height: scope.dimHeight,
                winningScore: scope.winningScore,
                turnIndex: scope.turnIndex,
                meIndex: scope.meIndex,
                letters: scope.letters
            });

            var canvas = game.scene.context.canvas;
            var size = canvas.parentNode.getBoundingClientRect();
            var width = size.width > 400 ? 400 : size.width;
            canvas.width = width;
            canvas.height = width;
            game.scene.redraw();
            scope.onInit(game);
        }
    };
}]);