"use strict";
/*global ace*/

ace.define("ace/ext/gotolinebox",
["require", "exports", "module", "ace/lib/dom", "ace/lib/lang", "ace/lib/event", "ace/keyboard/hash_handler", "ace/lib/keys"],
function(require, exports) {
// "use strict";

var dom = require("../lib/dom");
var lang = require("../lib/lang");
var event = require("../lib/event");

var HashHandler = require("../keyboard/hash_handler").HashHandler;
var keyUtil = require("../lib/keys");

var gotolineboxCss = " " +
  ".ace_gotoline { position:absolute; top:0; right:0; z-index:99; padding:0.5em; background:#333; opacity:0.8; border:2px solid #888; }" +
  ".ace_gotoline input, .ace_gotoline button { background-color:#555; color:#EEE; border:1px solid #EEE; margin:4px; padding:0 4px; }" +
  ".ace_gotoline input:focus, .ace_gotoline button:focus { color:#EEF; border-color:#EEF; }";

dom.importCssString(gotolineboxCss, "ace_gotoline_box");

var html = "<div class=\"ace_gotoline\">" +
	"<div class=\"ace_gotoline_form\">" +
		"<input class=\"ace_gotoline_field\" placeholder=\"Goto Line Number:\" spellcheck=\"false\"></input>" +
		"<button type=\"button\" action=\"hide\" class=\"ace_gotoline_btn_close\">X</button>" +
	"</div>" +
"</div>".replace(/>\s+/g, ">");

var GotoLineBox = function(editor) {
	var div = dom.createElement("div");
	div.innerHTML = html;
	this.element = div.firstChild;

	this.$init();
	this.setEditor(editor);
};

(function() {
	this.setEditor = function(editor) {
		editor.gotoLineBox = this;
		editor.container.appendChild(this.element);
		this.editor = editor;
	};

	this.$initElements = function(sb) {
		this.gotoLineBox = sb.querySelector(".ace_gotoline_form");
		this.gotoLineField = this.gotoLineBox.querySelector(".ace_gotoline_field");
	};

	this.$init = function() {
		var sb = this.element;

		this.$initElements(sb);

		var self = this;
		event.addListener(sb, "mousedown", function(e) {
			setTimeout(function() {
				self.activeInput.focus();
			}, 0);
			event.stopPropagation(e);
		});
		event.addListener(sb, "click", function(e) {
			var t = e.target || e.srcElement;
			var action = t.getAttribute("action");
			if (action && self[action]) {
				self[action]();
			} else if (self.$gotoLineBarKb.commands[action]) {
				self.$gotoLineBarKb.commands[action].exec(self);
			}
			event.stopPropagation(e);
		});

		event.addCommandKeyListener(sb, function(e, hashId, keyCode) {
			var keyString = keyUtil.keyCodeToString(keyCode);
			var command = self.$gotoLineBarKb.findKeyCommand(hashId, keyString);
			if (command && command.exec) {
				command.exec(self);
				event.stopEvent(e);
			}
		});

		this.$onChange = lang.delayedCall(function() {
			self.find();
		});

		event.addListener(this.gotoLineField, "input", function() {
			self.$onChange.schedule(20);
		});
		event.addListener(this.gotoLineField, "focus", function() {
			self.activeInput = self.gotoLineField;
		});
	};

	this.$closeGotoLineBoxKb = new HashHandler([
		{
			bindKey: "Esc",
			name: "closeGotoLineBox",
			exec: function(editor) {
				editor.gotoLineBox.hide();
			},
		},
	]);

	this.$gotoLineBarKb = new HashHandler();
	this.$gotoLineBarKb.bindKeys({
		esc: function(sb) {
			setTimeout(function() {
				sb.hide();
			});
		},
		Return: function(sb) {
			sb.find();
		},
	});

	this.$syncOptions = function() {
		this.find();
	};

	this.find = function() {
		var line = parseInt(this.gotoLineField.value, 10);
		if (!isNaN(line)) {
			this.editor.gotoLine(line);
		}
	};

	this.hide = function() {
		this.element.style.display = "none";
		this.editor.keyBinding.removeKeyboardHandler(this.$closeGotoLineBoxKb);
		this.editor.focus();
	};

	this.show = function() {
		this.element.style.display = "";

		this.gotoLineField.focus();
		this.gotoLineField.select();

		this.editor.keyBinding.addKeyboardHandler(this.$closeGotoLineBoxKb);
	};

	this.isFocused = function() {
		return global.document.activeElement === this.gotoLineField;
	};

}).call(GotoLineBox.prototype);

exports.GotoLineBox = GotoLineBox;

exports.GotoLine = function(editor) {
	var sb = editor.gotoLineBox || new GotoLineBox(editor);
	sb.show();
};

});

(function() {
	ace.require(["ace/ext/gotolinebox"], function() {});
}());
