"use strict";

angular.module("mw.components.angular", [
	//deps
])

.directive("tmpltmpl", function($compile) {
	return {
		link: function(scope, element, attrs) {
			attrs.$observe("tmpltmpl", function(v) {
				$compile(element.html(v).contents())(scope);
			});
		},
	};
});
