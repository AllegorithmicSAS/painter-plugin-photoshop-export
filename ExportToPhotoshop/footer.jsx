

/*=============HELPER=============*/

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
function send_backward()
{
	/*var id_mov = charIDToTypeID('move');
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
	executeAction(id_mov, desc_ll, DialogModes.NO);*/
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
	var desc_sObj = new ActionDescriptor();
	desc_sObj.putPath(charIDToTypeID('null'), path_f);
	try {
		executeAction(charIDToTypeID('Plc '), desc_sObj, DialogModes.NONE);
		return true;
	}
	catch (e) {
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
		desc_cp.putData(idT, String.fromCharCode(0, 0, 1, 236, 65, 68, 66, 69, 2, 16, 0, 0, 109, 110, 116, 114, 82, 71, 66, 32, 88, 89, 90, 32, 7, 224, 0, 8, 0, 31, 0, 20,
			0, 22, 0, 17, 97, 99, 115, 112, 65, 80, 80, 76, 0, 0, 0, 0, 110, 111, 110, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 0, 0, 246, 214, 0, 1, 0, 0, 0, 0, 211, 44, 65, 68, 66, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 9, 99, 112, 114, 116, 0, 0, 0, 240, 0, 0, 0, 50, 100, 101, 115, 99, 0, 0, 1, 36, 0, 0, 0, 101, 119, 116, 112, 116,
			0, 0, 1, 140, 0, 0, 0, 20, 114, 88, 89, 90, 0, 0, 1, 160, 0, 0, 0, 20, 103, 88, 89, 90, 0, 0, 1, 180, 0, 0, 0, 20,
			98, 88, 89, 90, 0, 0, 1, 200, 0, 0, 0, 20, 114, 84, 82, 67, 0, 0, 1, 220, 0, 0, 0, 14, 103, 84, 82, 67, 0, 0, 1, 220,
			0, 0, 0, 14, 98, 84, 82, 67, 0, 0, 1, 220, 0, 0, 0, 14, 116, 101, 120, 116, 0, 0, 0, 0, 67, 111, 112, 121, 114, 105, 103, 104,
			116, 32, 50, 48, 49, 54, 32, 65, 100, 111, 98, 101, 32, 83, 121, 115, 116, 101, 109, 115, 32, 73, 110, 99, 111, 114, 112, 111, 114, 97, 116, 101,
			100, 0, 0, 0, 100, 101, 115, 99, 0, 0, 0, 0, 0, 0, 0, 11, 67, 117, 115, 116, 111, 109, 32, 82, 71, 66, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 243, 82, 0, 1, 0, 0, 0, 1, 22, 204,
			88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 111, 161, 0, 0, 56, 245, 0, 0, 3, 144, 88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 98, 150,
			0, 0, 183, 135, 0, 0, 24, 218, 88, 89, 90, 32, 0, 0, 0, 0, 0, 0, 36, 159, 0, 0, 15, 132, 0, 0, 182, 194, 99, 117, 114, 118,
			0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0));
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