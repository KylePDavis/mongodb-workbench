"use strict";

angular.module("mw.components.data.json", [
	//deps
])

.factory("JsonSvc", function($parse) {

	var parsersByKeys = {};

	// ===== JSON w/ natives =====
	//TODO: move JSON stuff to separate file and eventually a separate project
	//TODO: `JSON.parse` support (the below `parse` is good but probably unreasonably heavy in some scenarios)

	Number.prototype.toJSON = function toJSON() { //eslint-disable-line no-extend-native
		return isNaN(this) ? {$nan: 1} : this;
	};
	parsersByKeys.$nan = Number.parseJSON = function parseJSON(obj) {
		return obj.$nan ? NaN : obj;
	};

	Date.prototype.toJSON = function toJSON() { //eslint-disable-line no-extend-native
		return {
			$date: this.getTime(),
		};
	};
	parsersByKeys.$date = Date.parseJSON = function parseJSON(obj) {
		return new Date(obj.$date);
	};

	RegExp.prototype.toJSON = function toJSON() { //eslint-disable-line no-extend-native
		var s = this.toString();
		return {
			$regex: this.source,
			$options: s.substr(s.lastIndexOf("/") + 1),
		};
	};
	parsersByKeys.$regex$options = RegExp.parseJSON = function parseJSON(obj) {
		return new RegExp(obj.$regex, obj.$options);
	};

	Error.prototype.toJSON = function toJSON() { //eslint-disable-line no-extend-native
		return {
			$error: this.message,
			$stack: this.stack,
		};
	};
	parsersByKeys.$error$stack = Error.parseJSON = function parseJSON(obj) {
		return Object.create(Error.prototype, {
			message: {
				value: obj.$error,
			},
			stack: {
				value: obj.$stack,
			},
		});
	};

	// JSON w/ natives ----- hack to work properly in `nw.js`
	//TODO: ..... looks like `window.Date !== global.Date` ... oooh that's freaky ... write up a bug about it?
	global.Number.prototype.toJSON = Number.prototype.toJSON;
	global.Date.prototype.toJSON = Date.prototype.toJSON;
	global.RegExp.prototype.toJSON = RegExp.prototype.toJSON;
	global.Error.prototype.toJSON = Error.prototype.toJSON;

	// ===== JSON w/ BSON ======
	var mongodb = require("mongodb");

	var ISODate = function ISODate(t) {
		return typeof t === "number" ? new Date(t) : new Date();
	};

	mongodb.Binary.prototype.toJSON = function toJSON() {
		return {
			$binary: this.buffer !== null ? this.buffer.toString("base64") : "",
			//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			$type: this.sub_type, /*jshint ignore:line*/
			//jscs:enable requireCamelCaseOrUpperCaseIdentifiers
		};
	};
	parsersByKeys.$binary$type = mongodb.Binary.parseJSON = function parseJSON(obj) {
		return new mongodb.Binary(new Buffer(obj.$binary, "base64"), obj.$type);
	};

	mongodb.DBRef.prototype.toJSON = function toJSON() {
		return {
			$ref: this.namespace,
			$id: this.oid.toHexString(),
			$db: this.database || "",
		};
	};
	parsersByKeys.$ref$id$db = mongodb.DBRef.parseJSON = function parseJSON(obj) {
		return new mongodb.DBRef(obj.$ref, new mongodb.ObjectId(obj.$id), obj.$db);
	};

	//Double?
	//Long?

	mongodb.MaxKey.prototype.toJSON = function toJSON() {
		return {
			$maxKey: 1,
		};
	};
	parsersByKeys.$maxKey = mongodb.MaxKey.parseJSON = function parseJSON() {
		return new mongodb.MaxKey();
	};

	mongodb.MinKey.prototype.toJSON = function toJSON() {
		return {
			$minKey: 1,
		};
	};
	parsersByKeys.$minKey = mongodb.MinKey.parseJSON = function parseJSON() {
		return new mongodb.MinKey();
	};

	mongodb.ObjectId.prototype.toJSON = function toJSON() {
		return {
			$oid: this.toHexString(),
		};
	};
	parsersByKeys.$oid = mongodb.ObjectId.parseJSON = function parseJSON(obj) {
		return new mongodb.ObjectId(obj.$oid);
	};

	mongodb.Symbol.prototype.toJSON = function toJSON() {
		return {
			$symbol: this.value,
		};
	};
	parsersByKeys.$symbol = mongodb.Symbol.parseJSON = function parseJSON(obj) {
		return new mongodb.Symbol(obj.$symbol);
	};

	mongodb.Timestamp.prototype.toJSON = function toJSON() {
		return {
			$timestamp: {
				t: this.low_, //eslint-disable-line no-underscore-dangle
				i: this.high_, //eslint-disable-line no-underscore-dangle
			},
		};
	};
	parsersByKeys.$timestamp = mongodb.Timestamp.parseJSON = function parseJSON(obj) {
		var ts = obj.$timestamp;
		return new mongodb.Timestamp(ts.t, ts.i);
	};

	var JsonSvc = {

		stringify: function stringify(obj, fmt) {
			return JSON.stringify(obj, function replacer(k, v) {
				if (typeof v === "object" && v !== null) {
					var toJSON = v.constructor.prototype.toJSON;
					if (typeof toJSON === "function") return toJSON.call(v);
				}
				return v;
			}, fmt || "\t");
		},

		parse: function parse(str) {
			return JSON.parse(str, function reviver(k, v) {
				if (typeof v === "object" && v !== null && v.constructor === Object) {
					var objSig = Object.keys(v).join(""),
						parser = parsersByKeys[objSig];
					if (typeof parser === "function") return parser(v);
				}
				return v;
			});
		},

		parseExpression: function parseExpression(str) {
			var stripped = str
					.replace(/;\s*$/, "") // no trailing ;
					.replace(/\/\/.*$/gm, ""), // no line comments
				obj = $parse(stripped)({
					RegExp: RegExp,
					Date: ISODate,
					ISODate: ISODate,
					ObjectId: mongodb.ObjectId,
					ObjectID: mongodb.ObjectID, // still need this?
					MinKey: mongodb.MinKey,
					MaxKey: mongodb.MaxKey,
					DBRef: mongodb.DBRef,
					Binary: mongodb.Binary,
					Code: mongodb.Code,
				});
			// run through our conversions to convert any JSON representations to instances
			return JsonSvc.parse(JsonSvc.stringify(obj));
		},

	};

	return JsonSvc;

});
