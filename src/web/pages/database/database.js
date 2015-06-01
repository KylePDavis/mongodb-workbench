"use strict";

var pluginPrefix = "database",
	plugins = [
		{
			id: "info",
			tabIconClass: "fa fa-heartbeat",
			tabTitle: "Info",
		},
		// {
		// 	id: "gridFs",
		// 	tabIconClass: "fa fa-files-o",
		// 	tabTitle: "GridFS",
		// },
		// {
		// 	id: "admin",
		// 	tabIconClass: "fa fa-cogs",
		// 	tabTitle: "Admin",
		// },
	];


angular.module("mw.pages.database", [
	"ui.bootstrap",
	"mw.pages.database.databaseInfo",
].concat(plugins.map(function(plugin) {
	return "mw.pages." + pluginPrefix + "." + pluginPrefix + plugin.id[0].toUpperCase() + plugin.id.substr(1);
}))
)


.constant("databasePlugins", plugins)


.directive("database", function() {
	return {
		controller: "DatabaseCtrl",
		scope: {
			ctrl: "=?databaseCtrl",
			model: "=databaseModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/database/database.html",
	};
})


.controller("DatabaseCtrl", function($scope, databasePlugins) {

	$scope.ctrl = {};

	var defaults = {
		tabName: "",
	};
	databasePlugins.forEach(function(plugin) {
		defaults[plugin.id] = {};
	});
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	$scope.viewModel = {
		plugins: databasePlugins,
		tabs: {},
	};

	$scope.$watch("model.tabName", function(tabName) {
		if (!tabName) return;
		var tabs = {};
		tabs[tabName] = true;
		$scope.viewModel.tabs = tabs;
	});

});
