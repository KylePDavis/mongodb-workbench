"use strict";

angular.module("mw.pages.server.serverStatus", [
	"ui.bootstrap",
	"ui.ace",
	"mw.components.data.json",
	"mw.components.data.mongo",
])


.directive("serverStatusControls", function() {
	return {
		scope: {
			ctrl: "=serverStatusCtrl",
			model: "=serverStatusModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server-status/server-status-controls.html",
	};
})


.directive("serverStatus", function() {
	return {
		controller: "ServerStatusCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?serverStatusCtrl",
			model: "=serverStatusModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server-status/server-status.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("ServerStatusCtrl", function($scope, $q, JsonSvc, MongoSvc) {

	var defaults = { //TODO: use {data,options} pattern
		results: undefined,
	};
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	$scope.viewModel = {
		isWorking: false,
		results: "",
	};

	this.run = function run() {
		if (!$scope.connectionModel || !$scope.connectionModel.dbHostAndPort) return;
		$scope.model.results = null;
		$scope.viewModel.isWorking = true;
		return MongoSvc.getServerStatus($scope.connectionModel)
			.then(function(serverStatus) {
				return ($scope.model.results = serverStatus);
			})
			.catch(function(err) {
				var err2 = new Error("Unable to get `db.serverStatus()`");
				err2.stack += "\nPREVIOUS:\n" + err.stack;
				return $q.reject($scope.model.results = err2);
			})
			.finally(function() {
				$scope.viewModel.isWorking = false;
			});
	};

	$scope.$watch("connectionModel", this.run, true);

	$scope.$watch("model", function(model) {
		$scope.viewModel.results = model.results ? JsonSvc.stringify($scope.model.results) : "";
	}, true);

});
