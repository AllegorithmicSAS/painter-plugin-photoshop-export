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
  tooltip: "Export to Photoshop"
  property bool loading: false

  style: ButtonStyle {
    background: Rectangle {
      anchors.fill: control
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
          paused: !control.loading
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
    function launchImport() {
      try {
        loading = true;
        Photoshop.importPainterDocument();
      }
      catch (e) {
        alg.log.warn(e.message)
      }
      finally {
        loading = false;
      }
    }
  }

  FileDialog {
    id: fileDialog
    title: "Choose a Photoshop executable file..."
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
