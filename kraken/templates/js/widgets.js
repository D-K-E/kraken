// load image to canvas

window.onload = function(){
    // Mouse tracking to image
    var imcanvas = document.getElementById("image-canvas");
    document.getElementById("image-page").addEventListener(
        "onload", imageLoad()
    );
    // End of mouse tracking
    };

var inCanvas=false;
var pageImage;
var xcoord=0;
var ycoord=0;
var shiftx;
var shifty;

var currentRect = {
    "top" : "",
    "left" : "",
    "width" : "",
    "height" : "",
    "hratio": "",
    "vratio" : "",
    "top_real" : "",
    "left_real" : "",
};
var hratio=1;
var vratio=1;
var ratio=1;
var Tmatrix=[1,0,0,1,0,0];


function imageLoad(){
    // Canvas load image
    var canvas = document.getElementById("image-canvas");
    var context = canvas.getContext('2d');
    // set canvas width and height
    var image = document.getElementById("image-page");
    console.log(image);
    var imcwidth = image.clientWidth;
    var imcheight = image.clientHeight;
    // set client width of the canvas to image
    console.log(canvas);
    canvas.width = imcwidth;
    canvas.height = imcheight;
    var cwidth = canvas.clientWidth;
    var cheight = canvas.clientHeight;
    // Get natural width and height
    var imnwidth = image.naturalWidth;
    var imnheight = image.naturalHeight;
    //
    var ratiolist  = getScaleFactor(cwidth, //dest width
                                cheight, // dest height
                                imnwidth, // src width
                                imnheight); // src height
    ratio = ratiolist[2];
    hratio = ratiolist[0];
    vratio = ratiolist[1];
    shiftx = ( cwidth - imcwidth * ratio ) / 2;
    shifty = ( cheight - imcheight * ratio ) / 2;
    context.drawImage(image,
                      0,0,// coordinate source
                      imnwidth, // source rectangle width
                      imnheight, // source rectangle height
                      // centerShift_x, centerShift_y, // destination coordinate
                      0,0,
                      imnwidth*ratio, // destination width
                      imnwidth*ratio // destination height
                     );
    // drawNewImage(image, context, canvas);
    pageImage = image.cloneNode(true);
    pageImage.width = canvas.width;
    pageImage.height = canvas.height;
    console.log(pageImage);
    document.getElementById("image-page").remove();
};

function getScaleFactor(destWidth,
                        destHeight,
                        srcWidth,
                        srcHeight) {
    var hRatio = destWidth / srcWidth;
    var vRatio = destHeight / srcHeight;
    var ratio = Math.min(hRatio, vRatio);
    //
    return [hRatio, vRatio, ratio];
}

function getLine(lineObj){
    // get line coordinates from line object
    var leftInt = parseInt(lineObj.left, 10);
    leftInt = Math.floor(leftInt);
    var topInt = parseInt(lineObj.top, 10);
    topInt = Math.floor(topInt);
    var widthInt = parseInt(lineObj.width, 10);
    widthInt = Math.floor(widthInt);
    var heightInt = parseInt(lineObj.height, 10);
    heightInt = Math.floor(heightInt);
    //
    var results = [leftInt, topInt, widthInt, heightInt];
    return results;
}

function canvasMouseDown(event){
    // handling canvas mouse button pressed
    var imcanvas = document.getElementById("image-canvas");
    var canvasOffsetX = imcanvas.offsetLeft;
    var canvasOffsetY = imcanvas.offsetTop;

    var mouseX=parseInt(event.layerX - canvasOffsetX);
    var mouseY=parseInt(event.layerY - canvasOffsetY);
    var mouseXTrans = mouseX  / hratio;
    var mouseYTrans = mouseY / vratio ;
    console.log("m down");
    console.log("mouytrans");
    console.log(mouseYTrans);
    console.log("mo y");
    console.log(mouseY);
    console.log(event);

    // xcoord = mouseXTrans; // real coordinates
    // ycoord = mouseYTrans; // real coordinates
    xcoord = mouseX;
    ycoord = mouseY;
    // mouseX = Math.floor(mouseX/shiftx);
    // mouseY = Math.floor(mouseY*vratio);
    //
    // store the starting mouse position
    inCanvas=true;
}

function canvasMouseUp(event){
    inCanvas=false;
    console.log("in mouse up");
}

function canvasMouseMove(event){
    if(inCanvas === false){
        return;
    }
    var imcanvas = document.getElementById("image-canvas");
    var context = imcanvas.getContext('2d');
    var canvasOffsetX = imcanvas.offsetLeft;
    var canvasOffsetY = imcanvas.offsetTop;
    var mouseX=parseInt(event.layerX - canvasOffsetX);
    var mouseY=parseInt(event.layerY - canvasOffsetY);
    var mouseXTrans = (mouseX) / hratio; // real coordinates
    var mouseYTrans = (mouseY) / vratio; // real coordinates
    // mouseX = Math.floor(mouseXTrans);
    // mouseY = Math.floor(mouseYTrans);
    //
    console.log("moving");
    console.log("in mouse move");
    console.log(mouseX);
    console.log("xcoord");
    console.log(xcoord);
    console.log("client x");
    console.log(event.clientX);
    console.log("xtransformed");
    console.log(mouseXTrans);
    console.log("ytransformed");
    console.log(mouseYTrans);
    //
    context.strokeStyle = "lightgray";
    context.lineWidth=2;
    console.log(event);
    context.clearRect(0,0,
                      imcanvas.width,
                      imcanvas.height);
    drawNewImage(context, imcanvas);
    // drawRectangleSelection(mouseXTrans,
    //                        mouseYTrans,
    //                        context);
    drawRectangleSelection(mouseX,
                           mouseY,
                           mouseXTrans,
                           mouseYTrans,
                           hratio,
                           vratio,
                           context);

    console.log("drawn");
}

function drawRectangleSelection(mouseX,
                                mouseY,
                                mouseXTrans,
                                mouseYTrans,
                                hratio,
                                vratio,
                                context){
    // Rectangle draw function
    var rectW = mouseX - xcoord;
    var rectH = mouseY - ycoord;
    currentRect["top"] = mouseY;
    currentRect["left"] = mouseX;
    currentRect["width"] = rectW;
    currentRect["height"] = rectH;
    currentRect["left_real"] = Math.floor(mouseXTrans);
    currentRect["top_real"] = Math.floor(mouseYTrans);
    //
    console.log(currentRect);
    context.beginPath();
    context.rect(xcoord,
                 ycoord,
                 rectW,
                 rectH);
    context.stroke();
}

function drawNewImage(context, canvas){
    // set canvas width and height
    // Get client width/height, that is after styling
    console.log("new image being drawn");
    var imcwidth = pageImage.width;
    var imcheight = pageImage.height;
    // set client width of the canvas to image
    canvas.width = imcwidth;
    canvas.height = imcheight;
    var cwidth = canvas.clientWidth;
    var cheight = canvas.clientHeight;
    // Get natural width and height
    var imnwidth = pageImage.naturalWidth;
    var imnheight = pageImage.naturalHeight;
    //
    var ratiolist  = getScaleFactor(cwidth, //dest width
                                cheight, // dest height
                                imnwidth, // src width
                                imnheight); // src height
    var ratio = ratiolist[2];
    hratio = ratiolist[0];
    vratio = ratiolist[1];
    var centerShift_x = ( cwidth - imcwidth * ratio ) / 2;
    var centerShift_y = ( cheight - imcheight * ratio ) / 2;
    context.drawImage(pageImage,
                      0,0,// coordinate source
                      imnwidth, // source rectangle width
                      imnheight, // source rectangle height
                      // centerShift_x, centerShift_y, // destination coordinate
                      0,0,
                      imnwidth*ratio, // destination width
                      imnwidth*ratio // destination height
                     );
}

// sort function for lists
var deletedNodes = [];
function deleteBoxes(){
    /*
      Simple function for deleting lines whose checkboxes are selected
      Description:
      We query the input elements whose class is delete-checkbox.
      Then we check whether they are checked or not.
      If they are checked we delete the item group containing them
    */
    var deleteCheckBoxList = document.querySelectorAll("input.delete-checkbox");
    var dellength = deleteCheckBoxList.length;
    var deletedboxlength = 0;
    var i = 0;
    while(i < dellength){
        var cbox = deleteCheckBoxList[i];
        var checkval = cbox.checked;
        if(checkval===true){
            // removing the element if checkbox is checked
            var labelnode = cbox.parentNode;
            var linewidgetNode = labelnode.parentNode;
            var itemlistNode = linewidgetNode.parentNode;
            var itemgroupNode = itemlistNode.parentNode;
            var lineId = itemgroupNode.id;
            // get the image line from the other column
            var imageLineSelector = "a.rect[id='".concat(lineId,
                                                         "']");
            var imageLine = document.querySelector(imageLineSelector);
            //
            var imageparent = imageLine.parentNode;
            var itemparent = itemgroupNode.parentNode;
            var deleted = {"imageline" : imageLine,
                           "itemgroup" : itemgroupNode,
                           "imageparent" : imageparent,
                           "itemparent" : itemparent};
            deletedNodes.push(deleted);
            // remove both from the page
            itemparent.removeChild(itemgroupNode);
            imageparent.removeChild(imageLine);
            deletedboxlength +=1;
        }
        i+=1;
    }
    if(deletedboxlength === 0){
        alert("Please select lines for deletion");
    }
}
//
function undoDeletion(){
    if (deletedNodes.length === 0){
        alert("Deleted line information is not found");
    }
    var lastObject = deletedNodes.pop();
    //
    var imageLine = lastObject["imageline"];
    var itemgroup = lastObject["itemgroup"];
    var imageparent = lastObject["imageparent"];
    var itemparent = lastObject["itemparent"];
    //
    imageparent.appendChild(imageLine);
    itemparent.appendChild(itemgroup);
    //
}
function sortLines() {
    var lineList = document.querySelectorAll(".item-group");
    var itemparent = document.querySelector("#text-line-list");
    var linearr = Array.from(lineList).sort(
        (a,b) => parseInt(a.id, 10) - parseInt(b.id, 10)
    );
    linearr.forEach(el => itemparent.appendChild(el) );
}
