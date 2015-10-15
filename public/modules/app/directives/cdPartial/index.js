angular.module(module.name).directive(current.name, [
	'$compile',
	'$controller',
	'$http',
	'$templateCache',
	'$q',
	'$state',
	'$resolve',

	function(compile, controller, http, templateCache, q, state, resolve){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				scope.$watch(attrs[current.name], function(options){
					var resolvePromises = [],
						templatePromise,
						tmplScope,
						tmplCtrl;
						resolveFns = options.resolve || {};

					var parent = state.$current;
					while(parent){
						angular.extend(resolveFns, parent.resolve);
						parent = parent.parent;
					}

					// load template
					if(options.templateUrl)
						templatePromise = http.get(options.templateUrl, { cache: templateCache }).then(function(result){
							return result.data;
						});
					else
						templatePromise = q.when(options.template);

					// resolve promises
					resolve.resolve(resolveFns).then(function(locals){
						return templatePromise.then(function(template){
							return {
								locals: locals,
								template: template
							};
						});
					}).then(function(data){
						init(data, options)
					});
				});

				// init controller
				function init(data, options){
					tmplScope = scope.$new(),
					tmplCtrl = controller(options.controller, angular.extend({ $scope: tmplScope }, data.locals));
					element.html(data.template);
					element.children().data('$ngControllerController', tmplCtrl);
					compile(element.contents())(tmplScope);
				}
			}
		};
	}
]);