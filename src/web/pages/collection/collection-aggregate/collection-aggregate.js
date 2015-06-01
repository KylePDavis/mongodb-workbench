"use strict";

angular.module("mw.pages.collection.collectionAggregate", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
	"mw.components.editor",
	"mw.components.results",
])


.directive("collectionAggregateControls", function() {
	return {
		scope: {
			ctrl: "=collectionAggregateCtrl",
			model: "=collectionAggregateModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-aggregate/collection-aggregate-controls.html",
	};
})


.directive("collectionAggregate", function() {
	return {
		controller: "CollectionAggregateCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?collectionAggregateCtrl",
			model: "=collectionAggregateModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/collection/collection-aggregate/collection-aggregate.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("CollectionAggregateCtrl", function($scope, JsonSvc, MongoSvc) {


	var defaults = {

		pipelineEditorModel: {
			data: "pipeline = [\n" +
				"\n" +
				"\t{$limit: 5},\n" +
				"\n" +
			"];",
		},

		optionsEditorModel: {
			data: "options = {\n" +
				"//\treadPreference: < 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest' >,\n" +
				"//\tcursor: < Boolean | { batchSize: <Number> } >,\n" +
				"//\texplain: < Boolean >,\n" +
				"//\tallowDiskUse: < Boolean >,\n" +
				"//\tmaxTimeMS: < Number >,\n" +
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
			var pipeline = JsonSvc.parseExpression($scope.model.pipelineEditorModel.data),
				options = JsonSvc.parseExpression($scope.model.optionsEditorModel.data),
				dbUrl = MongoSvc.getDbUrl($scope.connectionModel);
			return MongoSvc.aggregate(dbUrl, $scope.connectionModel.dbColName, pipeline, options)
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
