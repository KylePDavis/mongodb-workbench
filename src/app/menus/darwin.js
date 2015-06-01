"use strict";

module.exports = function(pkg) {

	return [

		{
			label: `${pkg.productName}`,
			submenu: [
				{label:`About ${pkg.productName}`, selector:"orderFrontStandardAboutPanel:"},
				//TODO: {label:"Restart and Install Update", click:"application:install-update", visible:false},
				//TODO: {label:"Check for Update", click:"application:check-for-update", visible:false},
				//TODO: {label:"Downloading Update", enabled:false, visible:false},
				{type:"separator"},
				//TODO: {label:"Preferences...", accelerator:"Cmd+,", click:"application:show-settings"},
				{type:"separator"},
				{label:"Services", submenu:[]},
				{type:"separator"},
				{label:`Hide ${pkg.productName}`, accelerator:"Cmd+H", selector:"hide:"},
				{label:"Hide Others", accelerator:"Cmd+Shift+H", selector:"hideOtherApplications:"},
				{label:"Show All", selector:"unhideAllApplications:"},
				{type:"separator"},
				{label:"Quit", accelerator:"Cmd+Q", click:"application:quit"},
			],
		},

		{
			label: "File",
			submenu: [
				{label:"New Window", accelerator:"Cmd+Shift+N", click:"file:new-window"},
				//{label:"New", accelerator:"Cmd+N", click:"file:new"},
				{label:"Close", accelerator:"Cmd+W", selector:"performClose:"},
			],
		},

		{
			label: "Edit",
			submenu: [
				{label:"Undo", accelerator:"Cmd+Z", selector:"undo:"},
				{label:"Redo", accelerator:"Shift+Cmd+Z", selector:"redo:"},
				{type:"separator"},
				{label:"Cut", accelerator:"Cmd+X", selector:"cut:"},
				{label:"Copy", accelerator:"Cmd+C", selector:"copy:"},
				{label:"Paste", accelerator:"Cmd+V", selector:"paste:"},
				{label:"Select All", accelerator:"Cmd+A", selector:"selectAll:"},
			],
		},

		{
			label: "View",
			submenu: [
				{label:"Server", accelerator:"Cmd+1", click:"view:server"},
				{label:"Database", accelerator:"Cmd+2", click:"view:database"},
				{label:"Collection", accelerator:"Cmd+3", click:"view:collection"},
				{type:"separator"},
				{label:"Reload", accelerator:"Command+R", click:"window:reload"},
				{label:"Toggle Full Screen", accelerator:"Cmd+Ctrl+F", click:"window:toggle-full-screen"},
				{
					label: "Developer",
					submenu: [
						//TODO: {label:"Run Tests...", accelerator:"Alt+Cmd+T", click:"application:run-specs"},
						{label:"Toggle DevTools", accelerator:"Alt+Cmd+I", click:"window:toggle-dev-tools"},
					],
				},
			],
		},

		{
			label: "Window",
			submenu: [
				{label:"Minimize", accelerator:"Cmd+M", selector:"performMiniaturize:"},
				{label:"Zoom", selector:"performZoom:"},
				{type:"separator"},
				//TODO: {label:"Show Previous Tab", accelerator:"Shift+Cmd+[", click:"window:show-previous-tab"},
				//TODO: {label:"Show Next Tab", accelerator:"Shift+Cmd+]", click:"window:show-next-tab"},
				//TODO: {label:"Show Previous Lower Tab", accelerator:"Cmd+[", click:"window:show-previous-lower-tab"},
				//TODO: {label:"Show Next Lower Tab", accelerator:"Cmd+]", click:"window:show-next-lower-tab"},
				{type:"separator"},
				{label:"Bring All to Front", selector:"arrangeInFront:"},
			],
		},

		{
			label: "Help",
			submenu: [
				{label:"Web Site", click:"application:website"},
				{label:"Report Issue", click:"application:report-issue"},
			],
		},

	];

};
