//////////////////////////////////////////////////////////////////////////////////
//  ExportToPhotoshop   Version: 1.0.0
//  Script File       main.qml, exporter.qml, header.jsx, footer.jsx
//  Platforms:        windows, mac, linux
//
//  works on:
//            Substance Painter 2.3 and upper   
//            Photoshop  CS6   CC2014   CC2015
//
//   Release Date:  13th September, 2016
//
//  Description:
//	- export all layers stacks to photoshop
//  - every material and channel are export one PSD file
//     
//	Install:
//  Copy ExportToPhotoshop folder into the plugin folder
//   
//////////////////////////////////////////////////////////////////////////////////

import QtQuick 2.2
import Painter 1.0

PainterPlugin {
	Component.onCompleted: {
		// default value settings
		if (!alg.settings.contains("pluginLaunchPhotoshop")) {
			if (Qt.platform.os == "windows" || Qt.platform.os == "osx") {
				alg.settings.setValue("pluginLaunchPhotoshop", true);
		 	} else {
				alg.settings.setValue("pluginLaunchPhotoshop", false);
		 	}
		 }
		// create the button
		alg.ui.addToolBarWidget("exporter.qml");
	}
}
