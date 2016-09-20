// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.1

ScrollView {
    style: ScrollViewStyle {
        transientScrollBars: false

        handle: Rectangle {
            implicitWidth: styleData.horizontal ? 10 : 16
            implicitHeight: styleData.horizontal ? 16 : 10
            color: "transparent"
            Rectangle {
                color: styleData.pressed ? "#565656" : styleData.hovered ? "#3C3C3C" : "#494949"
                border.color: "#1E1E1E"
                radius: 3
                anchors.fill: parent
                anchors.leftMargin: styleData.horizontal ? 0 : 6
                anchors.topMargin: styleData.horizontal ? 6 : 0
            }
        }
        scrollBarBackground: Rectangle {
            implicitWidth: styleData.horizontal ? 10 : 16
            implicitHeight: styleData.horizontal ? 16 : 10
            color: "transparent"
            Rectangle {
                anchors.fill: parent
                anchors.leftMargin: styleData.horizontal ? 0 : 6
                anchors.topMargin: styleData.horizontal ? 6 : 0
                color: "#1E1E1E"
                radius: 3
            }
        }
        decrementControl: Rectangle {
            implicitWidth: styleData.horizontal ? 10 : 16
            implicitHeight: styleData.horizontal ? 16 : 10
            color: "transparent"
            Rectangle {
                anchors.fill: parent
                anchors.leftMargin: styleData.horizontal ? 0 : 6
                anchors.topMargin: styleData.horizontal ? 6 : 0
                color: styleData.pressed ? "#565656" : styleData.hovered ? "#3C3C3C" : "#494949"
                border.color: "#1E1E1E"
                radius: 3
            }
        }
        incrementControl: Rectangle {
            implicitWidth: styleData.horizontal ? 10 : 16
            implicitHeight: styleData.horizontal ? 16 : 10
            color: "transparent"
            Rectangle {
                anchors.fill: parent
                anchors.leftMargin: styleData.horizontal ? 0 : 6
                anchors.topMargin: styleData.horizontal ? 6 : 0
                color: styleData.pressed ? "#565656" : styleData.hovered ? "#3C3C3C" : "#494949"
                border.color: "#1E1E1E"
                radius: 3
            }
        }
        corner: Rectangle {
            color: "transparent"
        }
    }
}
