angular.module(module.name).directive(current.name, ['$state', function(state){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.click(function(e){
				e.preventDefault();
				window.location.href = attrs[current.name] || element.attr('href');
			});
		}
	};
}]);