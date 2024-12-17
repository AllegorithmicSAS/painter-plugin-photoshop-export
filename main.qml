import QtQuick
import Painter 1.0
import QtQuick.Layouts
import QtQuick.Dialogs
import QtQuick.Controls
import AlgWidgets 2.0
import AlgWidgets.Style 2.0

import "photoshop.js" as Photoshop

PainterPlugin {
	Component.onCompleted: {
		// default value settings
		if (!alg.settings.contains("launchPhotoshop")) {
			if (Qt.platform.os == "windows" || Qt.platform.os == "osx") {
				alg.settings.setValue("launchPhotoshop", true);
		 	} else {
				alg.settings.setValue("launchPhotoshop", false);
		 	}
		 	alg.settings.setValue("padding", false);
		}
		var sendtoAction = alg_.mainWindowExt.addSendTo(qsTr("Export to Photoshop"), qsTr("Export to Photoshop"), Qt.resolvedUrl("icons/Photoshop_idle.svg"), Qt.resolvedUrl("icons/Photoshop_idle.svg"));
		sendtoAction.triggered.connect(internal.sendToTriggered);
	}

	onConfigure: {
		// open the configuration panel
		configurePanel.open()
	}

	ConfigurePanel {
		id: configurePanel
	}

	QtObject {
	property bool loading: false
		id: internal

		function updateProgressWindow(text) {
			progressText.text = text
		}

		function launchExportDialog() {
			exportDialog.open()
		}

		function launchExport() {
			try {
				loading = true;
				progressWindow.open()
				Photoshop.importPainterDocument(updateProgressWindow);
			}
			catch (e) {
				alg.log.warn(e.message)
			}
			finally {
				progressWindow.close()
				loading = false;
			}
		}

		function sendToTriggered() {
			if (!internal.loading) {
				if (!alg.settings.contains("photoshopPath") && alg.settings.value("launchPhotoshop", false)) {
					fileDialog.open();
				} else {
					internal.launchExportDialog()
				}
			}
		}
	}

	ExportDialog {
		id: exportDialog

		onAccepted: {
			close()
			internal.launchExport()
		}
	}

	AlgWindow {
		id: progressWindow
		minimumWidth: 400
		minimumHeight: 125
		maximumWidth: 400
		maximumHeight: 125
		title: qsTr("Export to Photoshop")
		flags: Qt.Dialog | Qt.CustomizeWindowHint | Qt.WindowTitleHint | Qt.WindowSystemMenuHint
		function reload() {
			progressText.text = qsTr("Export in progress...")
		}

		Rectangle {
			id: content
			color: "transparent"
			anchors.fill: parent
			anchors.margins: 12

			ColumnLayout {
				spacing: 18
				anchors.fill: parent

				Rectangle {
					color: "transparent"
					Layout.fillWidth: true
					AlgTextEdit {
						id: progressText
						anchors.centerIn: parent
						width: parent.width
						wrapMode: TextEdit.Wrap
						clip: true
						readOnly: true
					}
				}

				Rectangle {
					color: "transparent"
					Layout.fillWidth: true
					AlgProgressBar {
						id: progressBar
						anchors.centerIn: parent
						width: parent.width
						indeterminate: true
					}
				}
			}
		}
	}

	FileDialog {
		id: fileDialog
		title: qsTr("Please locate Photoshop...")
		nameFilters: [ "Executable file (*.exe *.app)", "All files (*)" ]
		selectedNameFilter.index : 0
		onAccepted: {
			alg.settings.setValue("photoshopPath", alg.fileIO.urlToLocalFile(fileDialog.selectedFile.toString()));
			internal.launchExportDialog()
		}
	}
}
