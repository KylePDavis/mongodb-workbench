"use strict";

module.exports = function(pkg) {

	return [

		{
			label: "&File",
			submenu: [
				{label:"&Preferences", click:"application:show-settings"},
				{label:"Quit", accelerator:"Ctrl+Q", click:"application:quit"},
			],
		},

		{
			label: "&Edit",
			submenu: [
				{label:"&Undo", accelerator:"Ctrl+Z", click:"core:undo"},
				{label:"&Redo", accelerator:"Ctrl+Y", click:"core:redo"},
				{type:"separator"},
				{label:"&Cut", accelerator:"Ctrl+X", click:"core:cut"},
				{label:"C&opy", accelerator:"Ctrl+C", click:"core:copy"},
				{label:"&Paste", accelerator:"Ctrl+V", click:"core:paste"},
				{label:"Select &All", accelerator:"Ctrl+A", click:"core:select-all"},
			],
		},

		{
			label: "&View",
			submenu: [
				{label:"&Reload", accelerator:"Ctrl+R", click:"window:reload"},
				{label:"Toggle &Full Screen", accelerator:"Ctrl+Shift+F", click:"window:toggle-full-screen"},
				{
					label: "Developer",
					submenu: [
						//TODO: {label:"Run Tests...", accelerator:"Ctrl+Shift+T", click:"application:run-specs"},
						{label:"Toggle Developer &Tools", accelerator:"Ctrl+Shift+I", click:"window:toggle-dev-tools"},
					],
				},
			],
		},

		{
			label: "&Help",
			submenu: [
				{label:`About ${pkg.productName}`, click:"application:about"},
			],
		},

	];

};
