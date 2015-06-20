"use strict";

angular.module("mw.components.data.mongo", [
	//deps
])


.factory("MongoSvc", function($window, $q) {

	var mongodb = require("mongodb");
	$window.mongodb = mongodb;

	var MongoSvc = {


		getDbUrl: function getDbUrl(overrides) {
			if (!overrides) overrides = {};
			var dbHostAndPort = overrides.dbHostAndPort || "localhost:27017",
				dbName = overrides.dbName || "admin";
			return "mongodb://" + dbHostAndPort + "/" + dbName;
		},


		getBuildInfo: function getBuildInfo(dbUrl) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
//TODO: if (!mongodb) return resolve({host:"foo", version:"1.2.3"});
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					db.admin().buildInfo(function(err2, info) {
						db.close();
						if (err2) return reject(err2);
						return resolve(info);
					});
				});
			});
		},


		getServerStatus: function getServerStatus(dbUrl) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
//TODO: if (!mongodb) return resolve({host:"foo", version:"1.2.3"});
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					db.admin().serverStatus(function(err2, status) {
						db.close();
						if (err2) return reject(err2);
						return resolve(status);
					});
				});
			});
		},


		getStats: function getStats(dbUrl) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
//TODO: if (!mongodb) return resolve({raw:{}, objects:123, dataSize:12345678, indexes:42, ok:1});
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					db.stats(function(err2, stats) {
						db.close();
						if (err2) return reject(err2);
						return resolve(stats);
					});
				});
			});
		},


		getDatabases: function getDatabases(dbUrl) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
//TODO: if (!mongodb) return resolve([{name:"fake1"}, {name:"fake2"}]);
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					db.admin().listDatabases(function(err2, listDatabasesResponse) {
						db.close();
						if (err2) return reject(err2);
						return resolve(listDatabasesResponse.databases);
					});
				});
			});
		},


		getCollections: function getCollections(dbUrl) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
//TODO: if (!mongodb) return resolve([{name:dbUrl.replace(/[^A-Z0-9]/ig,"_")+"_A"}, {name:dbUrl.replace(/[^A-Z0-9]/ig,"_")+"_B"}]);
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					db.collections(function(err2, collections) {
						db.close();
						if (err2) return reject(err2);
						return resolve(collections.map(function(col) {
							return {
								name: col.collectionName,
								namespace: col.namespace,
							};
						}));
					});
				});
			});
		},


		getCollectionStats: function getCollectionStats(dbUrl, collectionName) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
				if (!collectionName) return reject(new Error("required `collectionName`"));
//TODO: if (!mongodb) return resolve({count:123, size:234, totalIndexSize:345, indexSizes:{_id:123}});
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					var collection = db.collection(collectionName);
					collection.stats(function(err2, stats) {
						db.close();
						if (err2) return reject(err2);
						return resolve(stats);
					});
				});
			});
		},


		insert: function insert(dbUrl, collectionName, documents, options) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
				if (!collectionName) return reject(new Error("required `collectionName`"));
				if (!documents) return reject(new Error("required `documents`"));
//TODO: if (!mongodb) return resolve({result:{ok:1,n:2}, connection:{host:"fake"}, ops:[{_id:1}, {_id:2}]});
				if (!options) options = {};
				if (typeof documents === "object" && documents.constructor !== Array) documents = [documents];

				if (documents.length === 0) return resolve(new Error("No documents were given to insert"));

				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					var collection = db.collection(collectionName);
					collection.insertMany(documents, options, function(err2, results) {
						db.close();
						if (err2) return reject(err2);
						return resolve({
							result: results.result,
							connection: results.connection.toJSON(),
							ops: results.ops,
						});
					});
				});
			});
		},


		remove: function remove(dbUrl, collectionName, selector, options) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
				if (!collectionName) return reject(new Error("required `collectionName`"));
//TODO: if (!mongodb) return resolve({result:{ok:1,n:2}, connection:{host:"fake"}, ops:[{_id:1}, {_id:2}]});
				if (!options) options = {};
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					var collection = db.collection(collectionName);
					collection.remove(selector, options, function(err2, results) {
						db.close();
						if (err2) return reject(err2);
						return resolve({
							result: results.result,
							connection: results.connection.toJSON(),
							ops: results.ops,
						});
					});
				});
			});
		},


		find: function find(dbUrl, collectionName, selector, options) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
				if (!collectionName) return reject(new Error("required `collectionName`"));
//TODO: if (!mongodb) return resolve([{_id:dbUrl.replace(/[^A-Z0-9]/ig,"_")+"_A"}, {_id:dbUrl.replace(/[^A-Z0-9]/ig,"_")+"_B"}]);
				if (!options) options = {};
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					var collection = db.collection(collectionName);
					collection.find(selector, options, function(err2, cursor) {
						if (err2) return reject(err2);
						cursor.toArray(function(err3, docs) {
							db.close();
							if (err3) return reject(err3);
							return resolve(docs);
						});
					});
				});
			});
		},


		update: function update(dbUrl, collectionName, selector, updates, options) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
				if (!collectionName) return reject(new Error("required `collectionName`"));
//TODO: if (!mongodb) return resolve({result:{ok:1,nModified:1,n:1},connection:{id:123,host:"localhost",port:27017}});
				if (!options) options = {};
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					var collection = db.collection(collectionName);
					collection.update(selector, updates, options, function(err2, results) {
						if (err2) return reject(err2);
						return resolve({
							result: results.result,
							connection: results.connection.toJSON(),
						});
					});
				});
			});
		},


		aggregate: function aggregate(dbUrl, collectionName, pipeline, options) {
			return $q(function(resolve, reject) {
				if (typeof dbUrl !== "string") dbUrl = MongoSvc.getDbUrl(dbUrl);
				if (!collectionName) return reject(new Error("required `collectionName`"));
//TODO: if (!mongodb) return resolve([{_id:dbUrl.replace(/[^A-Z0-9]/ig,"_")+"_A"}, {_id:dbUrl.replace(/[^A-Z0-9]/ig,"_")+"_B"}]);
				if (!options) options = {};
				mongodb.MongoClient.connect(dbUrl, function(err, db) {
					if (err) return reject(err);
					var collection = db.collection(collectionName);
					collection.aggregate(pipeline, options, function(err2, docs) {
						db.close();
						if (err2) return reject(err2);
						return resolve(docs);
					});
				});
			});
		},


	};

	return MongoSvc;

});
