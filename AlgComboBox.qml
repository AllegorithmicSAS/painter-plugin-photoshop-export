// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4

ComboBox {
  style: ComboBoxStyle {
    // Button background
    background: Rectangle {
      implicitWidth: 150
      implicitHeight: 25
      border.width: 1
      border.color: "#000000"
      radius: 4
      color: control.pressed ? "#323232" : control.hovered ? "#3C3C3C" : "#494949"
    }

    // Label parameters
    label: Component {
      Text {
        text: control.currentText
        font.bold: isDefaultButton
        clip: true
        wrapMode: Text.WordWrap
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
        anchors.fill: parent
        color: control.pressed ? "#FFFFFF" : control.hovered ? "#00BEF0" : "#C8C8C8"
      }
    }
    dropDownButtonWidth: 4
  }
}
