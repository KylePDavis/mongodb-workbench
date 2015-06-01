"use strict";

let EventEmitter = require("events").EventEmitter,
	Menu = require("menu");

module.exports = class AppMenu extends EventEmitter {

	constructor(pkg) {
		super();
		this.template = require(`./menus/${process.platform}`)(pkg);
	}

	attach() {
		var tmpl = this._getTemplateWithClickHandlers(this.template);
		this.menu = Menu.buildFromTemplate(tmpl);
		Menu.setApplicationMenu(this.menu);
	}

	/**
	 * Get copy of template and replace click strings with click handler functions that emit event
	 * @method _getTemplateWithClickHandlers
	 * @private
	 */
	_getTemplateWithClickHandlers(tmpl) {
		let self = this;
		return JSON.parse(JSON.stringify(tmpl), (k, v) => {
			if (k === "click" && typeof v === "string")
				return () => self.emit(v);
			return v;
		});
	}

};
