// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

function ExportConfig() {
  this.padding = "Infinite"
  this.dilation = 0
  this.bitDepth = 8
  this.keepAlpha = true
}

ExportConfig.prototype = {
  clone: function() {
    var conf = new ExportConfig
    conf.padding = this.padding
    conf.dilation = this.dilation
    conf.bitDepth = this.bitDepth
    conf.keepAlpha = this.keepAlpha
    return conf
  },

  usePadding : function(val) {
    this.padding = (val === true) ? "Infinite" : "Transparent"
  }
}

function PhotoshopExporter(callback) {
  this.logUserInfo =
    function logUserInfo(str) {
      if (callback) {
        callback(str)
      }
      else {
        alg.log.info("<font color=#00FF00>"+str+"</font>")
      }
    }

  //Padding's struct
  this.exportConfig = new ExportConfig()
  this.exportConfig.usePadding(alg.settings.value("padding", false))

  //Get the project name
  var projectName = alg.project.name()

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

  this.logUserInfo("Export done");
  if (alg.settings.value("launchPhotoshop", false)) {
    this.logUserInfo("Starting Photoshop...");
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
    function documentNbStacks(document) {
      return document.materials
        .map(function(m) {return m.stacks.length})
        .reduce(function(a, b){ return a + b}, 0);
    }
    function elementNbLayers(element) {
      var nbLayers = 1;
      if (element.layers != undefined) {
        nbLayers = element.layers
          .map(elementNbLayers)
          .reduce(function(a, b){ return a + b}, 0);
      }
      return nbLayers + (element.hasMask? 1 : 0);
    }
    var self = this;
    function createProgressMethod(progressBar, total) {
      var progression = 1;
      return function() {
        if (progressBar === "layer") {
          var stackPath = [self.materialName, self.stackName, self.channel].filter(function(e) {return e}).join("/");
          self.logUserInfo("Exporting " + stackPath + " layers and masks: " + progression + "/" + total);
        }
        self.photoshopScript +=
          "progressBar." + progressBar + ".value = " + 100/total*(progression++) + ";\n";
      }
    }

    var doc_str = alg.mapexport.documentStructure();
    var stackProgress = createProgressMethod("stack", documentNbStacks(doc_str));

    //Browse material
    for (var materialId in doc_str.materials) {
      var material = doc_str.materials[materialId];
      this.materialName = material.name;
      //Browse stacks
      for (var stackId in material.stacks) {
        //Update the progress bar
        stackProgress();
        var stack = material.stacks[stackId];
        var totalLayers = elementNbLayers(stack);
        var progressChannel = createProgressMethod("channel", stack.channels.length);
        this.stackName = stack.name;
        //Browse channels
        for (var channelId in stack.channels) {
          //Update the progress bar
          progressChannel();
          this.channel = stack.channels[channelId];
          var channelFormat = alg.mapexport.channelFormat([this.materialName, this.stackName],this.channel)
          var bitDepth = alg.settings.value("bitDepth", -1)
          this.exportConfig.bitDepth = bitDepth == -1 ? channelFormat.bitDepth : bitDepth
          //PNG export of a channel snapshot into the path export
          var filename = this.createFilename(".png");
          var exportConfig = this.exportConfig.clone()
          exportConfig.keepAlpha = false
          alg.mapexport.save([this.materialName, this.stackName, this.channel], filename, exportConfig);

          //Create a new document into photoshop
          this.photoshopScript += this.newPSDDocumentStr(filename);
          //Browse layers roots forest
          var progressLayer = createProgressMethod("layer", totalLayers);
          for (var layerId = 0; layerId < stack.layers.length; ++layerId) {
            var layer = stack.layers[layerId];
            //Browse layer tree from root
            this.layersDFS(layer, progressLayer);
          }

          //Rasterize all layers

          // this.photoshopScript += "try{app.activeDocument.rasterizeAllLayers();}catch(err){} \n";

          //Update the progress bar
          this.photoshopScript += "progressBar.layer.value = 0; \n";
          //Gamma correction for sRGB channel
          if(this.channel == "basecolor" || this.channel == "diffuse" || this.channel == "specular" || this.channel == "emissive" || this.channel == "transmissive" ) {
            this.photoshopScript += " convert_to_profile(); \n";
          }
          // Add default background in normal channel
          if(this.channel === "normal") {
            this.photoshopScript += this.newFillLayerStr("Background", {R:128, G:128, B:255});
            this.photoshopScript += "app.activeDocument.activeLayer.move(app.activeDocument, ElementPlacement.PLACEATEND); \n";
          }
          //Move the snapshot to the document head
          this.photoshopScript += "snapshot.move(app.activeDocument, ElementPlacement.PLACEATBEGINNING); \n";
          this.photoshopScript += "app.activeDocument.activeLayer = snapshot; \n";
          //Hide the snapshot
          this.photoshopScript += "snapshot.visible = false; \n";
          
          //Delete empty folders
          this.photoshopScript += "deleteEmptyFolders(); \n";

          //Save the psd
          this.photoshopScript += " app.activeDocument.saveAs(File(\"" + this.createFilename() + "\")); \n";
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
  layersDFS: function(layer, progressLayer) {
    //The layer is a leaf
    if (layer.layers == undefined) {
      //PNG export of the leaf into the path export
      var filename = this.createFilename("_" + layer.uid + ".png");
      alg.mapexport.save([layer.uid, this.channel], filename, this.exportConfig);
      progressLayer();
      //Create the layer into photoshop
      this.photoshopScript += this.newLayerStr(filename, layer, this.channel);
      //Add his mask if exist
      if (layer.hasMask == true) {
        this.addMask(layer, progressLayer);
        this.photoshopScript += '\n\t};\n';
      }else{
        this.photoshopScript += '\n\t};\n';
      }
    }
    //The layer is a folder
    else {
      //Create the folder into photoshop
      this.photoshopScript += this.newFolderStr(layer, this.channel);
      //Add his mask if exist
      if (layer.hasMask == true) {
        this.addMask(layer, progressLayer);
      }
      //Browse layer tree from the current layer
      for (var layerId = 0; layerId < layer.layers.length; ++layerId) {
        this.layersDFS(layer.layers[layerId], progressLayer);
      }
      //Pull folder up
      this.photoshopScript += " app.activeDocument.activeLayer = folders.pop();\n";
      // Need to set folder visibility once all the layers inside have been added otherwise it will always be
      // overriden to true
      this.photoshopScript += " app.activeDocument.activeLayer.visible = " + (layer.enabled? "true" : "false") + ";";
    }
  },

  /*
   * Add the layer/folder mask if exist
   */
  addMask: function(layer, progressLayer) {
    //PNG export of the mask into the path export
    var filename = this.createFilename("_" + layer.uid + "_mask.png");
    alg.mapexport.save([layer.uid, "mask"], filename, this.exportConfig);
    progressLayer();
    //Create the mask into photoshop
    this.photoshopScript += this.newMaskStr(filename);
  },

  /**********Photoshop generation script**********/

  createFilename: function(concate) {
    concate = concate || ''
    return (this.exportPath + this.materialName + "_" +this.stackName + "_" + this.channel + concate).replace("__", "_");
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
   layerToMask();\n";
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
   var trsp = checkTransparency();\n\
   if(trsp.empty == true){//if the layer is empty just delete it \n\
   \tapp.activeDocument.activeLayer.remove();\n\
   \tvar emptyMaskFile = new File(layerFile.toString().replace('.png', '_mask.png'));\n\
   \tif(emptyMaskFile.exists){emptyMaskFile.remove()};\n\
   }else{\n\
   \tvar isFlat = isLayerFlatColor(trsp.partialTransparent);\n\
   \tif(isFlat.flat == true){\n\
   \t\tapp.activeDocument.activeLayer.remove();\n\
   \t\tmakeSolidColor(isFlat.color.red, isFlat.color.green, isFlat.color.blue);\n\
   \t}else{\n\
   \t\tapp.activeDocument.activeLayer.rasterize(RasterizeType.LINKEDLAYERS);\n\
   \t}\n\
   \tapp.activeDocument.activeLayer.opacity = " + blending.opacity + ";\n\
   \t" + this.convertBlendingMode(blending.mode, 0) + ";\n\
   \tapp.activeDocument.activeLayer.name = \"" + layer.name + "\";\n\
   \tapp.activeDocument.activeLayer.visible = " + (layer.enabled? "true" : "false") + ";\n";

  },

  /*
   * Return the string to create a new fill layer
   */
  newFillLayerStr: function(name, color) {
    return "\n\n //Add fill layer \n\
   var layer = folders[folders.length - 1].artLayers.add(); \n\
   app.activeDocument.activeLayer.name = \"" + name + "\"; \n\
   fillSolidColour(" + color.R + "," + color.G + "," + color.B + ");\n\
   ";
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

function importPainterDocument(callback) {
  new PhotoshopExporter(callback);
}
