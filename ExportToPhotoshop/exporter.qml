//////////////////////////////////////////////////////////////////////////////////
//  ExportToPhotoshop   Version: 1.0.0
//  Script File       main.qml, exporter.qml, header.jsx, footer.jsx
//  Platforms:        windows, mac, linux
//
//  works on:
//            Substance Painter 2.3 and upper   
//            Photoshop  CS6   CC2014   CC2015
//
//   Release Date:  13th September, 2016
//
//  Description:
//	- export all layers stacks to photoshop
//  - every material and channel are export one PSD file
//     
//	Install:
//  Copy ExportToPhotoshop folder into the plugin folder
//   
//////////////////////////////////////////////////////////////////////////////////

import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.0

AlgButton {
    id: rect
    isDefaultButton:true
    antialiasing: true
    text: "Export to Photoshop"

	FileDialog {
		id: fileDialog
		title: "Choose a Photoshop executable file..."
		nameFilters: [ "Photoshop files (*.exe *.app)", "All files (*)" ]
		selectedNameFilter: "Executable files (*)"
		onAccepted: {
			alg.settings.setValue("photoshopPath", alg.fileIO.urlToLocalFile(fileUrls[0]));
			exportToPhotoshop();
		}
	}
	
	MouseArea { 
		id: mouseArea
		anchors.fill: parent
		onClicked: {
			if (!alg.settings.contains("photoshopPath") && alg.settings.value("launchPhotoshop", false)) {
				fileDialog.open();
			} else {
				exportToPhotoshop();
			}
		}
	}

	function exportToPhotoshop() {
		//Struct to store export strings
		var fileDesc = {
			materialName: "",
			stackName: "",
			channel: "",
			padding: {},
			exportPath: "",
			outFile: "",

			createFilename : function(concate) {
				return this.exportPath + this.materialName + "_" +this.stackName + "_" + this.channel + "_" + concate;
			}
		}

		//Padding's struct
		if (!alg.settings.value("padding", false)) {
			fileDesc.padding = {padding: "Transparent", dilation: 0};
		}

		//The export path is the working directory
		fileDesc.exportPath = alg.mapexport.exportPath() + "/";
		try {
			fileDesc.outFile = alg.fileIO.open(fileDesc.exportPath + "jsx_SP.jsx", 'w');
		} catch (error) {
			alg.log.error(error.message);
			return;
		}

		//Add the header photoshop script
		var headerScript = alg.fileIO.open(alg.plugin_root_directory + "/header.jsx", 'r');
		fileDesc.outFile.write(headerScript.readAll());
		headerScript.close();
		
		//Run the script
		run(fileDesc);

		//Add the footer photoshop script
		var footerScript = alg.fileIO.open(alg.plugin_root_directory + "/footer.jsx", 'r');
		fileDesc.outFile.write(footerScript.readAll());
		footerScript.close();

	 	fileDesc.outFile.close();

	 	alg.log.info("Done.");
	 	if (Qt.platform.os == "windows") {
	 		alg.subprocess.startDetached(["\"" + alg.settings.value("photoshopPath", "") + "\"", "\"" + fileDesc.exportPath.split('/').join('\\') + "jsx_SP.jsx\""]);
	 	} else if (Qt.platform.os == "osx") {
			alg.subprocess.startDetached(["open", "-a", alg.settings.value("photoshopPath", "").split(' ').join('\ '), fileDesc.exportPath.split(' ').join('\ ') + "jsx_SP.jsx"]);
	 	}
	}

	/* 
	 * Main function of the script
	 * Browsing of all layers into the document structure
	*/
	function run(fileDesc) {
	 	var doc_str = alg.mapexport.documentStructure();
	 	//Browse material
	 	for (var materialId = 0; materialId < doc_str.materials.length; materialId++) {
	 		var material = doc_str.materials[materialId];
	 		fileDesc.materialName = material.name;
	 		//Update the progress bar
	 		fileDesc.outFile.write("progressBar.material.value = " + 100/doc_str.materials.length*(materialId+1) + ";\n");
	 		//Browse stacks
	 		for (var stackId = 0; stackId < material.stacks.length; ++stackId) {
	 			var stack = material.stacks[stackId];
	 			fileDesc.stackName = stack.name;
	 			//Browse channels
	 			for (var channelId = 0; channelId < stack.channels.length; ++channelId) {
		 			fileDesc.channel = stack.channels[channelId];
		 			//Update the progress bar
		 			fileDesc.outFile.write("progressBar.channel.value = " + 100/stack.channels.length*(channelId+1) + ";\n");
		 			//PNG export of a channel snapshot into the path export
		 			var filename = fileDesc.createFilename(".png");
		 			alg.mapexport.save([fileDesc.materialName, fileDesc.stackName, fileDesc.channel], filename, fileDesc.padding);
		 			//Create a new document into photoshop
		 			fileDesc.outFile.write(newPSDDocumentStr(filename));
		 			//Browse layers roots forest
					for (var layerId = 0; layerId < stack.layers.length; ++layerId) {
			 			var layer = stack.layers[layerId];
			 			//Update the progress bar
		 				fileDesc.outFile.write("progressBar.layer.value = " + 100/stack.layers.length*(layerId+1) + ";\n");
			 			//Browse layer tree from root
			 			layersDFS(layer, fileDesc);
				 	}
				 	//Update the progress bar
		 			fileDesc.outFile.write("progressBar.layer.value = 0;\n");
				 	//Gamma correction for sRGB channel
				 	if(fileDesc.channel == "basecolor" || fileDesc.channel == "diffuse" || fileDesc.channel == "specular" || fileDesc.channel == "emissive" || fileDesc.channel == "transmissive" ) {
						fileDesc.outFile.write("	convert_to_profile(); \n");
					}
				}
				//Update the progress bar
		 		fileDesc.outFile.write("progressBar.channel.value = 0;\n");
	 		}
	 	}
	}

	/* 
	 * Recursive function to explore a hierarchy of layers
	 * Leaf has exported as photoshop layer
	 * Folder has exported as photoshop groupe
	*/
	function layersDFS(layer, fileDesc) {
		//The layer is a leaf
	 	if (layer.layers == undefined) {
	 		//PNG export of the leaf into the path export
	 		var filename = fileDesc.createFilename(layer.uid + ".png");
			alg.mapexport.save([layer.uid, fileDesc.channel], filename, fileDesc.padding);
			//Create the layer into photoshop
			fileDesc.outFile.write(newLayerStr(filename, layer, fileDesc.channel));
			//Add his mask if exist
			if (layer.hasMask == true) {
				addMask(layer, fileDesc);
			}
	 	}
	 	//The layer is a folder
	 	else {
	 		//Create the folder into photoshop
			fileDesc.outFile.write(newFolderStr(layer, fileDesc.channel));
			//Add his mask if exist
		 	if (layer.hasMask == true) {
				addMask(layer, fileDesc);
			}
			//Browse layer tree from the current layer
		 	for (var layerId = 0; layerId < layer.layers.length; ++layerId) {
	 			layersDFS(layer.layers[layerId], fileDesc);
	 		}
	 		//Pull folder up
	 		fileDesc.outFile.write("	folders.pop();\n");
	 	}
	}

	/* 
	 * Add the layer/folder mask if exist
	*/
	function addMask(layer, fileDesc) {
		//PNG export of the mask into the path export
		var filename = fileDesc.createFilename(layer.uid + "_mask.png");
	 	alg.mapexport.save([layer.uid, "mask"], filename, fileDesc.padding);
	 	//Create the mask into photoshop
	 	fileDesc.outFile.write(newMaskStr(filename));
	}

/**********Photoshop generation script**********/

	/* 
	 * Return the string to open a new photoshop document
	*/
	function newPSDDocumentStr(filename) {
		return "\n\n//New Document \n\
	var exportFile = File(\"" + filename + "\"); \n\
	open(exportFile); \n\
	exportFile.remove();
	var folders = []; \n\
	folders.push(app.activeDocument);";
	}

	/* 
	 * Return the string to assign a mask to a photoshop layer
	*/
	function newMaskStr(filename) {
		return "	//Add mask \n\
	var maskFile = File(\"" + filename + "\"); \n\
	open_png(maskFile); \n\
	maskFile.remove(); \n\
	layerToMask();";
	}

	/* 
	 * Return the string to create a new photoshop folder
	*/
	function newFolderStr(folder, channel) {
		var blending = alg.mapexport.layerBlendingModes(folder.uid)[channel];
		return "\n\n	//Add folder \n\
	folders.push(folders[folders.length - 1].layerSets.add()); \n\
	app.activeDocument.activeLayer.opacity = " + blending.opacity + ";\n\
	" + convertBlendingMode(blending.mode, 1) + "; \n\
	app.activeDocument.activeLayer.name = \"" + folder.name + "\"; ";
	}

	/* 
	 * Return the string to create a new photoshop layer
	*/
	function newLayerStr(filename, layer, channel) {
		var blending = alg.mapexport.layerBlendingModes(layer.uid)[channel];
		return "\n\n	//Add layer \n\
	folders[folders.length - 1].artLayers.add(); \n\
	var layerFile = File(\"" + filename + "\"); \n\
	open_png(layerFile); \n\
	layerFile.remove(); \n\
	app.activeDocument.activeLayer.opacity = " + blending.opacity + ";\n\
	" + convertBlendingMode(blending.mode, 0) + ";\n\
	app.activeDocument.activeLayer.name = \"" + layer.name + "\";";
	}

	/* 
	 * Return the string to assign a blending mode to the current photoshop layer/folder
	 * Folder in Passthrough mode have to be assign to PASSTHROUGH but layer
	*/
	function convertBlendingMode(painterMode, isFolder) {
		var blendingMode = "app.activeDocument.activeLayer.blendMode = BlendMode.";
		if (painterMode == "Passthrough") {
			if (isFolder == 1) {
				blendingMode = blendingMode + "PASSTHROUGH";
			} else {
				blendingMode = blendingMode + "NORMAL";
			}
			return blendingMode;
		}
		switch(painterMode) {
			case "Normal":
			case "Replace":                      blendingMode = blendingMode + "NORMAL";
				break;
			case "Multiply":                     blendingMode = blendingMode + "MULTIPLY"; break;
			case "Divide":                       blendingMode = blendingMode + "DIVIDE"; break;
			case "Linear dodge (Add)":           blendingMode = blendingMode + "LINEARDODGE"; break;
			case "Subtract":                     blendingMode = blendingMode + "SUBTRACT"; break;
			case "Difference":                   blendingMode = blendingMode + "DIFFERENCE"; break;
			case "Exclusion":                    blendingMode = blendingMode + "EXCLUSION"; break;
			case "Overlay":                      blendingMode = blendingMode + "OVERLAY"; break;
			case "Screen":                       blendingMode = blendingMode + "SCREEN"; break;
			case "Linear burn":                  blendingMode = blendingMode + "LINEARBURN"; break;
			case "Color burn":                   blendingMode = blendingMode + "COLORBURN"; break;
			case "Color dodge":                  blendingMode = blendingMode + "COLORDODGE"; break;
			case "Soft light":                   blendingMode = blendingMode + "SOFTLIGHT"; break;
			case "Hard light":                   blendingMode = blendingMode + "HARDLIGHT"; break;
			case "Vivid light":                  blendingMode = blendingMode + "VIVIDLIGHT"; break;
			case "Pin light":                    blendingMode = blendingMode + "PINLIGHT"; break;
			case "Saturation":                   blendingMode = blendingMode + "SATURATION"; break;
			case "Color":                        blendingMode = blendingMode + "COLORBLEND"; break;
			case "Normal map combine":           blendingMode = "Overlay_Normal()"; break;
			case "Normal map detail":            blendingMode = "Overlay_Normal()"; break;
			case "Normal map inverse detail":    blendingMode = "Overlay_Normal()"; break;
			case "Disable":
			case "Inverse divide":
			case "Darken (Min)":
			case "Lighten (Max)":
			case "Inverse Subtract":
			case "Signed addition (AddSub)":
			case "Tint":
			case "Value":
			default:
				blendingMode = ""
		}
		return blendingMode;
	}
}
