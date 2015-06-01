"use strict";

angular.module("mw.pages.collection.collectionFind", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
	"mw.components.editor",
	"mw.components.results",
])


.directive("collectionFindControls", function() {
	return {
		scope: {
			ctrl: "=collectionFindCtrl",
			model: "=collectionFindModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-find/collection-find-controls.html",
	};
})


.directive("collectionFind", function() {
	return {
		controller: "CollectionFindCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?collectionFindCtrl",
			model: "=collectionFindModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-find/collection-find.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("CollectionFindCtrl", function($scope, JsonSvc, MongoSvc) {

	var defaults = {

		selectorEditorModel: {
			data: "selector = {\n" +
				"\n" +
				"//\tfoo: \"bar\",\n" +
				"\n" +
			"};",
		},

		optionsEditorModel: {
			data: "options = {\n" +
				"\tlimit: 5,\n" +
				"//\tskip: < Number >,\n" +
				"//\tfields: < Object (with field paths as keys and values set to 1 or true) >,\n" +
				// "//\traw: < Boolean >,\n" +
				// "//\thint: ...,\n" +
				"//\ttimeout: < Boolean | Number >, // in ms\n" +
				"//\treadPreference: < 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest' >,\n" +
			"};",
		},

		resultsModel: {
			data: undefined,
		},

	};
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);

	this.run = function run() {
		$scope.model.resultsModel.data = null;
		try {
			var selector = JsonSvc.parseExpression($scope.model.selectorEditorModel.data),
				options = JsonSvc.parseExpression($scope.model.optionsEditorModel.data),
				dbUrl = MongoSvc.getDbUrl($scope.connectionModel);
			return MongoSvc.find(dbUrl, $scope.connectionModel.dbColName, selector, options)
				.then(function(docs) {
					$scope.model.resultsModel.data = docs;
				})
				.catch(function(err) {
					$scope.model.resultsModel.data = err;
				});
		} catch (err) {
			$scope.model.resultsModel.data = err;
		}
	};

});
