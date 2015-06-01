"use strict";

//TODO: does not follow the `model.{data,options}` pattern
angular.module("mw.components.connection", [
	"ngSanitize",
	"ui.bootstrap",
	"ui.select",
	"mw.components.data.mongo",
])


.directive("connection", function ConnectionDirectiveProvider($window, $q, MongoSvc) {
	return {
		controller: "ConnectionCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?connectionCtrl",
			model: "=connectionModel",
		},
		templateUrl: "components/connection/connection.html",
		replace: true,
		//TODO: move stuff to here ....
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //TODO: have to force...   controllerAs/isolatedScope fighting?

			scope.viewModel = {
				databases: null,
				collections: null,
			};

			scope.getDatabasesViewModel = function getDatabasesViewModel(dbHostAndPort) {
				if (!dbHostAndPort) dbHostAndPort = scope.model.dbHostAndPort;
				return MongoSvc.getDatabases({
					dbHostAndPort: dbHostAndPort,
					dbName: "admin",
				})
					.then(function(dbs) {
						return dbs.map(function(db) {
							return {
								name: db.name,
								sizeOnDisk: db.sizeOnDisk,
								empty: db.empty,
							};
						});
					})
					.catch(function(err) {
						$window.alert("Unable to get databases: " + dbHostAndPort + "\n" + err);
						return $q.reject(err);
					});
			};

			scope.getDatabaseViewModelFromTag = function getDatabaseViewModelFromTag(tag) {
				//TODO: need to make sure that there's a way to update this list so that this no longer has the isTag property
				return {
					name: tag,
					//sizeOnDisk: -1,
					empty: true,
				};
			};

			scope.getCollectionsViewModel = function getCollectionsViewModel(dbHostAndPort, dbName) {
				if (!dbHostAndPort && !dbName) {
					dbHostAndPort = scope.model.dbHostAndPort;
					dbName = scope.model.dbName;
				}
				return MongoSvc.getCollections({
					dbHostAndPort: scope.model.dbHostAndPort,
					dbName: dbName,
				})
					.then(function(collections) {
						return collections.map(function(collection) {
							return {
								name: collection.name,
							};
						});
					})
					.catch(function(err) {
						$window.alert("Unable to get collections: " + dbHostAndPort + "/" + dbName + "\n" + err);
						return $q.reject(err);
					});
			};

			scope.getCollectionViewModelFromTag = function getCollectionViewModelFromTag(tag) {
				return {
					name: tag,
				};
			};

			scope.$watch("model", function(model, oldModel) {
				if (!model) return;
				if (model.dbHostAndPort && (model.dbHostAndPort !== oldModel.dbHostAndPort || !scope.viewModel.databases)) {
					scope.model.isConnected = false;
					scope.viewModel.databases = [];
					scope.getDatabasesViewModel(model.dbHostAndPort)
						.then(function(databases) {
							scope.model.isConnected = true;
							scope.viewModel.databases = databases;
							// $location.path("/server");
						});
						//TODO: catch to set error flag (to set css class and/or toaster popup?)
				}
				if (model.dbName && (model.dbName !== oldModel.dbName || !scope.viewModel.collections)) {
					scope.viewModel.collections = [];
					scope.getCollectionsViewModel(model.dbHostAndPort, model.dbName)
						.then(function(collections) {
							scope.viewModel.collections = collections;
							var isColNameInList = collections.some(function(collection) {
								return collection.name === scope.model.dbColName;
							});
							if (!isColNameInList) scope.model.dbColName = null;
							// $location.path("/database");
						});
						//TODO: catch to set error flag (to set css class and/or toaster popup?)
				}
			}, true);

		},
	};
})


.controller("ConnectionCtrl", function ConnectionCtrl($scope) {
	if (!$scope.model) throw new Error("missing required `model` object");
	var defaults = {
		dbHostAndPort: null, //"localhost:27017",
		dbName: null,
		dbColName: null,
		isConnected: false,
	};
	$scope.model = Object.setPrototypeOf($scope.model || {}, defaults);
});
