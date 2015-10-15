angular.module(module.name).directive(current.name, ['fileUpload', function(fileUpload) {
    return {
		restrict: 'A',
		require: 'ngModel',

		link: function (scope, element, attrs, ngModel) {
			element.on('click', function () {
                var input = angular.element('<input type="file"/>'),
                    options = scope.$eval(attrs[current.name]);

                input.on('change', function (e) {
                    var files = e.target.files;
                    fileUpload.upload(files, options).then(function (response) {
                    	ngModel.$setViewValue(response);
                    }, function (xhr) {
                    	alert(xhr.response);
                    });
                });
                
                input.get(0).click();
            });
		}
	};
}]);