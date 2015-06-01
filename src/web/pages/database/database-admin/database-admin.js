"use strict";
angular.module("mw.pages.database.databaseAdmin", [
	"ui.bootstrap",
	"ui.ace",
	"mw.components.data.mongo",
])


.directive("databaseAdminControls", function() {
	return {
		scope: {
			ctrl: "=databaseAdminCtrl",
			model: "=databaseAdminModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/database/database-admin/database-admin-controls.html",
	};
})


.directive("databaseAdmin", function() {
	return {
		controller: "DatabaseAdminCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?databaseAdminCtrl",
			model: "=databaseAdminModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/database/database-admin/database-admin.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("DatabaseAdminCtrl", function($scope) {

	var defaults = {
		data: "",
	};
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	this.run = function run() {
	};

});
