angular.module(module.name).directive(current.name, [function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var prevent;

			element.click(function(e){
				if(prevent) e.preventDefault();
			});

			scope.$watch(attrs[current.name], function(p){
				prevent = p;
				if(prevent)
					element.addClass('inactive');
				else
					element.removeClass('inactive');
			});
		}
	};
}]);