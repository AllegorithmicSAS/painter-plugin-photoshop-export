// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4

Button {
  property bool isDefaultButton
  isDefaultButton: false

  style: ButtonStyle {
    background: Rectangle {
      implicitWidth: 100
      implicitHeight: 25
      border.width: control.activeFocus ? 2 : 1
      border.color: isDefaultButton ? "#C8C8C8" : "#000000"
      radius: 4
      gradient: Gradient {
        GradientStop { position: 0 ; color: control.pressed ? "#323232" : control.hovered ? "#3C3C3C" : "#494949" }
        GradientStop { position: 1 ; color: control.pressed ? "#323232" : control.hovered ? "#3C3C3C" : "#494949" }
      }
    }
    label: Component {
      Text {
        text: control.text
        font.bold: isDefaultButton
        clip: true
        wrapMode: Text.WordWrap
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
        anchors.fill: parent
        color: control.pressed ? "#FFFFFF" : control.hovered ? "#00BEF0" : "#C8C8C8"
      }
    }
  }
}
