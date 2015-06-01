"use strict";

angular.module("mw.pages.database.databaseInfo", [
	"ui.bootstrap",
	"ui.ace",
	"mw.components.editor",
	"mw.components.data.mongo",
])


.directive("databaseInfoControls", function() {
	return {
		scope: {
			ctrl: "=databaseInfoCtrl",
			model: "=databaseInfoModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/database/database-info/database-info-controls.html",
	};
})


.directive("databaseInfo", function() {
	return {
		controller: "DatabaseInfoCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?databaseInfoCtrl",
			model: "=databaseInfoModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/database/database-info/database-info.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("DatabaseInfoCtrl", function($scope, $q, JsonSvc, MongoSvc) {

	var defaults = {
		data: "",
	};
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	$scope.viewModel = {
		isWorking: false,
		dbStats: "",
	};

	this.run = function run() {
		if (!$scope.connectionModel) return;

		$scope.viewModel.isWorking = true;
		$scope.model.data = {};

		if (!$scope.connectionModel.dbHostAndPort) return;

		var dbUrl = MongoSvc.getDbUrl($scope.connectionModel);
		return MongoSvc.getStats(dbUrl)
			.then(function(stats) {
				return ($scope.model.data = stats);
			})
			.catch(function(err) {
				var err2 = new Error("Unable to get `db.stats()`");
				err2.stack += "\nPREVIOUS:\n" + err.stack;
				return $q.reject($scope.model.data = err2);
			})
			.finally(function() {
				$scope.viewModel.isWorking = false;
			});
	};

	$scope.$watch("connectionModel", this.run, true);

	$scope.$watch("model", function(model) {
		$scope.viewModel.dbStats = model.data ? JsonSvc.stringify($scope.model.data) : "";
	}, true);

});
