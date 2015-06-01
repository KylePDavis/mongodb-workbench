"use strict";
/*global ace*/

angular.module("mw.components.editor", [
	"ui.bootstrap",
	"ui.ace",
])


.directive("editor", function($window) {
	return {
		restrict: "E",
		scope: {
			model: "=editorModel",
		},
		controller: "EditorCtrl",
		controllerAs: "ctrl",
		templateUrl: "components/editor/editor.html",
		link: {
			pre: function(scope, element, attrs) {
				scope.model.options.onLoad = function onEditorLoaded(editor) {
					// var session = editor.getSession();

					editor.$blockScrolling = Infinity; // disables an ACE warning

					if ((Boolean(attrs.readonly) || attrs.readonly === "") || scope.model.options.isReadOnly) {
						editor.setReadOnly(true);
					}

					if ((Boolean(attrs.autofocus) || attrs.autofocus === "") || scope.model.options.focus) {
						var currentEl = $window.document.activeElement;
						if (currentEl && !$(currentEl).is(":visible")) {
							editor.focus();
						}
					}

					// Tweak status bar styles a bit
					var sbExt = $window.ace.require("ace/ext/statusbar");
					new sbExt.StatusBar(editor, editor.container); /*jshint ignore:line*/ //eslint-disable-line no-new

					// Hook into ext-gotolinebox
					editor.commands.byName.gotoline.exec = function() {
						ace.config.loadModule("ace/ext/gotolinebox", function(e) {
							e.GotoLine(editor); //eslint-disable-line new-cap
						});
					};
					// gotoline alias for extra keybinding
					editor.commands.addCommand({
						name: "gotoline2",
						bindKey: "Ctrl-G",
						exec: editor.commands.byName.gotoline.exec,
						readOnly: true,
					});

					// Remove per-editor settings menu keybinding (i.e., option-comma)
					editor.commands.removeCommand("showSettingsMenu");

					// fold alias for extra keybindings
					editor.commands.addCommand({
						name: "fold2",
						bindKey: {
							mac: "Command-Alt-[",
							win: "Control-Alt-[",
						},
						readOnly: true,
						exec: function execFold() {
							return editor.commands.byName.fold.exec.apply(this, arguments);
						},
					});

					// unfold alias for extra keybindings
					editor.commands.addCommand({
						name: "unfold2",
						bindKey: {
							mac: "Command-Alt-]",
							win: "Control-Alt-]",
						},
						readOnly: true, // available in RO mode
						exec: function execUnfold() {
							return editor.commands.byName.unfold.exec.apply(this, arguments);
						},
					});

					scope.$on("$destroy", function onDestroy() {
						editor.destroy();
					});

				};
			},
		},
	};
})


.controller("EditorCtrl", function($scope) {
	var defaults = {
		data: "",
		options: {
			mode: "javascript",
			theme: "tomorrow_night",
			require: ["ace/ext/language_tools", "ace/ext/gotolinebox"],
			useSoftTabs: false,
			advanced: {
				enableSnippets: true,
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
			},
			rendererOptions: {
				fontSize: "13px",
				fontFamily: "Inconsolata, Monaco, Consolas, Courier New, Courier",
				fadeFoldWidgets: true,
				scrollPastEnd: true,
			},
		},
	};
	if (!$scope.model) {
		$scope.model = angular.extend({}, defaults);
	} else {
		if (!$scope.model.data) $scope.model.data = angular.extend({}, defaults.data);
		$scope.model.options = angular.extend({}, defaults.options, $scope.model.options || {});
	}
});
