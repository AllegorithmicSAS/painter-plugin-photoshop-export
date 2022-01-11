import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.3
import AlgWidgets 2.0

import "photoshop.js" as Photoshop

AlgDialog {
    width: 400
    height: 300
    minimumWidth: 400
    minimumHeight: 300
    defaultButtonText: "Ok"
    title: qsTr("Select Materials/Channels to export")

    QtObject {
        id: internal
        property var documentType: {
            'Material': "material",
            'Stack': "stack",
            'Channel': "channel"
        }

        function nextModelIndex(model, materialName) {
            var result = 0
            for (result = 0; result < model.count; ++result) {
                var modelObject = model.get(result)
                if (modelObject.type === documentType.Material && modelObject.name.localeCompare(materialName) > 0) {
                    break
                }
            }
            return result
        }
    }

    function reload() {
        var documentStructure = alg.mapexport.documentStructure()
        documentStructureModel.clear()
        var mapsList = Photoshop.exportMaps();
        for (var materialId in documentStructure.materials) {
            var material = documentStructure.materials[materialId]
            var id = internal.nextModelIndex(documentStructureModel, material.name)
            var modelMaterialId = id
            documentStructureModel.insert(id,
                                          {'name': material.name,
                                           'path': material.name,
                                           'type': internal.documentType.Material,
                                           'parentIndex': 0,
                                           'defaultChecked': mapsList.isChecked(material.name)})
            ++id
            //Browse stacks
            for (var stackId in material.stacks) {
                var stack = material.stacks[stackId]
                var stackPath = material.name + "." + stack.name
                var modelStackId = stack.name !== "" ? id : --id
                // Do not display the main stack
                if (stack.name !== "") {
                    documentStructureModel.insert(id,
                                                  {'name': stack.name,
                                                   'path': stackPath,
                                                   'type': internal.documentType.Stack,
                                                   'parentIndex': id - modelMaterialId,
                                                   'defaultChecked': mapsList.isChecked(stackPath)})
                }
                ++id
                //Browse channels
                for (var channelId in stack.channels) {
                    var channel = stack.channels[channelId]
                    var channelPath = stackPath + "." + channel
                    documentStructureModel.insert(id,
                                                  {'name': channel,
                                                   'path': channelPath,
                                                   'type': internal.documentType.Channel,
                                                   'parentIndex': id - modelStackId,
                                                   'defaultChecked': mapsList.isChecked(channelPath)})
                    ++id
                }
            }
        }
    }

    onAccepted: {
        var exportMaps = {}
        for (var i = 0; i < repeater.count; ++i) {
            exportMaps[repeater.itemAt(i).documentPath] = repeater.itemAt(i).checked;
        }
        alg.settings.setValue("exportMaps", exportMaps)
    }

    ListModel {
        id: documentStructureModel
    }

    Rectangle {
        id: content
        parent: contentItem
        anchors.fill: parent
        anchors.margins: 12
        color: "transparent"
        clip: true

        ColumnLayout {
            spacing: 6
            anchors.fill: parent

            Flow {
                id: controlButtons
                spacing: 6
                layoutDirection: Qt.RightToLeft
                AlgButton {
                    id: noneButton
                    text: qsTr("None")
                }
                AlgButton {
                    id: allButton
                    text: qsTr("All")
                }
            }

            AlgScrollView {
                id: scrollView
                Layout.fillWidth: true
                Layout.fillHeight: true

                ColumnLayout {
                    spacing: 6
                    Layout.minimumWidth: scrollView.viewportWidth
                    Layout.maximumWidth: scrollView.viewportWidth

                    Repeater {
                        id: repeater
                        model: documentStructureModel
                        RowLayout {
                            id: rowItem
                            spacing: 6
                            property int paddingSize: type === internal.documentType.Stack ?
                                                          10 : type === internal.documentType.Channel ?
                                                              20 : 0
                            property var prevItem: null
                            property alias checked: modelCheckBox.checked
                            property string documentPath: model.path
                            signal clicked()
                            Layout.leftMargin: paddingSize
                            Layout.minimumWidth: scrollView.viewportWidth - paddingSize
                            Layout.maximumWidth: scrollView.viewportWidth - paddingSize

                            Component.onCompleted: {
                                if (parentIndex > 0) prevItem = repeater.itemAt(index - parentIndex)
                            }

                            AlgCheckBox {
                                id: modelCheckBox
                                checked: defaultChecked
                                Layout.preferredWidth: height

                                onClicked: {
                                    rowItem.clicked()
                                }

                                onCheckedChanged: {
                                    if (prevItem && checked) {
                                        prevItem.checked = true;
                                    }
                                }

                                Connections {
                                    target: noneButton
                                    function onClicked() {
                                       checked = false
                                    }
                                }
                                Connections {
                                    target: allButton
                                    function onClicked() {
                                       checked = true
                                    }
                                }
                                Connections {
                                    target: prevItem
                                    function onClicked() {
                                        checked = prevItem.checked
                                        // transmit event to children
                                        rowItem.clicked()
                                    }
                                }
                            }
                            AlgTextEdit {
                                readOnly: true
                                borderActivated: true
                                borderOpacity: 0.3
                                Layout.fillWidth: true
                                text: name
                            }
                        }
                    }
                }
            }
        }
    }
}
