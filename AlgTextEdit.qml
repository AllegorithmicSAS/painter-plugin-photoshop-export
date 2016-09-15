// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3

TextEdit {
  color: "#C8C8C8"
  property bool borderActivated
  borderActivated: false
  textMargin: borderActivated ? 4 : 0
  clip: true

  Rectangle {
    anchors.fill: parent
    color: "transparent"
    border.color: borderActivated ? "#000000" : "transparent"
    radius: 4
  }
}
