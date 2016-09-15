// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Window 2.2

Window {
  color: "#323232"
  modality: Qt.WindowModal
  visible: false
  property bool screenCentered: true

  function reload() {}
  function open() {
    visible = true
    reload()
  }
  function close() {
    visible = false
  }
  function accept() {
    accepted()
    close()
  }

  Component.onCompleted: {
    if (screenCentered) {
      // move the popup at the center of the screen when completed
      x = Screen.width / 2 - width / 2
      y = Screen.height / 2 - height / 2
    }
  }
}
