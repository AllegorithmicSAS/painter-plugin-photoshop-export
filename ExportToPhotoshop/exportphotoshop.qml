import QtQuick 2.3
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Dialogs 1.0

ExportPhotoshop {
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

	function addMask(exportPath, layer, channelName, materialName, exportedScript) {
		var filename = exportPath + layer.uid + "_mask_" + channelName + "_" + materialName + ".png";
	 	alg.mapexport.save([layer.uid, "mask"], filename);
	 	exportedScript.write(newMaskStr(filename));
	}

	function layersDFS(layer, materialName, channelName, exportPath, exportedScript) {
	 	if (layer.layers == undefined) {
	 		var filename = exportPath + layer.uid + "_" + channelName + "_" + materialName + ".png";
			alg.mapexport.save([layer.uid, channelName], filename);
			exportedScript.write(newLayerStr(filename, layer.name));
			if (layer.hasMask == true) {
				addMask(exportPath, layer, channelName, materialName, exportedScript);
			}
	 		return;
	 	}
	 	exportedScript.write(newFolderStr(layer.name));
	 	if (layer.hasMask == true) {
			addMask(exportPath, layer, channelName, materialName, exportedScript);
		}
	 	for (var layerId = 0; layerId < layer.layers.length; ++layerId) {
 			var layerChild = layer.layers[layerId];
 			layersDFS(layerChild, materialName, channelName, exportPath, exportedScript);
 		}
 		exportedScript.write("	folders.pop();\n");
	}

	run : function() {
		var test = {
			exportPath:"test",

			addMask : function(exportPath, layer, channelName, materialName, exportedScript) {
				var filename = exportPath + layer.uid + "_mask_" + channelName + "_" + materialName + ".png";
			 	alg.mapexport.save([layer.uid, "mask"], filename);
			 	exportedScript.write(newMaskStr(filename));
			}
		}
		var filenameSplited = alg.fileIO.urlToLocalFile(alg.project.url()).split("/");
		var projectName = filenameSplited[filenameSplited.length-1].replace(".spp", "");
		var exportPath = alg.mapexport.exportPath() + "/" + projectName + "/";

		var exportedScript = alg.fileIO.open(exportPath + "jsx_SP.jsx", 'w');
		var headerScript = alg.fileIO.open(alg.plugin_root_directory + "/header.jsx", 'r');
		exportedScript.write(headerScript.readAll());
		headerScript.close();

	 	var doc_str = alg.mapexport.documentStructure();
	 	//Browse material
	 	for (var materialId = 0; materialId < doc_str.materials.length; materialId++) {
	 		var material = doc_str.materials[materialId];
	 		//Browse stacks
	 		for (var stackId = 0; stackId < material.stacks.length; ++stackId) {
	 			var stack = material.stacks[stackId];
	 			//Browse channels
	 			for (var channelId = 0; channelId < stack.channels.length; ++channelId) {
		 			var channel = stack.channels[channelId];
		 			var filename = exportPath + material.name + "_" + channel + ".png";
		 			alg.mapexport.save([material.name, channel], filename);
		 			exportedScript.write(newPSDDocumentStr(filename));
		 			//Browse layers roots forest
					for (var layerId = 0; layerId < stack.layers.length; ++layerId) {
			 			var layer = material.stacks[0].layers[layerId];
			 			//Browse layer tree
			 			layersDFS(layer, material.name, channel, exportPath, exportedScript);
				 	}
				}
	 		}
	 	}

	 	var footerScript = alg.fileIO.open(alg.plugin_root_directory + "/footer.jsx", 'r');
		exportedScript.write(footerScript.readAll());
		footerScript.close();
	 	exportedScript.close();
	}
}