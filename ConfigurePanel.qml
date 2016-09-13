// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import QtQuick.Controls 1.4
import QtQuick.Layouts 1.3

AlgDialog {
  id: configureDialog
  visible: false
  title: "configure"
  width: 400
  height: 200
  minimumWidth: 400
  minimumHeight: 200

  function reload() {
    content.reload()
  }

  Component.onCompleted: {
    // move the popup at the center of the screen when completed
    x = Screen.width / 2 - width / 2
    y = Screen.height / 2 - height / 2
  }

  onAccepted: {
    if (path.text != "...") {
			alg.settings.setValue("photoshopPath", path.text);
		}
		alg.settings.setValue("launchPhotoshop", launchPhotoshopCheckBox.checked);
		alg.settings.setValue("padding", paddingCheckBox.checked);
  }

  Rectangle {
    id: content
    parent: contentItem
    anchors.centerIn: parent
    anchors.fill: parent
    anchors.topMargin: 12
    color: "transparent"
    clip: true

    function reload() {
      path.reload()
      launchPhotoshopCheckBox.reload()
      paddingCheckBox.reload()
    }

    ColumnLayout {
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.margins: 12
      spacing: 18

      ColumnLayout {
        spacing: 6

        AlgTextEdit {
          readOnly: true
          text: "Path to Photoshop"
          font.bold: true
        }

        RowLayout {
          spacing: 6

          AlgTextEdit {
            id: path
            borderActivated: true
            wrapMode: TextEdit.Wrap
            readOnly: true
            Layout.fillWidth: true

            function reload() {
              text = alg.settings.value("photoshopPath", "...")
            }

            Component.onCompleted: {
              reload()
            }
          }

          AlgButton {
            id: searchPathButton
            text: "Set path"
            onClicked: {
              // open the search path dialog
              searchPathDialog.setVisible(true)
            }
          }
        }
      }

      RowLayout {
        spacing: 6
        AlgTextEdit {
          readOnly: true
          text: "Launch photoshop after export:"
          Layout.fillWidth: true
          font.bold: true
        }

        AlgCheckBox {
          id: launchPhotoshopCheckBox

          function reload() {
            checked = alg.settings.contains("launchPhotoshop");
          }

          Component.onCompleted: {
            reload()
          }
        }
      }

      RowLayout {
        spacing: 6
        AlgTextEdit {
          readOnly: true
          text: "Active Padding:"
          Layout.fillWidth: true
          font.bold: true
        }

        AlgCheckBox {
          id: paddingCheckBox

          function reload() {
            checked = alg.settings.contains("padding");
          }

          Component.onCompleted: {
            reload()
          }
        }
      }
    }
  }

  FileDialog {
    id: searchPathDialog
    title: "Choose a Photoshop executable file..."
    nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
    selectedNameFilter: "Executable files (*)"
    onAccepted: {
      path.text = fileUrl.toString()
    }
    onVisibleChanged: {
      if (!visible) {
        parent.active()
      }
    }
  }
}
