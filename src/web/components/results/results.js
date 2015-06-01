"use strict";

angular.module("mw.components.results", [
	"ui.grid",
	"ui.grid.autoResize", //TODO: look into my fix for doing this without polling
	"ui.grid.resizeColumns",
	"ui.grid.moveColumns",
	"ui.grid.cellNav",
	"ui.grid.edit",
	"mw.components.data.json",
	"mw.components.editor",
])


.directive("results", function() {
	return {
		restrict: "E",
		scope: {
			model: "=resultsModel",
		},
		templateUrl: "components/results/results.html",
		controller: "ResultsCtrl",
	};
})


.controller("ResultsCtrl", function($scope, JsonSvc) {

	var defaults = {
		data: "",
		options: {
			tabName: "",
		},
	};
	if (!$scope.model) $scope.model = angular.extend({}, defaults);
	else {
		if (!$scope.model.data) $scope.model.data = angular.extend({}, defaults.data);
		$scope.model.options = angular.extend({}, defaults.options, $scope.model.options || {});
	}


	$scope.viewModel = {
		tabs: {},
		jsonEditor: {
			data: "",
			options: {
				mode: "json",
			},
		},
		gridOptions: {},
	};
	if ($scope.model.options.tabName) $scope.viewModel.tabs[$scope.model.options.tabName] = true;


	$scope.$watch("model", function(model) {

		if (model.options.tabName) {
			var tabs = {};
			tabs[model.options.tabName] = true;
			$scope.viewModel.tabs = tabs;
		}

		$scope.viewModel.jsonEditor.data = "";
		$scope.viewModel.gridOptions.columnDefs = [];
		if (model.data) {
			$scope.viewModel.jsonEditor.data = JsonSvc.stringify(model.data);
			$scope.viewModel.gridOptions = {
				data: "model.data",
				enableGridMenu: true,
				enableColumnResizing: true,
				enableFiltering: true,
			};
		}

	}, true);


});
