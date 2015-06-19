"use strict";

angular.module("mw.pages.collection.collectionUpdate", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
	"mw.components.editor",
	"mw.components.results",
])


.directive("collectionUpdateControls", function() {
	return {
		scope: {
			ctrl: "=collectionUpdateCtrl",
			model: "=collectionUpdateModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-update/collection-update-controls.html",
	};
})


.directive("collectionUpdate", function() {
	return {
		controller: "CollectionUpdateCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?collectionUpdateCtrl",
			model: "=collectionUpdateModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-update/collection-update.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("CollectionUpdateCtrl", function($scope, JsonSvc, MongoSvc) {

	var defaults = {

		selectorEditorModel: {
			data:
`selector = {

//	foo: "bar",

};`,
		},

		updateEditorModel: {
			data:
`update = {

// YOUR UPDATE DEFINITION GOES HERE
// DOCS: http://docs.mongodb.org/manual/reference/method/db.collection.update/#update-parameter

};`,
		},

		optionsEditorModel: {
			//jshint -W101
			//jscs:disable
			data:
`options = {
//	upsert: < Boolean >,	// DOCS: http://docs.mongodb.org/manual/reference/method/db.collection.update/#insert-a-new-document-if-no-match-exists
//	multi: < Boolean >,		// DOCS: http://docs.mongodb.org/manual/reference/method/db.collection.update/#update-multiple-documents
//	w: < Number | String >,	// DOCS: http://docs.mongodb.org/manual/reference/write-concern/#w-option
//	wtimeout: < Number >,	// DOCS: http://docs.mongodb.org/manual/reference/write-concern/#wtimeout
//	j: < Boolean >,			// DOCS: http://docs.mongodb.org/manual/reference/write-concern/#j-option
};`, //jscs:enable
//jshint +W101
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
				update = JsonSvc.parseExpression($scope.model.updateEditorModel.data),
				options = JsonSvc.parseExpression($scope.model.optionsEditorModel.data),
				dbUrl = MongoSvc.getDbUrl($scope.connectionModel);
			return MongoSvc.update(dbUrl, $scope.connectionModel.dbColName, selector, update, options)
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
