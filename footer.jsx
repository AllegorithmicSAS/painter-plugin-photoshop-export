

// Copyright (C) 2016 Allegorithmic
//
// This software may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.

progressBar.close();

/*=============HELPER=============*/

// Rasterize all layers.
function rasterize_All()
{
	try {
		executeAction(stringIDToTypeID('rasterizeAll'), undefined, DialogModes.NO);
	}
	catch (ignored) {}
}
function del_bg()
{
	try {
		var idslct = charIDToTypeID('slct');
		var descB = new ActionDescriptor();
		var idnull = charIDToTypeID('null');
		var refB = new ActionReference();
		var idLyr = charIDToTypeID('Lyr ');
		refB.putName(idLyr, 'Background');
		descB.putReference(idnull, refB);
		var idMkVs = charIDToTypeID('MkVs');
		descB.putBoolean(idMkVs, false);
		executeAction(idslct, descB, DialogModes.NO);
		app.activeDocument.activeLayer.remove();
	}
	catch (ignored) {}
	try {
		var idslct = charIDToTypeID('slct');
		var descB = new ActionDescriptor();
		var idnull = charIDToTypeID('null');
		var refB = new ActionReference();
		var idLyr = charIDToTypeID('Lyr ');
		refB.putName(idLyr, 'Layer 0');
		descB.putReference(idnull, refB);
		var idMkVs = charIDToTypeID('MkVs');
		descB.putBoolean(idMkVs, false);
		executeAction(idslct, descB, DialogModes.NO);
		app.activeDocument.activeLayer.remove();
	}
	catch (ignored) {}
}
function new_layer()
{
	var idMk = charIDToTypeID('Mk  ');
	var desc = new ActionDescriptor();
	var idnull = charIDToTypeID('null');
	var ref = new ActionReference();
	var idLyr = charIDToTypeID('Lyr ');
	ref.putClass(idLyr);
	desc.putReference(idnull, ref);
	executeAction(idMk, desc, DialogModes.NO);
}
function fillSolidColour(R, G, B)
{
  var id117 = charIDToTypeID( "Mk  " );
  var desc25 = new ActionDescriptor();
  var id118 = charIDToTypeID( "null" );
  var ref13 = new ActionReference();
  var id119 = stringIDToTypeID( "contentLayer" );
  ref13.putClass( id119 );
  desc25.putReference( id118, ref13 );
  var id120 = charIDToTypeID( "Usng" );
  var desc26 = new ActionDescriptor();
  var id121 = charIDToTypeID( "Type" );
  var desc27 = new ActionDescriptor();
  var id122 = charIDToTypeID( "Clr " );
  var desc28 = new ActionDescriptor();
  var id123 = charIDToTypeID( "Rd  " );
  desc28.putDouble( id123, R ); //red
  var id124 = charIDToTypeID( "Grn " );
  desc28.putDouble( id124, G ); //green
  var id125 = charIDToTypeID( "Bl  " );
  desc28.putDouble( id125, B ); //blue
  var id126 = charIDToTypeID( "RGBC" );
  desc27.putObject( id122, id126, desc28 );
  var id127 = stringIDToTypeID( "solidColorLayer" );
  desc26.putObject( id121, id127, desc27 );
  var id128 = stringIDToTypeID( "contentLayer" );
  desc25.putObject( id120, id128, desc26 );
  executeAction( id117, desc25, DialogModes.NO );
}
function send_backward()
{
	var id_mov = charIDToTypeID('move');
	var desc_ll = new ActionDescriptor();
	var id_null = charIDToTypeID('null');
	var ref_ll = new ActionReference();
	var id_Lyr = charIDToTypeID('Lyr ');
	var id_Ord = charIDToTypeID('Ordn');
	var id_Trg = charIDToTypeID('Trgt');
	ref_ll.putEnumerated(id_Lyr, id_Ord, id_Trg);
	desc_ll.putReference(id_null, ref_ll);
	var id_T = charIDToTypeID('T   ');
	var ref_d = new ActionReference();
	var id_LL = charIDToTypeID('Lyr ');
	var id_OO = charIDToTypeID('Ordn');
	var id_Prv = charIDToTypeID('Prvs');
	ref_d.putEnumerated(id_LL, id_OO, id_Prv);
	desc_ll.putReference(id_T, ref_d);
	executeAction(id_mov, desc_ll, DialogModes.NO);
}
function center_layer()
{
	var doc = activeDocument;
	var layer = doc.activeLayer;
	var bounds = layer.bounds;
	var res = doc.resolution;
	doc.resizeImage(undefined, undefined, 72, ResampleMethod.NONE);
	var docWidth = Number(doc.width);
	var docHeight = Number(doc.height);
	var layerWidth = Number(bounds[2] - bounds[0]);
	var layerHeight = Number(bounds[3] - bounds[1]);
	var dX = (docWidth - layerWidth) / 2 - Number(bounds[0]);
	var dY = (docHeight - layerHeight) / 2 - Number(bounds[1]);
	try
	{
		if (docWidth == layerWidth &  docHeight == layerHeight)
		{
			layer.translate(dX, dY);
		}
	}
	catch (e) {}
}
function open_png(path_f)
{
	var idPlc = charIDToTypeID('Plc ');
	var desc_sObj = new ActionDescriptor();
	var idnull = charIDToTypeID('null');
	desc_sObj.putPath(idnull, path_f);
	var idFTcs = charIDToTypeID('FTcs');
	var idQCSt = charIDToTypeID('QCSt');
	var idQcsa = charIDToTypeID('Qcsa');
	desc_sObj.putEnumerated(idFTcs, idQCSt, idQcsa);
	var idOfst = charIDToTypeID('Ofst');
	var desc_sObj_2 = new ActionDescriptor();
	var idHrzn = charIDToTypeID('Hrzn');
	var idPxlH = charIDToTypeID('#Pxl');
	desc_sObj_2.putUnitDouble(idHrzn, idPxlH, 0.000000);
	var idVrtc = charIDToTypeID('Vrtc');
	var idPxlV = charIDToTypeID('#Pxl');
	desc_sObj_2.putUnitDouble(idVrtc, idPxlV, 0.000000);
	var idOfst2 = charIDToTypeID('Ofst');
	desc_sObj.putObject(idOfst, idOfst2, desc_sObj_2);
	try
	{
		executeAction(idPlc, desc_sObj, DialogModes.NONE);
		return true;
	}
	catch (e)
	{
		return false;
	}
}
function layerToMask()
{
	var idsetd = charIDToTypeID('setd');
	var desc_Mask = new ActionDescriptor();
	var idnull = charIDToTypeID('null');
	var ref_Mask = new ActionReference();
	var idChnl = charIDToTypeID('Chnl');
	var idfsel = charIDToTypeID('fsel');
	ref_Mask.putProperty(idChnl, idfsel);
	desc_Mask.putReference(idnull, ref_Mask);
	var idT = charIDToTypeID('T   ');
	var idOrdn = charIDToTypeID('Ordn');
	var idAl = charIDToTypeID('Al  ');
	desc_Mask.putEnumerated(idT, idOrdn, idAl);
	executeAction(idsetd, desc_Mask, DialogModes.NO);
	var idcopy = charIDToTypeID('copy');
	executeAction(idcopy, undefined, DialogModes.NO);
	app.activeDocument.activeLayer.remove();
	var idMk = charIDToTypeID('Mk  ');
	var desc_select_all = new ActionDescriptor();
	var idNw = charIDToTypeID('Nw  ');
	var idChnl = charIDToTypeID('Chnl');
	desc_select_all.putClass(idNw, idChnl);
	var idAt = charIDToTypeID('At  ');
	var ref_select_all = new ActionReference();
	var idChnl = charIDToTypeID('Chnl');
	var idChnl = charIDToTypeID('Chnl');
	var idMsk = charIDToTypeID('Msk ');
	ref_select_all.putEnumerated(idChnl, idChnl, idMsk);
	desc_select_all.putReference(idAt, ref_select_all);
	var idUsng = charIDToTypeID('Usng');
	var idUsrM = charIDToTypeID('UsrM');
	var idRvlS = charIDToTypeID('RvlS');
	desc_select_all.putEnumerated(idUsng, idUsrM, idRvlS);
	executeAction(idMk, desc_select_all, DialogModes.NO);
	var idslct = charIDToTypeID('slct');
	var desc_aa = new ActionDescriptor();
	var idnull = charIDToTypeID('null');
	var ref_aa = new ActionReference();
	var idChnl = charIDToTypeID('Chnl');
	var idOrdn = charIDToTypeID('Ordn');
	var idTrgt = charIDToTypeID('Trgt');
	ref_aa.putEnumerated(idChnl, idOrdn, idTrgt);
	desc_aa.putReference(idnull, ref_aa);
	var idMkVs = charIDToTypeID('MkVs');
	desc_aa.putBoolean(idMkVs, true);
	executeAction(idslct, desc_aa, DialogModes.NO);
	var idpast = charIDToTypeID('past');
	var desc_past = new ActionDescriptor();
	var idAntA = charIDToTypeID('AntA');
	var idAnnt = charIDToTypeID('Annt');
	var idAnno = charIDToTypeID('Anno');
	desc_past.putEnumerated(idAntA, idAnnt, idAnno);
	executeAction(idpast, desc_past, DialogModes.NO);
	var idsetd = charIDToTypeID('setd');
	var desc_deselect = new ActionDescriptor();
	var idnull = charIDToTypeID('null');
	var ref_deselect = new ActionReference();
	var idChnl = charIDToTypeID('Chnl');
	var idfsel = charIDToTypeID('fsel');
	ref_deselect.putProperty(idChnl, idfsel);
	desc_deselect.putReference(idnull, ref_deselect);
	var idT = charIDToTypeID('T   ');
	var idOrdn = charIDToTypeID('Ordn');
	var idNone = charIDToTypeID('None');
	desc_deselect.putEnumerated(idT, idOrdn, idNone);
	executeAction(idsetd, desc_deselect, DialogModes.NO);
}
function Overlay_Normal(enabled, withDialog)
{
	try {
		if (enabled != undefined && !enabled)
			return;
		var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
		var desc_on_1 = new ActionDescriptor();
		var ref_on = new ActionReference();
		ref_on.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
		desc_on_1.putReference(charIDToTypeID('null'), ref_on);
		var desc_on_2 = new ActionDescriptor();
		desc_on_2.putEnumerated(charIDToTypeID('Md  '), charIDToTypeID('BlnM'), stringIDToTypeID('linearLight'));
		desc_on_2.putUnitDouble(stringIDToTypeID('fillOpacity'), charIDToTypeID('#Prc'), 50);
		desc_on_2.putBoolean(stringIDToTypeID('blendInterior'), true);
		var desc_on_3 = new ActionDescriptor();
		desc_on_3.putUnitDouble(charIDToTypeID('Scl '), charIDToTypeID('#Prc'), 100);
		var desc_on_4 = new ActionDescriptor();
		desc_on_4.putBoolean(charIDToTypeID('enab'), true);
		desc_on_4.putEnumerated(charIDToTypeID('Md  '), charIDToTypeID('BlnM'), stringIDToTypeID('linearBurn'));
		desc_on_4.putUnitDouble(charIDToTypeID('Opct'), charIDToTypeID('#Prc'), 100);
		var desc_on_5 = new ActionDescriptor();
		desc_on_5.putDouble(charIDToTypeID('Rd  '), 255);
		desc_on_5.putDouble(charIDToTypeID('Grn '), 255);
		desc_on_5.putDouble(charIDToTypeID('Bl  '), 127.998046875);
		desc_on_4.putObject(charIDToTypeID('Clr '), stringIDToTypeID('RGBColor'), desc_on_5);
		desc_on_3.putObject(charIDToTypeID('SoFi'), charIDToTypeID('SoFi'), desc_on_4);
		desc_on_2.putObject(charIDToTypeID('Lefx'), charIDToTypeID('Lefx'), desc_on_3);
		desc_on_1.putObject(charIDToTypeID('T   '), charIDToTypeID('Lyr '), desc_on_2);
		executeAction(charIDToTypeID('setd'), desc_on_1, dialogMode);
	}
	catch (ignored) {}
}
//Convert to profile Custom RGB... Gamma 1.0
// =========================================
function convert_to_profile()
{
	try
	{
		var idconvertToProfile = stringIDToTypeID('convertToProfile');
		var desc_cp = new ActionDescriptor();
		var idnull = charIDToTypeID('null');
		var ref_cp = new ActionReference();
		var idDcmn = charIDToTypeID('Dcmn');
		var idOrdn = charIDToTypeID('Ordn');
		var idTrgt = charIDToTypeID('Trgt');
		ref_cp.putEnumerated(idDcmn, idOrdn, idTrgt);
		desc_cp.putReference(idnull, ref_cp);
		var idT = charIDToTypeID('T   ');
		desc_cp.putData(
      idT,
      String.fromCharCode(
        0, 0, 1, 236, 65, 68, 66, 69, 2, 16, 0, 0, 109, 110, 116, 114, 82, 71, 66, 32, 88, 89,
        90, 32, 7, 224, 0, 8, 0, 31, 0, 20, 0, 22, 0, 17, 97, 99, 115, 112, 65, 80, 80, 76, 0,
        0, 0, 0, 110, 111, 110, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 246,
        214, 0, 1, 0, 0, 0, 0, 211, 44, 65, 68, 66, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 9, 99, 112, 114, 116, 0, 0, 0, 240, 0, 0, 0, 50, 100, 101, 115, 99, 0, 0,
        1, 36, 0, 0, 0, 101, 119, 116, 112, 116, 0, 0, 1, 140, 0, 0, 0, 20, 114, 88, 89, 90, 0,
        0, 1, 160, 0, 0, 0, 20, 103, 88, 89, 90, 0, 0, 1, 180, 0, 0, 0, 20, 98, 88, 89, 90, 0, 0,
        1, 200, 0, 0, 0, 20, 114, 84, 82, 67, 0, 0, 1, 220, 0, 0, 0, 14, 103, 84, 82, 67, 0, 0,
        1, 220, 0, 0, 0, 14, 98, 84, 82, 67, 0, 0, 1, 220, 0, 0, 0, 14, 116, 101, 120, 116, 0, 0,
        0, 0, 67, 111, 112, 121, 114, 105, 103, 104, 116, 32, 50, 48, 49, 54, 32, 65, 100, 111,
        98, 101, 32, 83, 121, 115, 116, 101, 109, 115, 32, 73, 110, 99, 111, 114, 112, 111, 114,
        97, 116, 101, 100, 0, 0, 0, 100, 101, 115, 99, 0, 0, 0, 0, 0, 0, 0, 11, 67, 117, 115, 116,
        111, 109, 32, 82, 71, 66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 243, 82, 0, 1, 0, 0, 0, 1, 22, 204, 88, 89, 90, 32, 0, 0,
        0, 0, 0, 0, 111, 161, 0, 0, 56, 245, 0, 0, 3, 144, 88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 98,
        150, 0, 0, 183, 135, 0, 0, 24, 218, 88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 36, 159, 0, 0, 15,
        132, 0, 0, 182, 194, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0));
		var idInte = charIDToTypeID('Inte');
		var idInte = charIDToTypeID('Inte');
		var idClrm = charIDToTypeID('Clrm');
		desc_cp.putEnumerated(idInte, idInte, idClrm);
		var idMpBl = charIDToTypeID('MpBl');
		desc_cp.putBoolean(idMpBl, true);
		var idDthr = charIDToTypeID('Dthr');
		desc_cp.putBoolean(idDthr, true);
		var idFltt = charIDToTypeID('Fltt');
		desc_cp.putBoolean(idFltt, false);
		var idsdwM = charIDToTypeID('sdwM');
		desc_cp.putInteger(idsdwM, 2);
		executeAction(idconvertToProfile, desc_cp, DialogModes.NO);
	}
	catch (ignored) {}
}

// BCM++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function findTheColor(){
	var color = {red:null, green:null, blue:null};
	makeColorSampler( 0, 0);
	for( var i =0; i<app.activeDocument.height* app.activeDocument.width; i++){
		moveColorSampler( 	((Math.random() * app.activeDocument.height) + 1),
							((Math.random() * app.activeDocument.width) + 1));

		color = getColorFromColorSampler();
		if(color.red != null){
			break;
		}
	}
	deleteColorSampler();

	return color;
}
function makeColorSampler( h, w ){
	var idMk = charIDToTypeID( "Mk  " );
	    var desc964 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref421 = new ActionReference();
	        var idClSm = charIDToTypeID( "ClSm" );
	        ref421.putClass( idClSm );
	    desc964.putReference( idnull, ref421 );
	    var idPstn = charIDToTypeID( "Pstn" );
	        var desc965 = new ActionDescriptor();
	        var idHrzn = charIDToTypeID( "Hrzn" );
	        var idPxl = charIDToTypeID( "#Pxl" );
	        desc965.putUnitDouble( idHrzn, idPxl, h );
	        var idVrtc = charIDToTypeID( "Vrtc" );
	        var idPxl = charIDToTypeID( "#Pxl" );
	        desc965.putUnitDouble( idVrtc, idPxl, w );
	    var idPnt = charIDToTypeID( "Pnt " );
	    desc964.putObject( idPstn, idPnt, desc965 );
	executeAction( idMk, desc964, DialogModes.NO );

}
function moveColorSampler(h, w){
	var idmove = charIDToTypeID( "move" );
	    var desc996 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref433 = new ActionReference();
	        var idClSm = charIDToTypeID( "ClSm" );
	        ref433.putIndex( idClSm, 1 );
	    desc996.putReference( idnull, ref433 );
	    var idT = charIDToTypeID( "T   " );
	        var desc997 = new ActionDescriptor();
	        var idHrzn = charIDToTypeID( "Hrzn" );
	        var idPxl = charIDToTypeID( "#Pxl" );
	        desc997.putUnitDouble( idHrzn, idPxl, 911.500000 );
	        var idVrtc = charIDToTypeID( "Vrtc" );
	        var idPxl = charIDToTypeID( "#Pxl" );
	        desc997.putUnitDouble( idVrtc, idPxl, 671.500000 );
	    var idPnt = charIDToTypeID( "Pnt " );
	    desc996.putObject( idT, idPnt, desc997 );
	executeAction( idmove, desc996, DialogModes.NO );

}

function deleteColorSampler(){
	var idDlt = charIDToTypeID( "Dlt " );
	    var desc996 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref433 = new ActionReference();
	        var idClSm = charIDToTypeID( "ClSm" );
	        ref433.putIndex( idClSm, 1 );
	    desc996.putReference( idnull, ref433 );
	executeAction( idDlt, desc996, DialogModes.NO );
}

function getColorFromColorSampler(){
	var color = {red:null, green:null, blue:null};
	var ref = new ActionReference();
	ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('colorSamplerList'));
	ref.putEnumerated( charIDToTypeID("Dcmn") , charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
	desc1 = executeActionGet(ref);
	desc1 = desc1.getList(stringIDToTypeID('colorSamplerList'));
	desc1 = desc1.getObjectValue(0);//the first sampler
	if(desc1.hasKey(charIDToTypeID('Clr '))){//get the color
		desc1 = desc1.getObjectValue(charIDToTypeID('Clr '))
		color = {	
					red:desc1.getDouble(charIDToTypeID('Rd  ')),
					green:desc1.getDouble(charIDToTypeID('Grn ')),
					blue:desc1.getDouble(charIDToTypeID('Bl  '))
				}
	}
	return color;
}

function desaturateMyLayer(){
	// =======================================================
	var idMk = charIDToTypeID( "Mk  " );
	    var desc2525 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref659 = new ActionReference();
	        var idAdjL = charIDToTypeID( "AdjL" );
	        ref659.putClass( idAdjL );
	    desc2525.putReference( idnull, ref659 );
	    var idUsng = charIDToTypeID( "Usng" );
	        var desc2526 = new ActionDescriptor();
	        var idType = charIDToTypeID( "Type" );
	            var desc2527 = new ActionDescriptor();
	            var idpresetKind = stringIDToTypeID( "presetKind" );
	            var idpresetKindType = stringIDToTypeID( "presetKindType" );
	            var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
	            desc2527.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
	            var idClrz = charIDToTypeID( "Clrz" );
	            desc2527.putBoolean( idClrz, false );
	        var idHStr = charIDToTypeID( "HStr" );
	        desc2526.putObject( idType, idHStr, desc2527 );
	    var idAdjL = charIDToTypeID( "AdjL" );
	    desc2525.putObject( idUsng, idAdjL, desc2526 );
	executeAction( idMk, desc2525, DialogModes.NO );

	// =======================================================
	var idsetd = charIDToTypeID( "setd" );
	    var desc2528 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref660 = new ActionReference();
	        var idAdjL = charIDToTypeID( "AdjL" );
	        var idOrdn = charIDToTypeID( "Ordn" );
	        var idTrgt = charIDToTypeID( "Trgt" );
	        ref660.putEnumerated( idAdjL, idOrdn, idTrgt );
	    desc2528.putReference( idnull, ref660 );
	    var idT = charIDToTypeID( "T   " );
	        var desc2529 = new ActionDescriptor();
	        var idpresetKind = stringIDToTypeID( "presetKind" );
	        var idpresetKindType = stringIDToTypeID( "presetKindType" );
	        var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
	        desc2529.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
	        var idAdjs = charIDToTypeID( "Adjs" );
	            var list174 = new ActionList();
	                var desc2530 = new ActionDescriptor();
	                var idH = charIDToTypeID( "H   " );
	                desc2530.putInteger( idH, 0 );
	                var idStrt = charIDToTypeID( "Strt" );
	                desc2530.putInteger( idStrt, -100 );
	                var idLght = charIDToTypeID( "Lght" );
	                desc2530.putInteger( idLght, 0 );
	            var idHsttwo = charIDToTypeID( "Hst2" );
	            list174.putObject( idHsttwo, desc2530 );
	        desc2529.putList( idAdjs, list174 );
	    var idHStr = charIDToTypeID( "HStr" );
	    desc2528.putObject( idT, idHStr, desc2529 );
	executeAction( idsetd, desc2528, DialogModes.NO );


		// =======================================================
		var idDlt = charIDToTypeID( "Dlt " );
		    var desc2643 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref722 = new ActionReference();
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idMsk = charIDToTypeID( "Msk " );
		        ref722.putEnumerated( idChnl, idChnl, idMsk );
		    desc2643.putReference( idnull, ref722 );
		executeAction( idDlt, desc2643, DialogModes.NO );


	// =======================================================
	var idGrpL = charIDToTypeID( "GrpL" );
	    var desc2544 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref664 = new ActionReference();
	        var idLyr = charIDToTypeID( "Lyr " );
	        var idOrdn = charIDToTypeID( "Ordn" );
	        var idTrgt = charIDToTypeID( "Trgt" );
	        ref664.putEnumerated( idLyr, idOrdn, idTrgt );
	    desc2544.putReference( idnull, ref664 );
	executeAction( idGrpL, desc2544, DialogModes.NO );
	// =======================================================
	var idslct = charIDToTypeID( "slct" );
	    var desc2551 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref668 = new ActionReference();
	        var idChnl = charIDToTypeID( "Chnl" );
	        var idChnl = charIDToTypeID( "Chnl" );
	        var idRGB = charIDToTypeID( "RGB " );
	        ref668.putEnumerated( idChnl, idChnl, idRGB );
	    desc2551.putReference( idnull, ref668 );
	executeAction( idslct, desc2551, DialogModes.NO );

}
function isLayerFlatColor(partialTransparent){
    var theColor = {idx:null, flat:false, color:{red:null, green:null, blue:null}};
    var allPx = app.activeDocument.width * app.activeDocument.height;
    // ======================================================= open placed layer
    var idplacedLayerEditContents = stringIDToTypeID( "placedLayerEditContents" );
        var desc195 = new ActionDescriptor();
    executeAction( idplacedLayerEditContents, desc195, DialogModes.NO );

    desaturateMyLayer();

    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), charIDToTypeID("Hstg"));
    ref.putEnumerated( charIDToTypeID("Dcmn") , charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc = executeActionGet(ref);
    desc = desc.getList(charIDToTypeID("Hstg"));
    var arrHstg = [];


    if(partialTransparent == true){
        var first = desc.getInteger(0);
        var last = desc.getInteger(255);


        makeSolidColor(255, 0, 0);
        // =======================================================move to 0
        var idmove = charIDToTypeID( "move" );
            var desc329 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref187 = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                var idOrdn = charIDToTypeID( "Ordn" );
                var idTrgt = charIDToTypeID( "Trgt" );
                ref187.putEnumerated( idLyr, idOrdn, idTrgt );
            desc329.putReference( idnull, ref187 );
            var idT = charIDToTypeID( "T   " );
                var ref188 = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                ref188.putIndex( idLyr, 0 );
            desc329.putReference( idT, ref188 );
            var idAdjs = charIDToTypeID( "Adjs" );
            desc329.putBoolean( idAdjs, false );
            var idVrsn = charIDToTypeID( "Vrsn" );
            desc329.putInteger( idVrsn, 5 );
        executeAction( idmove, desc329, DialogModes.NO );

        // check histogram
        var ref2 = new ActionReference();
        ref2.putProperty(charIDToTypeID('Prpr'), charIDToTypeID("Hstg"));
        ref2.putEnumerated( charIDToTypeID("Dcmn") , charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
        desc2 = executeActionGet(ref2);
        desc2 = desc2.getList(charIDToTypeID("Hstg"));
        var arrHstg = [];

        var theRed = desc2.getInteger(76);// the red
        var first2 = desc2.getInteger(0);
        var last2 = desc2.getInteger(255);
        if(theRed == allPx){
            //the full color is red
            theColor = {idx:76, flat:true, color:{red:255, green:0, blue:0}};
            // ===============================================delete the red solid color
            var idDlt = charIDToTypeID( "Dlt " );
                var desc1087 = new ActionDescriptor();
                var idnull = charIDToTypeID( "null" );
                    var ref465 = new ActionReference();
                    var idLyr = charIDToTypeID( "Lyr " );
                    var idOrdn = charIDToTypeID( "Ordn" );
                    var idTrgt = charIDToTypeID( "Trgt" );
                    ref465.putEnumerated( idLyr, idOrdn, idTrgt );
                desc1087.putReference( idnull, ref465 );
            executeAction( idDlt, desc1087, DialogModes.NO );
            
            // ===============================================and the hue saturation
            var idDlt = charIDToTypeID( "Dlt " );
                var desc1087 = new ActionDescriptor();
                var idnull = charIDToTypeID( "null" );
                    var ref465 = new ActionReference();
                    ref465.putIndex( idLyr, 2 );
                desc1087.putReference( idnull, ref465 );
            executeAction( idDlt, desc1087, DialogModes.NO );

            var cc2 =  findTheColor();
            // alert(cc.toSource());
            theColor = {idx:76, flat:true, color:cc2};
        }else{
            if(theRed == first + last || first2 != first || last2 != last)
            // if(true)
            {

                //this means that the red layer has cover the entyre transparency
                // now just search for the colors
                var s0Arrays = [];
                for( var i = 0; i<256; i++){
                    s0 = desc2.getInteger(i);
                    if(s0 != 0 && i!= 76){
                        s0Arrays.push(i);
                    }
                }
                // alert(i + ' :: '+s0 + ' --> '+(allPx - theRed));
                if(s0Arrays.length == 1){
                    // ===============================================delete the red solid color
                    var idDlt = charIDToTypeID( "Dlt " );
                        var desc1087 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );
                            var ref465 = new ActionReference();
                            var idLyr = charIDToTypeID( "Lyr " );
                            var idOrdn = charIDToTypeID( "Ordn" );
                            var idTrgt = charIDToTypeID( "Trgt" );
                            ref465.putEnumerated( idLyr, idOrdn, idTrgt );
                        desc1087.putReference( idnull, ref465 );
                    executeAction( idDlt, desc1087, DialogModes.NO );
                    
                    // ===============================================and the hue saturation
                    var idDlt = charIDToTypeID( "Dlt " );
                        var desc1087 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );
                            var ref465 = new ActionReference();
                            ref465.putIndex( idLyr, 2 );
                        desc1087.putReference( idnull, ref465 );
                    executeAction( idDlt, desc1087, DialogModes.NO );

                    var cc =  findTheColor();
                    // alert(cc.toSource());
                    theColor = {idx:i, flat:true, color:cc};
                }
            }
        }
    }else{//if full opacity
        for(var j = 0; j<256; j++){
            sJ = desc.getInteger(j);
            if(sJ != 0 &&  sJ == allPx){
                var cc =  findTheColor();
                theColor = {idx:j, flat:true, color:cc};
            }   
        }
    }

    // =======================================================close the doc
    var idCls = charIDToTypeID( "Cls " );
        var desc431 = new ActionDescriptor();
        var idSvng = charIDToTypeID( "Svng" );
        var idYsN = charIDToTypeID( "YsN " );
        var idN = charIDToTypeID( "N   " );
        desc431.putEnumerated( idSvng, idYsN, idN );
        var idforceNotify = stringIDToTypeID( "forceNotify" );
        desc431.putBoolean( idforceNotify, false );
    executeAction( idCls, desc431, DialogModes.NO );


    return theColor;
}

function makeSolidColor(red, green, blue){
		// =======================================================
		var idMk = charIDToTypeID( "Mk  " );
		    var desc325 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref186 = new ActionReference();
		        var idcontentLayer = stringIDToTypeID( "contentLayer" );
		        ref186.putClass( idcontentLayer );
		    desc325.putReference( idnull, ref186 );
		    var idUsng = charIDToTypeID( "Usng" );
		        var desc326 = new ActionDescriptor();
		        var idType = charIDToTypeID( "Type" );
		            var desc327 = new ActionDescriptor();
		            var idClr = charIDToTypeID( "Clr " );
		                var desc328 = new ActionDescriptor();
		                var idRd = charIDToTypeID( "Rd  " );
		                desc328.putDouble( idRd, red );
		                var idGrn = charIDToTypeID( "Grn " );
		                desc328.putDouble( idGrn, green );
		                var idBl = charIDToTypeID( "Bl  " );
		                desc328.putDouble( idBl, blue );
		            var idRGBC = charIDToTypeID( "RGBC" );
		            desc327.putObject( idClr, idRGBC, desc328 );
		        var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
		        desc326.putObject( idType, idsolidColorLayer, desc327 );
		    var idcontentLayer = stringIDToTypeID( "contentLayer" );
		    desc325.putObject( idUsng, idcontentLayer, desc326 );
		executeAction( idMk, desc325, DialogModes.NO );

		// =======================================================
		var idDlt = charIDToTypeID( "Dlt " );
		    var desc2643 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref722 = new ActionReference();
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idMsk = charIDToTypeID( "Msk " );
		        ref722.putEnumerated( idChnl, idChnl, idMsk );
		    desc2643.putReference( idnull, ref722 );
		executeAction( idDlt, desc2643, DialogModes.NO );
}

function checkTransparency(){
	var toRet = {empty:true, partialTransparent:false};

	// =======================================================load selection forom transparency of selected layer
	var idsetd = charIDToTypeID( "setd" );
	    var desc70 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref14 = new ActionReference();
	        var idChnl = charIDToTypeID( "Chnl" );
	        var idfsel = charIDToTypeID( "fsel" );
	        ref14.putProperty( idChnl, idfsel );
	    desc70.putReference( idnull, ref14 );
	    var idT = charIDToTypeID( "T   " );
	        var ref15 = new ActionReference();
	        var idChnl = charIDToTypeID( "Chnl" );
	        var idChnl = charIDToTypeID( "Chnl" );
	        var idTrsp = charIDToTypeID( "Trsp" );
	        ref15.putEnumerated( idChnl, idChnl, idTrsp );
	    desc70.putReference( idT, ref15 );
	executeAction( idsetd, desc70, DialogModes.NO );

	// check if the document has a selection
	var ref = new ActionReference();
	ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('selection'));
	ref.putEnumerated( charIDToTypeID("Dcmn") , charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
	desc1 = executeActionGet(ref);
	
	if(desc1.hasKey(stringIDToTypeID("selection")) == true)//layer is not empty
	{
		toRet.empty = false;
		
		// ======================================================= invert selection
		var idInvs = charIDToTypeID( "Invs" );
		executeAction( idInvs, undefined, DialogModes.NO );


		// check if the document has a selection
		var ref2 = new ActionReference();
		ref2.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('selection'));
		ref2.putEnumerated( charIDToTypeID("Dcmn") , charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
		desc2 = executeActionGet(ref2);

		if(desc2.hasKey(stringIDToTypeID("selection")) == true){
			toRet.partialTransparent = true;
		}else{
			toRet.partialTransparent = false;
		}

		// =======================================================deselect
		var idsetd = charIDToTypeID( "setd" );
		    var desc117 = new ActionDescriptor();
		    var idnull = charIDToTypeID( "null" );
		        var ref54 = new ActionReference();
		        var idChnl = charIDToTypeID( "Chnl" );
		        var idfsel = charIDToTypeID( "fsel" );
		        ref54.putProperty( idChnl, idfsel );
		    desc117.putReference( idnull, ref54 );
		    var idT = charIDToTypeID( "T   " );
		    var idOrdn = charIDToTypeID( "Ordn" );
		    var idNone = charIDToTypeID( "None" );
		    desc117.putEnumerated( idT, idOrdn, idNone );
		executeAction( idsetd, desc117, DialogModes.NO );
	}else{
		toRet.empty = true;
	}

	return toRet;
}

function deleteEmptyFolders(){
	multiDeleteByIDs(getEmptyFoldersToBedeleted());
}
function multiDeleteByIDs(ids) {
  if( ids.constructor != Array ) ids = [ ids ];
    if(ids.length != 0){
        var layers = new Array();
        var id54 = charIDToTypeID( "Dlt " );
        var desc12 = new ActionDescriptor();
        var id55 = charIDToTypeID( "null" );
        var ref9 = new ActionReference();
        for (var i = 0; i < ids.length; i++) {
            layers[i] = charIDToTypeID( "Lyr " );
            ref9.putIdentifier(layers[i], ids[i]);
        }
        desc12.putReference( id55, ref9 );
        executeAction( id54, desc12, DialogModes.NO );
    }
}
function getEmptyFoldersToBedeleted(){
	// go throw all the layers from bottom to up, to find out the
	// ids for the layer sets to be deleted
    var arrNb = [];
    var ref = new ActionReference();
    a = hasBackground()?0:1;
    var count = getLayersNb();
    isEmpty = [];
    y = false;
    r = 0;
    for(var i = a; i<=count; i++){
      ref1 = new ActionReference();
          ref1.putIndex( charIDToTypeID( 'Lyr ' ), i );
            var desc = executeActionGet(ref1);
            // var layerName = desc.getString(charIDToTypeID( 'Nm  ' ));
            // layerName = layerName.replace(/\//g, '_x_');
            var ls = desc.getEnumerationValue(stringIDToTypeID("layerSection"));
            ls = typeIDToStringID(ls);
            var id = desc.getInteger(stringIDToTypeID( 'layerID' ));
            // alert(layerName + " _r: "+ r + ' :: '+ isEmpty.toSource() + ' :: \n'+ arrNb.toSource());
            if(ls == "layerSectionStart" ){ 
                r --;
                // alert('r:'+r +' lyrName: ' + layerName + ' is: ' +isEmpty[r]);
                if((isEmpty[r]) == true ){
                    arrNb.push(id);
                }
                isEmpty.splice(r, 1);
            }
            if(ls == "layerSectionEnd"){
                isEmpty[r] = true;
                r ++;
                y = false;
            }
            if(ls == 'layerSectionContent'){
                if(y == false){
                    for(var f1 = isEmpty.length-1; f1 >= (isEmpty.length - r); f1--){
                        isEmpty[f1] = false;
                    }
                }
                y = true;
            }
    }
    return arrNb;
}


function hasBackground(){
  return app.activeDocument.layers[app.activeDocument.layers.length - 1].isBackgroundLayer;
}
function getLayersNb()//function to find out if the number of layers in the document
{
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID('numberOfLayers') );
    ref.putEnumerated( charIDToTypeID( "Dcmn" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    var desc = executeActionGet(ref);
    var numberOfLayers = desc.getInteger(stringIDToTypeID('numberOfLayers'));
    return numberOfLayers;
}

//++++++++++++++++++END BCM++++++++++++++++++++++++++++