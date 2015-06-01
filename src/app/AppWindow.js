"use strict";

let path = require("path"),
	EventEmitter = require("events").EventEmitter,
	screen = require("screen"),
	BrowserWindow = require("browser-window");

module.exports = class AppWindow extends EventEmitter {

	constructor(pkg) {
		super();
		let mousePos = screen.getCursorScreenPoint(),
			winSize = {w:800, h:600},
			winOpts = {
				x: mousePos.x - (winSize.w / 2),
				y: mousePos.y - (winSize.h / 2),
				title: pkg.productName,
				width: winSize.w,
				height: winSize.h,
				"web-preferences": {
					"subpixel-font-scaling": true,
					"direct-write": true,
				},
			};
		let self = this;
		this.window = new BrowserWindow(winOpts)
			.on("closed", (e) => {
				self.emit("closed", e);
				self.window = null;
			})
			.on("devtools-opened", () => {
				self.window.webContents.send("window:toggle-dev-tools", true);
			})
			.on("devtools-closed", () => {
				self.window.webContents.send("window:toggle-dev-tools", false);
			})
			;
	}

	show() {
		let webPath = path.dirname(__dirname) + "/web/index.html",
			webUrl = `file://${webPath}`;
		this.window.loadUrl(webUrl);
		this.window.show();
	}

	reload() {
		this.window.webContents.reload();
	}

	toggleFullScreen() {
		this.window.setFullScreen(!this.window.isFullScreen());
	}

	toggleDevTools() {
		this.window.toggleDevTools();
	}

	close() {
		this.window.close();
		this.window = null;
	}

};
