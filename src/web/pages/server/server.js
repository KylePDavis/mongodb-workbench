"use strict";

var pluginPrefix = "server",
	plugins = [
		{
			id: "status",
			tabIconClass: "fa fa-info",
			tabTitle: "Status",
		},
		{
			id: "build",
			tabIconClass: "fa fa-info",
			tabTitle: "Build",
		},
		// {
		// 	id: "admin",
		// 	tabIconClass: "fa fa-cogs",
		// 	tabTitle: "Admin",
		// },
	];


angular.module("mw.pages.server", [
	"ui.bootstrap",
	"mw.components.angular",
].concat(plugins.map(function(plugin) {
	return "mw.pages." + pluginPrefix + "." + pluginPrefix + plugin.id[0].toUpperCase() + plugin.id.substr(1);
}))
)


.constant("serverPlugins", plugins)


.directive("server", function() {
	return {
		controller: "ServerCtrl",
		controllerAs: "pageCtrl",
		scope: {
			ctrl: "=?serverCtrl",
			model: "=serverModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server.html",
	};
})


.controller("ServerCtrl", function($scope, serverPlugins) {

	$scope.ctrl = {};

	var defaults = {
		tabName: "",
	};
	serverPlugins.forEach(function(plugin) {
		defaults[plugin.id] = {};
	});
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	$scope.viewModel = {
		plugins: serverPlugins,
		tabs: {},
	};

	$scope.$watch("model.tabName", function(tabName) {
		if (!tabName) return;
		var tabs = {};
		tabs[tabName] = true;
		$scope.viewModel.tabs = tabs;
	});

});
