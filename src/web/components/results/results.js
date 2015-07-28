"use strict";

angular.module("mw.components.results", [
	"angularGrid",
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
		gridOptions: {
			columnDefs: null,
			rowData: null,
			enableColResize: true,
			enableFilter: true,
			enableSorting: true,
		},
	};
	if ($scope.model.options.tabName) $scope.viewModel.tabs[$scope.model.options.tabName] = true;


	$scope.$watch("model", function(model, oldModel) {

		if (model.options.tabName) {
			var tabs = {};
			tabs[model.options.tabName] = true;
			$scope.viewModel.tabs = tabs;
		}

		$scope.viewModel.jsonEditor.data = "";
		$scope.viewModel.gridOptions.columnDefs = [];
		if (model.data !== oldModel.data && Array.isArray(model.data)) {
			$scope.viewModel.jsonEditor.data = JsonSvc.stringify(model.data);
			$scope.viewModel.gridOptions.rowData = model.data;
			$scope.viewModel.gridOptions.columnDefs = Object.keys(
					model.data.reduce(function(keys, obj) {
						for (var i = 0, objKeys = Object.keys(obj), l = objKeys.length; i < l; i++) {
							keys[objKeys[i]] = 1;
						}
						return keys;
					}, {})
				)
				.map(function(key) {
					return {
						headerName: key,
						headerTooltip: key,
						field: key,
						minWidth: key.length * 11 + 20, // estimate min width
					};
				});
		}

	}, true);


});
