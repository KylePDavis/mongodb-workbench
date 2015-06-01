"use strict";

angular.module("mw.components.tips", [
	//deps
])


.directive("tips", function() {
	return {
		templateUrl: "components/tips/tips.html",
		controller: "TipsCtrl",
		link: function() {

			var tips = [
				{
					title: "fold / unfold keyboard shortcut",
					descr: "<mark>cmd-opt-l</mark>  or  <mark>cmd-opt-[</mark>  or  <mark>cmd-opt-]</mark>",
				},
				{
					title: "fold children",
					descr: "<mark>shift-click</mark> expander",
				},
				{
					title: "fold children recursively",
					descr: "<mark>shift-cmd-click</mark> expander",
				},
				{
					title: "fold recursively",
					descr: "<mark>cmd-click</mark> expander",
				},
				{
					title: "move to different tabs",
					descr: "<mark>cmd-[</mark> or <mark>cmd-]</mark> for lower tabs",
				},
			];
			console.log("TODO: TIPS: ", tips); //TODO: implement this sometime...

		},
	};
});
