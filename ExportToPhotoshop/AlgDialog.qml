import QtQuick 2.3
import QtQuick.Window 2.2

Window {
    color: "#323232"
    modality: Qt.WindowModal
    signal accepted()

    function reload() {}
    function open() {
        visible = true
        reload()
    }
    function close() {
        visible = false
    }

    FocusScope {
        focus: true
        Keys.onPressed: {
            if (event.key === Qt.Key_Escape) {
                close()
            }
        }
    }

    Flow {
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
            onClicked: {
                accepted()
                close()
            }
        }
    }
}
