import QtQuick 2.3
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4

Button {
    style: ButtonStyle {
        background: Rectangle {
            implicitWidth: 100
            implicitHeight: 25
            border.width: control.activeFocus ? 2 : 1
            border.color: "#000000"
            radius: 4
            gradient: Gradient {
                GradientStop { position: 0 ; color: control.pressed ? "#323232" : control.hovered ? "#3C3C3C" : "#494949" }
                GradientStop { position: 1 ; color: control.pressed ? "#323232" : control.hovered ? "#3C3C3C" : "#494949" }
            }
        }
        label: Component {
            Text {
                text: control.text
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
