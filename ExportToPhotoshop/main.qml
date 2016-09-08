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

	// plugin description, displayed in the plugin about dialog
	description: "This plugin export layers stacks to photoshop. Each material and channel are exported one PSD file.\n"

	// project homepage url, displayed in the plugin about dialog.
	// Warning: the scheme is madatory to create a clickable link in the about dialog.
	projectUrl: "https://github.com/AllegorithmicSAS/painter-plugin-photoshop-export"
		
	Component.onCompleted: {
		// create the button
		alg.ui.addToolBarWidget("exporter.qml");
	}
}
