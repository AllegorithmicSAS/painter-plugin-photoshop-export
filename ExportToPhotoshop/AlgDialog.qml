import QtQuick 2.3
import QtQuick.Window 2.2

Window {
    color: "#323232"
    modality: Qt.WindowModal
    signal accepted()
    property alias contentItem: content

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
            text: "Save"
            isDefaultButton: true
            onClicked: {
                accept()
            }
        }
    }
}
