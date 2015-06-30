"use strict";

angular.module("mw", [
	"ui.bootstrap",
	"mw.components.connection",
	"mw.pages.welcome",
	"mw.pages.server",
	"mw.pages.database",
	"mw.pages.collection",
])


.controller("IndexCtrl", function($scope) {


	$scope.ctrl = {};


	var modelDefaults = {
		connection: {},
		tabName: null,
		server: {},
		database: {},
		collection: {},
	};
	$scope.model = angular.extend({}, modelDefaults, $scope.model || {});


	$scope.viewModel = {
		tabs: {},
	};


	$scope.$watch("model.tabName", function(tabName) {
		if (!tabName) return;
		var tabs = {};
		tabs[tabName] = true;
		$scope.viewModel.tabs = tabs;
	});


	require("ipc")
		.on("view:server", function() {
			if ($scope.model.connection.isConnected && $scope.model.connection.dbHostAndPort) {
				$scope.model.tabName = "server";
				$scope.$apply();
			}
		})
		.on("view:database", function() {
			if ($scope.model.connection.isConnected && $scope.model.connection.dbName) {
				$scope.model.tabName = "database";
				$scope.$apply();
			}
		})
		.on("view:collection", function() {
			if ($scope.model.connection.isConnected && $scope.model.connection.dbColName) {
				$scope.model.tabName = "collection";
				$scope.$apply();
			}
		});

});
