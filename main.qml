// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

import QtQuick 2.2
import Painter 1.0

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
		// create the button
		alg.ui.addWidgetToPluginToolBar("exporter.qml");
  }

  onConfigure: {
    // open the configuration panel
    configurePanel.open()
  }

  ConfigurePanel {
    id: configurePanel
  }
}
