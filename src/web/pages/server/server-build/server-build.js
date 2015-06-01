"use strict";

angular.module("mw.pages.server.serverBuild", [
	"ui.bootstrap",
	"mw.components.editor",
	"mw.components.data.json",
	"mw.components.data.mongo",
])


.directive("serverBuildControls", function() {
	return {
		scope: {
			ctrl: "=serverBuildCtrl",
			model: "=serverBuildModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server-build/server-build-controls.html",
	};
})


.directive("serverBuild", function() {
	return {
		controller: "ServerBuildCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?serverBuildCtrl",
			model: "=serverBuildModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server-build/server-build.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("ServerBuildCtrl", function($scope, $q, JsonSvc, MongoSvc) {

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
		$scope.viewModel.isWorking = true;
		$scope.model.results = null;
		return MongoSvc.getBuildInfo($scope.connectionModel)
			.then(function(buildInfo) {
				return ($scope.model.results = buildInfo);
			})
			.catch(function(err) {
				var err2 = new Error("Unable to get `db.buildInfo()`");
				err2.stack += "\nPREVIOUS:\n" + err.stack;
				return $q.reject($scope.model.results = err2);
			})
			.finally(function() {
				$scope.viewModel.isWorking = false;
			});
	};

	$scope.$watch("connectionModel", this.run, true);

	$scope.$watch("model", function(model, oldModel) {
		$scope.viewModel.results = model.results ? JsonSvc.stringify($scope.model.results) : "";
	}, true);

});
