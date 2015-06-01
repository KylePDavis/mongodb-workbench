"use strict";

var pluginPrefix = "collection",
	plugins = [
		{
			id: "info",
			tabIconClass: "fa fa-info",
			tabTitle: "Info",
		},
		{
			id: "insert",
			tabIconClass: "fa fa-file-o",
			tabTitle: "Insert",
		},
		// {
		// 	id: "update",
		// 	tabIconClass: "fa fa-pencil",
		// 	tabTitle: "Update",
		// },
		{
			id: "remove",
			tabIconClass: "fa fa-trash-o",
			tabTitle: "Remove",
		},
		{
			id: "find",
			tabIconClass: "fa fa-search",
			tabTitle: "Find",
		},
		{
			id: "aggregate",
			tabIconClass: "fa fa-filter",
			tabTitle: "Aggregate",
		},
		// {
		// 	id: "mapReduce",
		// 	tabIconClass: "icon icon-map-reduce",
		// 	tabTitle: "Map/Reduce",
		// },
		// {
		// 	id: "admin",
		// 	tabIconClass: "fa fa-cogs",
		// 	tabTitle: "Admin",
		// },
	];


angular.module("mw.pages.collection", [
	"ui.bootstrap",
	"mw.components.angular",
].concat(plugins.map(function(plugin) {
	return "mw.pages." + pluginPrefix + "." + pluginPrefix + plugin.id[0].toUpperCase() + plugin.id.substr(1);
}))
)


.constant("collectionPlugins", plugins)


.directive("collection", function() {
	return {
		controller: "CollectionCtrl",
		controllerAs: "pageCtrl",
		scope: {
			ctrl: "=?collectionCtrl",
			model: "=collectionModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection.html",
	};
})


.controller("CollectionCtrl", function($scope, collectionPlugins) {

	$scope.ctrl = {};

	var defaults = {
		tabName: "",
	};
	collectionPlugins.forEach(function(plugin) {
		defaults[plugin.id] = {};
	});
	$scope.model = angular.extend({}, defaults, $scope.model || {});

	$scope.viewModel = {
		plugins: collectionPlugins,
		tabs: {},
	};

	$scope.$watch("model.tabName", function(tabName) {
		if (!tabName) return;
		var tabs = {};
		tabs[tabName] = true;
		$scope.viewModel.tabs = tabs;
	});

});
