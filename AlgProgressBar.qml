// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4
import QtGraphicalEffects 1.0

ProgressBar {
    style: ProgressBarStyle {
        background: Rectangle {
            color: "#323232"
            border.color: "#000000"
            border.width: 1
            implicitWidth: 200
            implicitHeight: 24
        }
        progress: Rectangle {
            color: control.indeterminate ? "transparent" : "#00BCF2"

            // Indeterminate animation by animating alternating stripes:
            Item {
                id: bar
                anchors.fill: parent
                anchors.margins: 1
                visible: control.indeterminate
                clip: true
                property int actualIndex: 0

                Row {
                    Repeater {
                        Rectangle {
                            color: "transparent"
                            width: 60 ; height: control.height

                            LinearGradient {
                                anchors.fill: parent
                                visible: index % 3 ? false : true
                                start: Qt.point(0, 0)
                                end: Qt.point(parent.width, 0)
                                gradient: Gradient {
                                    GradientStop { position: 0.0; color: "#323232" }
                                    GradientStop { position: 1.0; color: "#00BCF2" }
                                }
                            }
                        }
                        model: control.width / 60 + 2
                    }
                    XAnimator on x {
                        from: -60 ; to: 120
                        duration: 1500
                        loops: Animation.Infinite
                        running: control.indeterminate
                    }
                }
            }
        }
    }
}
