// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.0
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4

import "photoshop.js" as Photoshop

Button {
  id: rect
  antialiasing: true
  width: 24; height: 24
  property bool loading: false


  style: ButtonStyle {
       
      background: Image {
      source: control.loading ? "icons/PSiconLoading.png" : (control.hovered ? "icons/PSiconHover.png" : "icons/PSicon.png")
      fillMode: Image.PreserveAspectFit
      mipmap: true
      width: control.width; height: control.height
    }

  }

	FileDialog {
		id: fileDialog
		title: "Choose a Photoshop executable file..."
		nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
		selectedNameFilter: "Executable files (*)"
		onAccepted: {
			alg.settings.setValue("photoshopPath", alg.fileIO.urlToLocalFile(fileUrl.toString()));
			rect.loading = true;
			Photoshop.importPainterDocument();
			rect.loading = false;
		}
	}

	MouseArea {
		id: mouseArea
		anchors.fill: parent
		onClicked: {
			if (!alg.settings.contains("photoshopPath") && alg.settings.value("launchPhotoshop", false)) {
				fileDialog.open();
			} else {
				rect.loading = true;
				Photoshop.importPainterDocument();
				rect.loading = false;
			}
		}
	}
}
