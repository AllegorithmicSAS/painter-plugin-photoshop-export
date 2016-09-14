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
  width: 500
  height: 250
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
        var index = bitDepthComboBox.currentIndex
        alg.settings.setValue("bitDepth", bitDepthModel.get(index).value);
  }

  Rectangle {
    id: content
    parent: contentItem
    anchors.fill: parent
    anchors.margins: 12
    color: "transparent"
    clip: true

    function reload() {
      path.reload()
      launchPhotoshopCheckBox.reload()
      paddingCheckBox.reload()
      bitDepthComboBox.reload()
    }

    ScrollView {
      id: scrollView
      anchors.fill: parent
      horizontalScrollBarPolicy: Qt.ScrollBarAlwaysOff
      // remove 6 in order to have a right margin when
      // displaying the content
      property int viewportWidth: viewport.width - 6

      ColumnLayout {
        spacing: 18
        clip: true
        Layout.maximumWidth: scrollView.viewportWidth

        ColumnLayout {
          spacing: 6
          Layout.maximumWidth: scrollView.viewportWidth

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
          Layout.maximumWidth: scrollView.viewportWidth

          AlgTextEdit {
            readOnly: true
            text: "Launch photoshop after export:"
            Layout.fillWidth: true
            font.bold: true
          }

          AlgCheckBox {
            id: launchPhotoshopCheckBox

            function reload() {
              checked = alg.settings.value("launchPhotoshop", false);
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
            text: "Enable padding:"
            Layout.fillWidth: true
            font.bold: true
          }

          AlgCheckBox {
            id: paddingCheckBox

            function reload() {
              checked = alg.settings.value("padding", false);
            }

            Component.onCompleted: {
              reload()
            }
          }
        }

        RowLayout {
          spacing: 6
          Layout.maximumWidth: scrollView.viewportWidth

          AlgTextEdit {
            readOnly: true
            text: "Export bitdepth:"
            Layout.fillWidth: true
            font.bold: true
          }

          AlgComboBox {
            id: bitDepthComboBox
            textRole: "key"
            Layout.minimumWidth: 150

            model: ListModel {
              id: bitDepthModel
              ListElement { key: "Texture set value"; value: -1 }
              ListElement { key: "8 bits"; value: 8 }
              ListElement { key: "16 bits"; value: 16 }
            }
            function reload() {
              var bitdepth = alg.settings.value("bitDepth", -1);
              for (var i = 0; i < bitDepthModel.count; ++i) {
                var current = bitDepthModel.get(i);
                if (bitdepth === current.value) {
                  currentIndex = i;
                  break
                }
              }
            }
            Component.onCompleted: {
              reload()
            }
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
      path.text = alg.fileIO.urlToLocalFile(fileUrl.toString())
    }
    onVisibleChanged: {
      if (!visible) {
        parent.active()
      }
    }
  }
}
