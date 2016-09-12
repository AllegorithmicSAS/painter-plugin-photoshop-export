import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import QtQuick.Controls 1.4
import QtQuick.Layouts 1.3

AlgDialog {
    id: configureDialog
    visible: false
    title: "configure"
    width: 400
    height: 200

    function reload() {
        content.reload()
    }

    Component.onCompleted: {
        // move the popup at the center of the screen when completed
        x = Screen.width / 2 - width / 2
        y = Screen.height / 2 - height / 2
    }

    onAccepted: {
        alg.log.error("WTF???")
    	if (path.text != "...") {
			alg.settings.setValue("photoshopPath", path.text);
		}
		alg.settings.setValue("launchPhotoshop", launchPhotoshop.checked);
    }

    Rectangle {
        id: content
        anchors.centerIn: parent
        anchors.fill: parent
        color: "transparent"

        function reload() {
            path.reload()
            launchPhotoshop.reload()
        }

        ColumnLayout {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.margins: 6
            spacing: 18

            ColumnLayout {
                spacing: 6

                TextEdit {
                    readOnly: true
                    text: "Path to Photoshop"
                    font.bold: true
                    color: "#C8C8C8"
                }

                RowLayout {
                    spacing: 6

                    TextEdit {
                        id: path
                        clip: true
                        wrapMode: TextEdit.Wrap
                        readOnly: true
                        Layout.fillWidth: true
                        color: "#C8C8C8"

                        function reload() {
                            text = alg.settings.value("photoshopPath", "...")
                        }

                        Component.onCompleted: {
                            reload()
                        }
                    }

                    AlgButton {
                        id: searchPathButton
                        text: "search"
                        onClicked: {
                            // open the search path dialog
                            searchPathDialog.setVisible(true)
                        }
                    }
                }
            }

            RowLayout {
                spacing: 6
                TextEdit {
                    readOnly: true
                    text: "Launch photoshop after process"
                    Layout.fillWidth: true
                    font.bold: true
                    color: "#C8C8C8"
                }

                AlgCheckBox {
                    id: launchPhotoshop

                    function reload() {
                        checked = alg.settings.contains("launchPhotoshop");
                    }

                    Component.onCompleted: {
                        reload()
                    }
                }
            }
        }
    }

    FileDialog {
        id: searchPathDialog
        title: "Choose a Photoshop executable file..."
        nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
        selectedNameFilter: "Executable files (*)"
        onAccepted: {
            path.text = fileUrl.toString()
        }
    }
}
