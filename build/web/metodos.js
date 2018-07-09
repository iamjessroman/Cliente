 var canvas1 = window._canvas = new fabric.Canvas('canvas');
 var canvas = new fabric.Canvas('c');
 var image;
 var datos = [];

 function load() {
     fabric.util.loadImage("http://localhost:9090/Servidor/app/descarga/image", function(img) {
         image = new fabric.Image(img);
         image.selectable = false;
         canvas1.width = image.width;
         canvas1.height = image.height;
         canvas1.add(image);
         canvas1.centerObject(image);
         canvas1.renderAll();
     });
 }

 function Json() {
     $.getJSON('http://localhost:9090/Servidor/app/descarga/json', function(data) {
         canvas1.loadFromJSON(data, canvas1.renderAll.bind(canvas1), function(o, object) {
             var text = {
                 x: `${o.left}`,
                 y: `${o.top}`,
                 width: `${o.width}`,
                 height: `${o.height}`,
                 angle: `${o.angle}`
             };
             datos.push(text);
         });
     });
 }

 function refresh() {
     var canvas = window._canvas = new fabric.Canvas('canvas');
     var canvas2 = window._canvas = new fabric.Canvas('c');
     canvas.clear();
     canvas2.clear();
     var image;
     fabric.util.loadImage("http://localhost:9090/Servidor/app/descarga/image", function(img) {
         image = new fabric.Image(img);
         image.selectable = false;
         canvas.width = image.width;
         canvas.height = image.height;
         canvas.add(image);
         canvas.centerObject(image);
         canvas.renderAll();
     });
 }
 (function() {})();

 function crop() {
     var activeObject = canvas1.getActiveObject();
     cropDataUrl = image.toDataURL(activeObject);
     new fabric.Image.fromURL(cropDataUrl, function(img) {
         canvas.add(img); //this is your cropped image
     });
     var blueX = 381.12;
     var blueY = 460.71;
     var blueWidth = 102;
     var blueHeight = 43;
     var blueAngle = 5.17 * Math.PI / 180;
     var img = new Image();
     img.onload = start;
     img.src = "http://localhost:9090/Servidor/app/descarga/image";
     // create 2 temporary canvases
     var canvas1 = document.createElement("canvas");
     var ctx1 = canvas1.getContext("2d");
     var canvas2 = document.createElement("canvas");
     var ctx2 = canvas2.getContext("2d");
     // get the boundingbox of the rotated blue box
     var rectBB = getRotatedRectBB(blueX, blueY, blueWidth, blueHeight, blueAngle);
     // clip the boundingbox of the rotated blue rect
     // to a temporary canvas
     canvas1.width = canvas2.width = rectBB.width;
     canvas1.height = canvas2.height = rectBB.height;
     ctx1.drawImage(img, rectBB.cx - rectBB.width / 2, rectBB.cy - rectBB.height / 2, rectBB.width, rectBB.height, 0, 0, rectBB.width, rectBB.height);
     // unrotate the blue rect on the temporary canvas
     ctx2.translate(canvas1.width / 2, canvas1.height / 2);
     ctx2.rotate(-blueAngle);
     ctx2.drawImage(canvas1, -canvas1.width / 2, -canvas1.height / 2);
     // draw the blue rect to the display canvas
     var offX = rectBB.width / 2 - blueWidth / 2;
     var offY = rectBB.height / 2 - blueHeight / 2;
     canvas.width = blueWidth;
     canvas.height = blueHeight;
     ctx.drawImage(canvas2, -offX, -offY);
 }
 // Utility: get bounding box of rotated rectangle
 function getRotatedRectBB(x, y, width, height, rAngle) {
     var absCos = Math.abs(Math.cos(rAngle));
     var absSin = Math.abs(Math.sin(rAngle));
     var cx = x + width / 2 * Math.cos(rAngle) - height / 2 * Math.sin(rAngle);
     var cy = y + width / 2 * Math.sin(rAngle) + height / 2 * Math.cos(rAngle);
     var w = width * absCos + height * absSin;
     var h = width * absSin + height * absCos;
     return ({
         cx: cx,
         cy: cy,
         width: w,
         height: h
     });
 }