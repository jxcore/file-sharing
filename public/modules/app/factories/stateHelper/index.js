angular.module(module.name).factory(current.name, [
	'$state',
	'$urlMatcherFactory',
	'$location',

	function(state, urlMatcherFactory, location){
		function tryDecodeURIComponent(value) {
		    try {
		        return decodeURIComponent(value);
		    } catch (e) {
		        
		    }
		}

		function parseKeyValue( /**string*/ keyValue) {
		    var obj = {},
		        key_value, key;
		        
		    angular.forEach((keyValue || "").split('&'), function(keyValue) {
		        if (keyValue) {
		            key_value = keyValue.replace(/\+/g, '%20').split('=');
		            key = tryDecodeURIComponent(key_value[0]);
		            if (angular.isDefined(key)) {
		                var val = angular.isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
		                if (!hasOwnProperty.call(obj, key)) {
		                    obj[key] = val;
		                } else if (angular.isArray(obj[key])) {
		                    obj[key].push(val);
		                } else {
		                    obj[key] = [obj[key], val];
		                }
		            }
		        }
		    });
		    return obj;
		}

		function parseUrl(url){
			var parts = url.split('?');
			return {
				path: parts[0],
				search: parts[1] ? parseKeyValue(parts[1]) : {}
			};
		}

		return {
			resolveFromUrl: function(url){
				var states = state.get();
				for(var i = 0, s; s = states[i]; i++){
					if(s.abstract)
						continue;

					var parts = s.name.split('.');
					var matcher = urlMatcherFactory.compile('');

					for(var j = 0, part; part = parts[j]; j++){
						var ps = state.get(parts.slice(0, j + 1).join('.'));
						if(ps.url)
							matcher = matcher.concat(ps.url);
					}

					var parsedurl = parseUrl(url);
					var params = matcher.exec(parsedurl.path, parsedurl.search);
					if(params)
						return {
							params: params,
							state: s
						};
				}
			},
			
			getStateContext: function(el){
				var stateData = el.parent().inheritedData('$uiView');
				if(stateData && stateData.state && stateData.state.name)
					return stateData.state;
			}

		};
	}
]);