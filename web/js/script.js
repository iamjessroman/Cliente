$(document).ready(function() {
   // Variables
   var num = 0;
   var image;
   // Fin Variables

   // Canvas Fabric js
   var a = new fabric.Canvas('a');
   fabric.util.loadImage("http://localhost:9090/Servidor/app/descarga/image", function(img) {
     image = new fabric.Image(img);
     image.selectable = false;
     a.setWidth(image.width);
     a.setHeight(image.height);
     a.add(image);
     a.centerObject(image);
     a.renderAll();
   });
   // Fin Canvas Fabric js

   // Funciones en Botones
   $("#btna").click(draw);
   // Fin Funciones en Botones


   $.getJSON('http://localhost:9090/Servidor/app/descarga/json', function(data) {
     a.loadFromJSON(data, a.renderAll.bind(a), function(o, object) {
       if (o.type == 'rect') {
         var iDiv = document.createElement('div');
         iDiv.className = 'tools-imgEditor';
         iDiv.style.display = 'none';
         document.getElementsByTagName('body')[0].appendChild(iDiv);
         var ifalse = document.createElement("i");
         ifalse.setAttribute('aria-hidden', 'true');
         ifalse.setAttribute('class', 'fa fa-lg fa-refresh');
         ifalse.setAttribute('data-placement', 'bottom');
         ifalse.setAttribute('data-toggle', 'tooltip');
         ifalse.setAttribute('onclick', "clearCanvas()");
         ifalse.setAttribute('title', "Restaurar Imagem Original");
         iDiv.appendChild(ifalse);
         document.getElementsByTagName('body')[0].appendChild(iDiv);
         var ifalse = document.createElement("i");
         ifalse.setAttribute('aria-hidden', 'true');
         ifalse.setAttribute('class', 'fa fa-lg fa-times');
         ifalse.setAttribute('data-placement', 'bottom');
         ifalse.setAttribute('data-toggle', 'tooltip');
         ifalse.setAttribute('onclick', "removeObj()");
         ifalse.setAttribute('title', "Remover Objeto Selecionado");
         iDiv.appendChild(ifalse);
         document.getElementsByTagName('body')[0].appendChild(iDiv);
         var ifalse = document.createElement("i");
         ifalse.setAttribute('aria-hidden', 'true');
         ifalse.setAttribute('class', 'fa fa-lg fa-file-image-o');
         ifalse.setAttribute('data-placement', 'bottom');
         ifalse.setAttribute('data-toggle', 'tooltip');
         ifalse.setAttribute('onclick', "removeObj()");
         ifalse.setAttribute('title', "Remover Objeto Selecionado");
         iDiv.appendChild(ifalse);
         document.getElementsByTagName('body')[0].appendChild(iDiv);
         var ifalse = document.createElement("i");
         ifalse.setAttribute('aria-hidden', 'true');
         ifalse.setAttribute('class', 'fa fa-lg fa-square-o addElement');
         ifalse.setAttribute('data-placement', 'bottom');
         ifalse.setAttribute('data-toggle', 'tooltip');
         ifalse.setAttribute('onclick', "removeObj()");
         ifalse.setAttribute('title', "Remover Objeto Selecionado");
         iDiv.appendChild(ifalse);
         var ifalse = document.createElement("i");
         ifalse.setAttribute('aria-hidden', 'true');
         ifalse.setAttribute('class', 'fa fa-lg fa-location-arrow addElement');
         ifalse.setAttribute('data-placement', 'bottom');
         ifalse.setAttribute('data-toggle', 'tooltip');
         ifalse.setAttribute('onclick', "removeObj()");
         ifalse.setAttribute('title', "Remover Objeto Selecionado");
         iDiv.appendChild(ifalse);
         var ifalse = document.createElement("i");
         ifalse.setAttribute('aria-hidden', 'true');
         ifalse.setAttribute('class', 'fa fa-lg fa-crop');
         ifalse.setAttribute('data-placement', 'bottom');
         ifalse.setAttribute('data-toggle', 'tooltip');
         ifalse.setAttribute('onclick', "removeObj()");
         ifalse.setAttribute('title', "Remover Objeto Selecionado");
         iDiv.appendChild(ifalse);
         var nDiv = document.createElement('div');
         nDiv.id = 'div' + num;
         nDiv.style.display = 'none';
         nDiv.className = 'divcanvas';
         nDiv.onclick = '';
         document.getElementsByTagName('body')[0].appendChild(nDiv);
         var canv = document.createElement("canvas");
         canv.setAttribute('width', 300);
         canv.setAttribute('height', 300);
         canv.setAttribute('id', num);
         nDiv.appendChild(canv);
         num += 1;
       }
     });
   });


   function draw() {
     var a = new fabric.Canvas('a');
     num = 0;
     $.getJSON('http://localhost:9090/Servidor/app/descarga/json', function(data) {
       a.loadFromJSON(data, a.renderAll.bind(a), function(o, object) {
         if (o.type == 'rect') {
           cut(o.left, o.top, o.width, o.height, o.angle, num);
           $("#" + num).attr("onclick", "copy(" + num + "," + o.width + "," + o.height + ")");
           num += 1;
           console.log(num);
         }
       });
     });

     var elems = document.getElementsByClassName('tools-imgEditor');
     for (var i = 0; i < elems.length; i += 1) {
       elems[i].style.display = 'block';
     }
     var elems = document.getElementsByClassName('divcanvas');
     for (var i = 0; i < elems.length; i += 1) {
       elems[i].style.display = 'block';
     }
   }

   function cut(X, Y, Width, Height, Angle, num) {
     console.log(num);
     var canvas = document.getElementById(num);
     var ctx = canvas.getContext("2d");
     // blue rect's info
     var blueX = X;
     var blueY = Y;
     var blueWidth = Width;
     var blueHeight = Height;
     var blueAngle = Angle * Math.PI / 180;
     // load the image
     var img = new Image();
     img.onload = start;
     img.src = "http://localhost:9090/Servidor/app/descarga/image";

     function start() {
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
       ctx.drawImage(canvas2, -offX, -offY);
     } // end start
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
   }
 });

 function copy(num, width, height) {
   var c1 = document.getElementById(num);
   var c2 = document.getElementById("b");
   var ctx1 = c1.getContext("2d");
   var ctx2 = c2.getContext("2d");
   ctx2.clearRect(0, 0, c2.width, c2.height);
   var imgData = ctx1.getImageData(0, 0, width, height);
   ctx2.putImageData(imgData, 10, 10);
   var url = c2.toDataURL();
   loadImage(url, function() {
     initFilter(current_filter);
   });
   i = num;
 }

 function add() {
   if ($("#nombre").val() == "Sepia" && $("#text").val() !== "") {
     document.getElementById('Sepia').style.display = 'block'
   } else if ($("#nombre").val() == "Gaussian" && $("#text").val() !== "") {
     document.getElementById('Gaussian').style.display = 'block'
   } else if ($("#nombre").val() == "Oil" && $("#text").val() !== "") {
     document.getElementById('Oil').style.display = 'block'
   } else {
     alert("Código Incorrecto");
   }
 }

 function filteradd() {
   if (document.getElementById('divfilter').style.display == 'block') {
     document.getElementById('divfilter').style.display = 'none'
   } else {
     document.getElementById('divfilter').style.display = 'block'
   };
 }

 function savecanvas() {
   //   var canvas = document.getElementById("b");
   //   var link = document.createElement('a');
   //   link.download = "test.png";
   //   link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
   //   link.click();
   var c1 = document.getElementById("output");
   var c2 = document.getElementById(i);
   var ctx1 = c1.getContext("2d");
   var ctx2 = c2.getContext("2d");
   ctx2.clearRect(0, 0, c2.width, c2.height);
   var imgData = ctx1.getImageData(0, 0, 300, 300);
   ctx2.putImageData(imgData, 10, 10);
   i = num;
 }

 function saveimages() {
   for (var i = 0; i < num; i++) {
     var canvas = document.getElementById(i);
     var link = document.createElement('a');
     link.download = i + ".png";
     link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
     link.click();
     var text = "{id:" + i + " parqueo:" + i;
     var href = "data:application/octet-stream," + encodeURIComponent(text + JSON.stringify(a));
     var dlAnchorElem = document.getElementById('downloadAnchorElem');
     dlAnchorElem.setAttribute("href", href);
     dlAnchorElem.setAttribute("download", i + ".json");
     dlAnchorElem.click();
   }
 }