import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.0

Rectangle {
	id: rect
	width: 120
	height: 30
	border.color: "white"
	antialiasing: true
	border.width: 1
	radius: 3
	color: mouseArea.containsMouse ? "black" : "#050243"  
	
	Loader {
    	source:"ExportPhotoshop.qml";
  	}

	Text {
		id: label
		anchors.centerIn: parent
		text: "Export to PSD"
		color: "white" 
		//font.pointSize: 8; font.bold: true
	}
	
	MouseArea { 
		id: mouseArea
		anchors.fill: parent
		onClicked: {
			var fileDesc = {
				materialName: "",
				channel: "",
				exportPath: "",
				outFile: "",

				createFilename : function(concate) {
					return this.exportPath + this.materialName + this.channel + concate;
				}
			}

			var filenameSplited = alg.fileIO.urlToLocalFile(alg.project.url()).split("/");
			var projectName = filenameSplited[filenameSplited.length-1].replace(".spp", "");
			
			fileDesc.exportPath = alg.mapexport.exportPath() + "/" + projectName + "/";
			fileDesc.outFile = alg.fileIO.open(fileDesc.exportPath + "jsx_SP.jsx", 'w');

			var headerScript = alg.fileIO.open(alg.plugin_root_directory + "/header.jsx", 'r');
			fileDesc.outFile.write(headerScript.readAll());
			headerScript.close();
			
			run(fileDesc);

			var footerScript = alg.fileIO.open(alg.plugin_root_directory + "/footer.jsx", 'r');
			fileDesc.outFile.write(footerScript.readAll());
			footerScript.close();

		 	fileDesc.outFile.close();
		}
	}

	function run(fileDesc) {
	 	var doc_str = alg.mapexport.documentStructure();
	 	//Browse material
	 	for (var materialId = 0; materialId < doc_str.materials.length; materialId++) {
	 		var material = doc_str.materials[materialId];
	 		fileDesc.materialName = material.name;
	 		//Browse stacks
	 		for (var stackId = 0; stackId < material.stacks.length; ++stackId) {
	 			var stack = material.stacks[stackId];
	 			//Browse channels
	 			for (var channelId = 0; channelId < stack.channels.length; ++channelId) {
		 			fileDesc.channel = stack.channels[channelId];
		 			//PNG export of a channel snapshot into the path export
		 			var filename = fileDesc.createFilename(".png");
		 			alg.mapexport.save([fileDesc.materialName, fileDesc.channel], filename);
		 			//Create a new document into photoshop
		 			fileDesc.outFile.write(newPSDDocumentStr(filename));
		 			//Browse layers roots forest
					for (var layerId = 0; layerId < stack.layers.length; ++layerId) {
			 			var layer = material.stacks[0].layers[layerId];
			 			//Browse layer tree from root
			 			layersDFS(layer, fileDesc);
				 	}
				}
	 		}
	 	}
	}

	function layersDFS(layer, fileDesc) {
		//The layer is a leaf
	 	if (layer.layers == undefined) {
	 		//PNG export of the leaf into the path export
	 		var filename = fileDesc.createFilename(layer.uid + ".png");
			alg.mapexport.save([layer.uid, fileDesc.channel], filename);
			//Create the layer into photoshop
			fileDesc.outFile.write(newLayerStr(filename, layer.name));
			//Add his mask if exist
			if (layer.hasMask == true) {
				addMask(layer, fileDesc);
			}
	 	}
	 	//The layer is a folder
	 	else {
	 		//Create the folder into photoshop
			fileDesc.outFile.write(newFolderStr(layer.name));
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

	function addMask(layer, fileDesc) {
		//PNG export of the mask into the path export
		var filename = fileDesc.createFilename(layer.uid + "_mask.png");
	 	alg.mapexport.save([layer.uid, "mask"], filename);
	 	//Create the mask into photoshop
	 	fileDesc.outFile.write(newMaskStr(filename));
	}

	function newPSDDocumentStr(filename) {
		return "\n\n//New Document \n\
	var exportFile = File(\"" + filename + "\"); \n\
	open(exportFile); \n\
	exportFile.remove();
	var folders = []; \n\
	folders.push(app.activeDocument);";
	}

	function newMaskStr(filename) {
		return "	//Add mask \n\
	var maskFile = File(\"" + filename + "\"); \n\
	open_png(maskFile); \n\
	maskFile.remove(); \n\
	layerToMask();";
	}

	function newFolderStr(name) {
		return "\n\n	//Add folder \n\
	folders.push(folders[folders.length - 1].layerSets.add()); \n\
	app.activeDocument.activeLayer.name = \"" + name + "\"; ";
	}

	function newLayerStr(filename, name) {
		return "\n\n	//Add layer \n\
	folders[folders.length - 1].artLayers.add(); \n\
	var layerFile = File(\"" + filename + "\"); \n\
	open_png(layerFile); \n\
	layerFile.remove(); \n\
	app.activeDocument.activeLayer.name = \"" + name + "\";";
	}
}
