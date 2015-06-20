"use strict";

let app = require("app"),
	shell = require("shell"),
	AppWindow = require("./AppWindow"),
	AppMenu = require("./AppMenu"),
	BrowserWindow = require("browser-window");

module.exports = class Application {

	constructor() {
		this.pkgJson = require("../../package.json");
		this.windows = new Set();

		app.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				app.quit();
			}
		});

		this.openWindow();
	}

	openWindow() {
		let self = this,
			win = new AppWindow(this.pkgJson),
			menu = new AppMenu(this.pkgJson);

		menu
			.on("application:quit", () => {
				app.quit();
			})
			.on("file:new-window", () => {
				self.openWindow();
			})
			.on("application:website", () => {
				shell.openExternal(self.pkgJson.homepage);
			})
			.on("application:report-issue", () => {
				shell.openExternal(self.pkgJson.bugs);
			})
			.on("window:toggle-full-screen", () => {
				var focusedWindow = BrowserWindow.getFocusedWindow(),
					fullScreen = !focusedWindow.isFullScreen();
				focusedWindow.setFullScreen(fullScreen);
			})
			.on("window:toggle-dev-tools", () => {
				BrowserWindow.getFocusedWindow().toggleDevTools();
			})
			.on("window:reload", () => {
				BrowserWindow.getFocusedWindow().reloadIgnoringCache();
			})
			.on("view:server", () => {
				BrowserWindow.getFocusedWindow().webContents.send("view:server");
			})
			.on("view:database", () => {
				BrowserWindow.getFocusedWindow().webContents.send("view:database");
			})
			.on("view:collection", () => {
				BrowserWindow.getFocusedWindow().webContents.send("view:collection");
			})
			;
		menu.attach();

		win.show();
		this.windows.add(win);
		win.on("closed", () => {
			self.windows.delete(win);
		});
	}

};
