import QtQuick 2.2
import Painter 1.0

PainterPlugin {

	// plugin description, displayed in the plugin about dialog
	description: "This is a sample plugin"

	// project homepage url, displayed in the plugin about dialog.
	// Warning: the scheme is madatory to create a clickable link in the about dialog.
	projectUrl: "https://www.allegorithmic.com"
		
	Component.onCompleted: {
		// create toolbar buttons
		alg.ui.addToolBarWidget("exporter.qml");
		// create a dock widget
		//alg.ui.addDockWidget("exporter.qml");
	}
}
