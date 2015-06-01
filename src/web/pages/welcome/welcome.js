"use strict";

angular.module("mw.pages.welcome", [
	"mw.components.words",
])


.directive("welcome",
function() {
	return {
		templateUrl: "pages/welcome/welcome.html",
	};
});
