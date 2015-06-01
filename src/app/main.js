"use strict";

global.shellStartTime = Date.now();


let v8 = require("v8"),
	app = require("app");
v8.setFlagsFromString("--harmony_arrow_functions"); // for app
app.commandLine.appendSwitch("js-flags", "--harmony_arrow_functions"); // for web


require("crash-reporter").start(); // Report crashes to our server.


process.on("uncaughtException", function(error) {
	if (!error) return console.log("uncaughtException but no error info");
	if (error.message) console.log(error.message);
	if (error.stack) console.log(error.stack);
});


// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on("ready", function() {
	let Application = require("./Application");

	global.application = new Application();

	console.log(`App load time: ${Date.now() - global.shellStartTime}ms`);
});
