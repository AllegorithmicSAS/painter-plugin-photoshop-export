// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.0
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4
import AlgWidgets 1.0
import AlgWidgets.Style 1.0

import "photoshop.js" as Photoshop

Button {
  id: control
  antialiasing: true
  width: 32
  height: 32
  property bool loading: false
  tooltip: "Export to Photoshop"

  style: ButtonStyle {
    background: Rectangle {
      anchors.fill: control
      width: control.width; height: control.height
      color: control.hovered ?
        "#262626" :
        "transparent"
    }
  }

  Image {
    anchors.fill: parent
    anchors.margins: 8
    source: control.hovered && !control.loading ? "icons/Photoshop_hover.svg" : "icons/Photoshop_idle.svg"
    fillMode: Image.PreserveAspectFit
    sourceSize.width: control.width
    sourceSize.height: control.height
    mipmap: true
    opacity: control.loading ? 0.5 : 1
  }

  Image {
    id: loadingIcon
    anchors.fill: parent
    anchors.margins: 8
    visible: control.loading
    source: "icons/PSiconLoading.png"
    fillMode: Image.PreserveAspectFit
    sourceSize.width: control.width
    sourceSize.height: control.height
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

  QtObject {
    id: internal
    function updateProgressWindow(text) {
        progressText.text = text
    }

    function launchExportDialog() {
      exportDialog.open()
    }

    function launchExport() {
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
  ExportDialog {
      id: exportDialog

      onAccepted: {
        visible = false
        internal.launchExport()
      }
  }

  AlgWindow {
    id: progressWindow
    minimumWidth: 400
    minimumHeight: 125
    maximumWidth: 400
    maximumHeight: 125
    title: "Export to Photoshop"
    flags: Qt.Dialog | Qt.CustomizeWindowHint | Qt.WindowTitleHint | Qt.WindowSystemMenuHint
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
      internal.launchExportDialog()
    }
  }

  onClicked: {
    if (!loading) {
      if (!alg.settings.contains("photoshopPath") && alg.settings.value("launchPhotoshop", false)) {
        fileDialog.open();
      } else {
        internal.launchExportDialog()
      }
    }
  }
}
