#target photoshop
app.bringToFront();
var startRulerUnits = app.preferences.rulerUnits;
var startTypeUnits = app.preferences.typeUnits;
var startDisplayDialogs = app.displayDialogs;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;
app.displayDialogs = DialogModes.NO;

/*=============CODE GENERATED=============*/

var progressBar = new Window("window{\
text:'Loading',bounds:[100,100,700,200],\
stack:Progressbar{bounds:[0,10,580,20] , value:0,maxvalue:100}, \
channel:Progressbar{bounds:[0,30,580,40] , value:0,maxvalue:100}, \
layer:Progressbar{bounds:[0,50,580,60] , value:0,maxvalue:100}};");
progressBar.show();
