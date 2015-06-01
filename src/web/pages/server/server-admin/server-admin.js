"use strict";

angular.module("mw.pages.server.serverAdmin", [
	"ui.bootstrap",
	"mw.components.data.json",
	"mw.components.data.mongo",
])


.directive("serverAdminControls", function() {
	return {
		scope: {
			ctrl: "=serverAdminCtrl",
			model: "=serverAdminModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server-admin/server-admin-controls.html",
	};
})


.directive("serverAdmin", function() {
	return {
		controller: "ServerAdminCtrl",
		controllerAs: "ctrl",
		scope: {
			ctrl: "=?serverAdminCtrl",
			model: "=serverAdminModel",
			connectionModel: "=connectionModel",
		},
		templateUrl: "pages/server/server-admin/server-admin.html",
		link: function(scope, element, attrs, ctrl) {
			scope.ctrl = ctrl; //export ctrl
		},
	};
})


.controller("ServerAdminCtrl", function() {
});
