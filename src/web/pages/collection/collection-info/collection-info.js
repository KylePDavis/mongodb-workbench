"use strict";

angular.module("mw.pages.collection.collectionInfo", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
	"mw.components.editor",
])


.directive("collectionInfoControls", function() {
	return {
		scope: {
			ctrl: "=collectionInfoCtrl",
			model: "=collectionInfoModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-info/collection-info-controls.html",
	};
})


.directive("collectionInfo", function() {
	return {
		controller: "CollectionInfoCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?collectionInfoCtrl",
			model: "=collectionInfoModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-info/collection-info.html",
		link: function(scope, element, attrs, ctrl) {

			scope.ctrl = ctrl; //export ctrl

//TODO: split viewModel into directive only?
			// scope.viewModel = {
			// 	isWorking: false,
			// 	dbColStats: "",
			// };
			//
			// ctrl.ui = {
			//
			// 	getViewModel: function getViewModel(model) {
			// 		return {
			// 			isWorking: scope.viewModel.isWorking,
			// 			dbColStats: model.data ? JsonSvc.stringify(model.data) : "",
			// 		};
			// 	},
			//
			// };
			//
			// scope.$watch("model", function(model, oldModel) {
			// 	scope.viewModel = ctrl.ui.getViewModel(model);
			// }, true);

		},
	};
})


.controller("CollectionInfoCtrl", function($scope, $q, JsonSvc, MongoSvc) {

	var defaults = {
		data: "",
	};
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	$scope.viewModel = {
		isWorking: false,
		dbColStats: "",
	};

	this.run = function run() {
		$scope.viewModel.isWorking = true;
		$scope.model.data = {};
		var dbUrl = MongoSvc.getDbUrl($scope.connectionModel);
		return MongoSvc.getCollectionStats(dbUrl, $scope.connectionModel.dbColName)
			.then(function(stats) {
				$scope.model.data = stats;
				return stats;
			})
			.catch(function(err) {
				var err2 = new Error("Unable to get `db.collection.stats()`");
				err2.stack += "\nPREVIOUS:\n" + err.stack;
				return $q.reject($scope.model.data = err2);
			})
			.finally(function() {
				$scope.viewModel.isWorking = false;
			});
	};

	$scope.$watch("connectionModel", this.run, true);

	$scope.$watch("model", function(model) {
		$scope.viewModel.dbColStats = model.data ? JsonSvc.stringify(model.data) : "";
	}, true);

});
