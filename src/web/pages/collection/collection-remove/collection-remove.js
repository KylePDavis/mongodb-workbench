"use strict";

angular.module("mw.pages.collection.collectionRemove", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
	"mw.components.editor",
	"mw.components.results",
])


.directive("collectionRemoveControls", function() {
	return {
		scope: {
			ctrl: "=collectionRemoveCtrl",
			model: "=collectionRemoveModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-remove/collection-remove-controls.html",
	};
})


.directive("collectionRemove", function() {
	return {
		controller: "CollectionRemoveCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?collectionRemoveCtrl",
			model: "=collectionRemoveModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-remove/collection-remove.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("CollectionRemoveCtrl", function($scope, JsonSvc, MongoSvc) {

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
				"//\tsingle: < Boolean >,     // Remove only the first document found\n" +
				"//\tw: < Number | String >,  // DOCS: http://docs.mongodb.org/manual/reference/write-concern/#w-option\n" +
				"//\twtimeout: < Number >,    // DOCS: http://docs.mongodb.org/manual/reference/write-concern/#wtimeout\n" +
				"//\tj: < Boolean >,          // DOCS: http://docs.mongodb.org/manual/reference/write-concern/#j-option\n" +
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
			return MongoSvc.remove(dbUrl, $scope.connectionModel.dbColName, selector, options)
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
