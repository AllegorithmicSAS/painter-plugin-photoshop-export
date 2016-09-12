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
