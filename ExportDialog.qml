// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import QtQuick.Controls 1.4
import QtQuick.Layouts 1.3

import "photoshop.js" as Photoshop

AlgDialog {
    width: 400
    height: 300
    minimumWidth: 400
    minimumHeight: 300
    defaultButtonText: "Ok"
    title: "Select Materials/Channels to export"

    QtObject {
        id: internal
        property var documentType: {
            'Material': "material",
            'Stack': "stack",
            'Channel': "channel"
        }
    }

    function reload() {
        var documentStructure = alg.mapexport.documentStructure()
        documentStructureModel.clear()
        var list = alg.settings.value("exportMaps", [])
        var id = 0
        for (var materialId in documentStructure.materials) {
            var modelMaterialId = id
            ++id
            var material = documentStructure.materials[materialId]
            documentStructureModel.append({'name': material.name,
                                           'path': material.name,
                                           'type': internal.documentType.Material,
                                           'parentIndex': -1,
                                           'defaultChecked': Photoshop.isMapExportable(list, material.name)})
            //Browse stacks
            for (var stackId in material.stacks) {
                var stack = material.stacks[stackId]
                var stackPath = material.name + "." + stack.name
                var modelStackId = stack.name !== "" ? id : --id
                ++id
                // Do not display the main stack
                if (stack.name !== "") {
                    documentStructureModel.append({'name': stack.name,
                                                      'path': stackPath,
                                                      'type': internal.documentType.Stack,
                                                      'parentIndex': modelMaterialId,
                                                      'defaultChecked': Photoshop.isMapExportable(list, stackPath)})
                }
                //Browse channels
                for (var channelId in stack.channels) {
                    var channel = stack.channels[channelId]
                    var channelPath = stackPath + "." + channel
                    documentStructureModel.append({'name': channel,
                                                   'path': channelPath,
                                                   'type': internal.documentType.Channel,
                                                   'parentIndex': modelStackId,
                                                   'defaultChecked': Photoshop.isMapExportable(list, channelPath)})
                    ++id
                }
            }
        }
    }

    onAccepted: {
        var list = []
        for (var i = 0; i < repeater.count; ++i) {
            list.push({'path': repeater.itemAt(i).documentPath, 'checked': repeater.itemAt(i).checked})
        }
        alg.settings.setValue("exportMaps", list)
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
                anchors.top: parent.top
                anchors.left: parent.left; anchors.right: parent.right
                spacing: 6
                layoutDirection: Qt.RightToLeft
                AlgButton {
                    id: noneButton
                    text: "None"
                }
                AlgButton {
                    id: allButton
                    text: "All"
                }
            }

            ScrollView {
                id: scrollView
                Layout.fillWidth: true
                Layout.fillHeight: true
                horizontalScrollBarPolicy: Qt.ScrollBarAlwaysOff
                // remove 6 in order to have a right margin when
                // displaying the content
                property int viewportWidth: viewport.width - 6

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
                            property var prevItem: repeater.itemAt(parentIndex)
                            property alias checked: modelCheckBox.checked
                            property string documentPath: path
                            signal clicked()
                            Layout.leftMargin: paddingSize
                            Layout.minimumWidth: scrollView.viewportWidth - paddingSize
                            Layout.maximumWidth: scrollView.viewportWidth - paddingSize
                            enabled: !prevItem ? true : prevItem.enabled ?
                                         prevItem.checked : false
                            opacity: enabled ? 1. : 0.5

                            AlgCheckBox {
                                id: modelCheckBox
                                checked: defaultChecked

                                onClicked: {
                                    rowItem.clicked()
                                }

                                Connections {
                                    target: noneButton
                                    onClicked: {
                                       checked = false
                                    }
                                }
                                Connections {
                                    target: allButton
                                    onClicked: {
                                       checked = true
                                    }
                                }
                                Connections {
                                    target: prevItem
                                    onClicked: {
                                        checked = prevItem.checked
                                    }
                                }
                            }
                            AlgTextEdit {
                                borderActivated: true
                                borderOpacity: type === internal.documentType.Stack ?
                                                 0.65 : type === internal.documentType.Channel ?
                                                     0.3 : 1.
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
