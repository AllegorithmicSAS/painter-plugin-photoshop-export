// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

function PhotoshopExporter() {
  //Padding's struct
  this.mapInfo = {}
  if (!alg.settings.value("padding", false)) {
    this.mapInfo = {padding: "Transparent", dilation: 0};
  }
  this.mapInfo.bitDepth = alg.settings.value("bitDepth", 8);

  //Get the project name
  var projectName = alg.project.url().split('/');
  projectName = projectName[projectName.length - 1].replace(".spp", "");

  //The export path is the working directory
  this.exportPath = alg.mapexport.exportPath() + "/" + projectName + "_photoshop_export/";

  //Add the header photoshop script
  var headerScript = alg.fileIO.open(alg.plugin_root_directory + "/header.jsx", 'r');
  this.photoshopScript = headerScript.readAll();
  headerScript.close();

  //Run the script
  this.run(this);
 
  //Add the footer photoshop script
  var footerScript = alg.fileIO.open(alg.plugin_root_directory + "/footer.jsx", 'r');
  this.photoshopScript += footerScript.readAll();
  footerScript.close();
 
  try{
    var scriptFile = alg.fileIO.open(this.exportPath + "/photoshopScript.jsx", 'w');
    scriptFile.write(this.photoshopScript);
    scriptFile.close();
  } catch (error) {
    alg.log.error(error.message);
    return;
  }

  alg.log.info("Done.");
  if (alg.settings.value("launchPhotoshop", false)) {
    if (Qt.platform.os == "windows") {
      alg.subprocess.startDetached(["\"" + alg.settings.value("photoshopPath", "") + "\"", "\"" + this.exportPath.split('/').join('\\') + "photoshopScript.jsx\""]);
    } else if (Qt.platform.os == "osx") {
      alg.subprocess.startDetached(["open", "-a", alg.settings.value("photoshopPath", "").split(' ').join('\ '), this.exportPath.split(' ').join('\ ') + "photoshopScript.jsx"]);
    }
  }
}

PhotoshopExporter.prototype = {

  /*
  * Main function of the script
  * Browsing of all layers into the document structure
  */
  run: function() {
    var doc_str = alg.mapexport.documentStructure();
    //Browse material
    for (var materialId = 0; materialId < doc_str.materials.length; materialId++) {
      var material = doc_str.materials[materialId];
      this.materialName = material.name;
      //Update the progress bar
      this.photoshopScript += "progressBar.material.value = " + 100/doc_str.materials.length*(materialId+1) + ";\n";
      //Browse stacks
      for (var stackId = 0; stackId < material.stacks.length; ++stackId) {
        var stack = material.stacks[stackId];
        this.stackName = stack.name;
        //Browse channels
        for (var channelId = 0; channelId < stack.channels.length; ++channelId) {
          this.channel = stack.channels[channelId];
          //Update the progress bar
          this.photoshopScript += "progressBar.channel.value = " + 100/stack.channels.length*(channelId+1) + ";\n";
          //PNG export of a channel snapshot into the path export
          var filename = this.createFilename(".png");
          alg.mapexport.save([this.materialName, this.stackName, this.channel], filename, this.mapInfo);
          //Create a new document into photoshop
          this.photoshopScript += this.newPSDDocumentStr(filename);
          //Browse layers roots forest
          for (var layerId = 0; layerId < stack.layers.length; ++layerId) {
            var layer = stack.layers[layerId];
            //Update the progress bar
            this.photoshopScript += "progressBar.layer.value = " + 100/stack.layers.length*(layerId+1) + ";\n";
            //Browse layer tree from root
            this.layersDFS(layer, this);
          }
          //Rasterize all layers
          this.photoshopScript += "app.activeDocument.rasterizeAllLayers(); \n";
          //Update the progress bar
          this.photoshopScript += "progressBar.layer.value = 0; \n";
          //Gamma correction for sRGB channel
          if(this.channel == "basecolor" || this.channel == "diffuse" || this.channel == "specular" || this.channel == "emissive" || this.channel == "transmissive" ) {
            this.photoshopScript += " convert_to_profile(); \n";
          }
          //Move the snapshot to the document head
          this.photoshopScript += "snapshot.move(app.activeDocument.activeLayer, ElementPlacement.PLACEBEFORE); \n";
          //Hide the snapshot
          this.photoshopScript += "snapshot.visible = false; \n";
        }
        //Update the progress bar
        this.photoshopScript += "progressBar.channel.value = 0; \n";
      }
    }
  },

  /*
   * Recursive function to explore a hierarchy of layers
   * Leaf has exported as photoshop layer
   * Folder has exported as photoshop groupe
   */
  layersDFS: function(layer) {
    //The layer is a leaf
    if (layer.layers == undefined) {
      //PNG export of the leaf into the path export
      var filename = this.createFilename(layer.uid + ".png");
      alg.mapexport.save([layer.uid, this.channel], filename, this.mapInfo);
      //Create the layer into photoshop
      this.photoshopScript += this.newLayerStr(filename, layer, this.channel);
      //Add his mask if exist
      if (layer.hasMask == true) {
        this.addMask(layer, this);
      }
    }
    //The layer is a folder
    else {
      //Create the folder into photoshop
      this.photoshopScript += this.newFolderStr(layer, this.channel);
      //Add his mask if exist
      if (layer.hasMask == true) {
        this.addMask(layer, this);
      }
      //Browse layer tree from the current layer
      for (var layerId = 0; layerId < layer.layers.length; ++layerId) {
        this.layersDFS(layer.layers[layerId], this);
      }
      //Pull folder up
      this.photoshopScript += " app.activeDocument.activeLayer = folders.pop();\n";
    }
  },

  /*
   * Add the layer/folder mask if exist
   */
  addMask: function(layer) {
    //PNG export of the mask into the path export
    var filename = this.createFilename(layer.uid + "_mask.png");
    alg.mapexport.save([layer.uid, "mask"], filename, this.mapInfo);
    //Create the mask into photoshop
    this.photoshopScript += this.newMaskStr(filename);
  },

  /**********Photoshop generation script**********/

  createFilename: function(concate) {
    return this.exportPath + this.materialName + "_" +this.stackName + "_" + this.channel + "_" + concate;
  },

  /*
   * Return the string to open a new photoshop document
   */
  newPSDDocumentStr: function(filename) {
    return "\n\n//New Document \n\
   var exportFile = File(\"" + filename + "\"); \n\
   open(exportFile); \n\
   exportFile.remove();
   var folders = []; \n\
   folders.push(app.activeDocument); \n\
   var snapshot = app.activeDocument.activeLayer; \n\
   snapshot.name = \"snapshot\"; ";
  },

  /*
   * Return the string to assign a mask to a photoshop layer
   */
  newMaskStr: function(filename) {
    return " //Add mask \n\
   var maskFile = File(\"" + filename + "\"); \n\
   open_png(maskFile); \n\
   maskFile.remove(); \n\
   layerToMask();";
  },

  /*
   * Return the string to create a new photoshop folder
   */
  newFolderStr: function(folder, channel) {
    var blending = alg.mapexport.layerBlendingModes(folder.uid)[channel];
    return "\n\n //Add folder \n\
   folders.push(folders[folders.length - 1].layerSets.add()); \n\
   app.activeDocument.activeLayer.opacity = " + blending.opacity + ";\n\
   " + this.convertBlendingMode(blending.mode, 1) + "; \n\
   app.activeDocument.activeLayer.name = \"" + folder.name + "\"; ";
  },

  /*
   * Return the string to create a new photoshop layer
   */
  newLayerStr: function(filename, layer, channel) {
    var blending = alg.mapexport.layerBlendingModes(layer.uid)[channel];
    return "\n\n //Add layer \n\
   folders[folders.length - 1].artLayers.add(); \n\
   var layerFile = File(\"" + filename + "\"); \n\
   open_png(layerFile); \n\
   layerFile.remove(); \n\
   app.activeDocument.activeLayer.opacity = " + blending.opacity + ";\n\
   " + this.convertBlendingMode(blending.mode, 0) + ";\n\
   app.activeDocument.activeLayer.name = \"" + layer.name + "\"; ";
  },

  /*
   * Return the string to assign a blending mode to the current photoshop layer/folder
   * Folder in Passthrough mode have to be assign to PASSTHROUGH but layer
   */
  convertBlendingMode: function(painterMode, isFolder) {
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

function importPainterDocument() {
  new PhotoshopExporter();
}
