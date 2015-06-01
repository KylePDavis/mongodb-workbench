"use strict";

//TODO: either delete this or allow the use of the JsonSvc to control what validScript (rename to validExpr) is
angular.module("mw.components.data.valid", [
	//deps
])


.directive("validJson", function() {
	return {
		require: "ngModel",
		priority: 1000,
		link: function(scope, elem, attrs, ngModel) {

			// view to model
			ngModel.$parsers.unshift(function(value) {
				var valid = true,
				obj;
				try {
					obj = JSON.parse(value);
				} catch (ex) {
					valid = false;
				}
				ngModel.$setValidity("validJson", valid);
				return valid ? obj : undefined;
			});

			// model to view
			ngModel.$formatters.push(function(value) {
				return JSON.stringify(value, null, "\t");
			});

		},
	};
})


.directive("validScript", function($parse) {
	return {
		require: "ngModel",
		priority: 1000,
		link: function(scope, elem, attrs, ngModel) {

			// view to model
			ngModel.$parsers.unshift(function(value) {
				var valid = true,
				obj;
				try {
					obj = $parse(value)({});
				} catch (ex) {
					valid = false;
				}
				ngModel.$setValidity("validScript", valid);
				return valid ? obj : undefined;
			});

			// model to view
			ngModel.$formatters.push(function(value) {
				return "(" + (value !== undefined ? JSON.stringify(value, null, "\t") : "") + ");";
			});

		},
	};
});
