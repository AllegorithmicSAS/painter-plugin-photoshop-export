import QtQuick
import QtQuick.Window
import QtQuick.Dialogs
import QtQuick.Controls
import QtQuick.Layouts
import AlgWidgets 2.0

AlgDialog {
  id: configureDialog
  visible: false
  title: qsTr("Configure")
  width: 500
  height: 220
  minimumWidth: 400
  minimumHeight: 220

  function reload() {
    content.reload()
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

    AlgScrollView {
      id: scrollView
      anchors.fill: parent

      ColumnLayout {
        spacing: 18
        Layout.fillWidth: true
        Layout.maximumWidth: scrollView.viewportWidth
        Layout.minimumWidth: scrollView.viewportWidth

        AlgLabel {
          text: qsTr("Path to Photoshop")
          Layout.fillWidth: true
        }

        RowLayout {
          spacing: 6
          Layout.fillWidth: true

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
            text: qsTr("Set path")
            onClicked: {
              // open the search path dialog
              searchPathDialog.visible = true
            }
          }
        }
      }

      RowLayout {
        spacing: 6
        Layout.fillWidth: true

        AlgLabel {
          text: qsTr("Launch photoshop after export")
          Layout.fillWidth: true
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
        AlgLabel {
          text: qsTr("Enable padding")
          Layout.fillWidth: true
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
        Layout.fillWidth: true

        AlgLabel {
          text: qsTr("Export bitdepth")
          Layout.fillWidth: true
        }

        AlgComboBox {
          id: bitDepthComboBox
          textRole: "key"
          Layout.minimumWidth: 150

          model: ListModel {
            id: bitDepthModel
            ListElement { key: qsTr("TextureSet value"); value: -1 }
            ListElement { key: qsTr("8 bits"); value: 8 }
            ListElement { key: qsTr("16 bits"); value: 16 }
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

  FileDialog {
    id: searchPathDialog
    title: qsTr("Choose a Photoshop executable file...")
    nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
    selectedNameFilter.index: 0
    onAccepted: {
      path.text = alg.fileIO.urlToLocalFile(searchPathDialog.selectedFile.toString())
    }
    onVisibleChanged: {
      if (!visible) {
        configureDialog.requestActivate();
      }
    }
  }
}
