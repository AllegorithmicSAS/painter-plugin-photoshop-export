// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4

CheckBox {
  style: CheckBoxStyle {
    indicator: Rectangle {
      implicitWidth: 16
      implicitHeight: 16
      radius: 3
      border.color: "#000000"
      border.width: 1
      color: control.hovered ? "#606060" : "#3C3C3C"

      Rectangle {
        color: control.checked ? "#00BCF2" : "#323232"
        border.color: "#000000"
        radius: 1
        anchors.margins: 3
        anchors.fill: parent
      }
    }
  }
}
