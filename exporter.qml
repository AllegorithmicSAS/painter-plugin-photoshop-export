// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.0

import "photoshop.js" as Photoshop

AlgButton {
  id: rect
  isDefaultButton:true
  antialiasing: true
  text: "Export to Photoshop"

	FileDialog {
		id: fileDialog
		title: "Choose a Photoshop executable file..."
		nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
		selectedNameFilter: "Executable files (*)"
		onAccepted: {
			alg.settings.setValue("photoshopPath", alg.fileIO.urlToLocalFile(fileUrls[0]));
			Photoshop.importPainterDocument();
		}
	}

	MouseArea {
		id: mouseArea
		anchors.fill: parent
		onClicked: {
			if (!alg.settings.contains("photoshopPath") && alg.settings.value("launchPhotoshop", false)) {
				fileDialog.open();
			} else {
				Photoshop.importPainterDocument();
			}
		}
	}
}
