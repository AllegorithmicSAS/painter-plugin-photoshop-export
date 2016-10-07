// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Window 2.2

AlgModalWindow {
  flags: Qt.Dialog
  signal accepted()
  property alias contentItem: content
  property string defaultButtonText: "Save"

  function accept() {
    accepted()
    close()
  }

  FocusScope {
    focus: true
    Keys.onPressed: {
      if (event.key === Qt.Key_Escape) {
        close()
      }
      else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
        accept()
      }
    }
  }

  Rectangle {
    id: content
    anchors.top: parent.top
    anchors.bottom: buttons.top
    anchors.left: parent.left
    anchors.right: parent.right
    color: "transparent"
  }

  Flow {
    id: buttons
    anchors.bottom: parent.bottom
    anchors.left: parent.left; anchors.right: parent.right
    anchors.margins: 6
    spacing: 6
    layoutDirection: Qt.RightToLeft

    AlgButton {
      text: "Cancel"
      onClicked: close()
    }
    AlgButton {
      text: defaultButtonText
      isDefaultButton: true
      onClicked: {
        accept()
      }
    }
  }
}
