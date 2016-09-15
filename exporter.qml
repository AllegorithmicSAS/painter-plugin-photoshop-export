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
  width: 30; height: 30
  tooltip: "Export to Photoshop"
  property bool loading: false

  style: ButtonStyle {
    background: Rectangle {
      width: control.width; height: control.height
      color: "transparent"

      Image {
        source: control.hovered && !control.loading ? "icons/PSiconHover.png" : "icons/PSicon.png"
        fillMode: Image.PreserveAspectFit
        width: control.width; height: control.height
        mipmap: true
        opacity: control.loading ? 0.5 : 1
      }

      Image {
        id: loadingIcon
        visible: control.loading
        source: "icons/PSiconLoading.png"
        fillMode: Image.PreserveAspectFit
        mipmap: true
        width: control.width; height: control.height

        RotationAnimation on rotation {
          running: control.loading
          from: 0
          to: 360
          duration: 500
          loops: Animation.Infinite
        }
      }
    }
  }

  QtObject {
    id: internal
    function updateProgressWindow(text) {
        progressText.text = text
    }

    function launchImport() {
      try {
        loading = true;
        progressWindow.open()
        Photoshop.importPainterDocument(updateProgressWindow);
      }
      catch (e) {
        alg.log.warn(e.message)
      }
      finally {
        progressWindow.close()
        loading = false;
      }
    }
  }

  AlgModalWindow {
    id: progressWindow
    width: 250
    height: 125
    minimumWidth: 250
    minimumHeight: 125
    maximumWidth: 250
    maximumHeight: 125
    flags: Qt.Dialog | Qt.WindowTitleHint
    function reload() {
      progressText.text = "Export in progress..."
    }

    Rectangle {
      id: content
      color: "transparent"
      anchors.fill: parent
      anchors.margins: 12

      ColumnLayout {
        spacing: 18
        anchors.fill: parent

        Rectangle {
            color: "transparent"
            Layout.fillWidth: true
            AlgTextEdit {
              id: progressText
              anchors.centerIn: parent
              width: parent.width
              wrapMode: TextEdit.Wrap
              clip: true
              readOnly: true
            }
        }

        Rectangle {
            color: "transparent"
            Layout.fillWidth: true
            AlgProgressBar {
              id: progressBar
              anchors.centerIn: parent
              width: parent.width
              indeterminate: true
            }
        }
      }
    }
  }

  FileDialog {
    id: fileDialog
    title: "Please locate Photoshop..."
    nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
    selectedNameFilter: "Executable files (*)"
    onAccepted: {
      alg.settings.setValue("photoshopPath", alg.fileIO.urlToLocalFile(fileUrl.toString()));
      internal.launchImport()
    }
  }

  onClicked: {
    if (!loading) {
      if (!alg.settings.contains("photoshopPath") && alg.settings.value("launchPhotoshop", false)) {
        fileDialog.open();
      } else {
        internal.launchImport()
      }
    }
  }
}
