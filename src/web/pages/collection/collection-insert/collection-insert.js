"use strict";

angular.module("mw.pages.collection.collectionInsert", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
	"mw.components.editor",
	"mw.components.results",
])


.directive("collectionInsertControls", function() {
	return {
		scope: {
			ctrl: "=collectionInsertCtrl",
			model: "=collectionInsertModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-insert/collection-insert-controls.html",
	};
})


.directive("collectionInsert", function() {
	return {
		controller: "CollectionInsertCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?collectionInsertCtrl",
			model: "=collectionInsertModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-insert/collection-insert.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("CollectionInsertCtrl", function($scope, JsonSvc, MongoSvc) {

	var defaults = {

		documentsEditorModel: {
			data: "documents = [\n" +
				"\n" +
				"//\t{ k:123, v:456, foo:\"bar\" },\n" +
				"\n" +
			"];",
		},

		optionsEditorModel: {
			data: "options = {\n" +
				"//\tw: < Number | String >,  // DOCS: http://docs.mongodb.org/manual/reference/write-concern/#w-option\n" +
				"//\twtimeout: < Number >,    // DOCS: http://docs.mongodb.org/manual/reference/write-concern/#wtimeout\n" +
				"//\tj: < Boolean >,          // DOCS: http://docs.mongodb.org/manual/reference/write-concern/#j-option\n" +
				//serializeFunctions -- should not work
				"//\tforceServerObjectId: < Boolean >,  // Force server to assign _id values instead of driver\n" +
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
			var documents = JsonSvc.parseExpression($scope.model.documentsEditorModel.data),
				options = JsonSvc.parseExpression($scope.model.optionsEditorModel.data),
				dbUrl = MongoSvc.getDbUrl($scope.connectionModel);
			return MongoSvc.insert(dbUrl, $scope.connectionModel.dbColName, documents, options)
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
