// load image to canvas

window.onload = function(){
    // Mouse tracking to image
    var imcanvas = document.getElementById("image-canvas");
    document.getElementById("image-page").addEventListener(
        "onload", imageLoad()
    );
    // End of mouse tracking
};

// Canvas related functions
//
var mousePress=false;
var pageImage;
var xcoord=0;
var ycoord=0;
var shiftx;
var shifty;

// For storing current selection
var currentRect = {
    "top" : "",
    "left" : "",
    "width" : "",
    "height" : "",
    "hratio": "",
    "vratio" : "",
    "top_real" : "",
    "left_real" : "",
    "width_real" : "",
    "height_real" : "",
};

// For storing hovering rectangle that represents the detected line
var hoveringRect = {
    "top" : "",
    "left" : "",
    "width" : "",
    "height" : "",
    "hratio": "",
    "vratio" : "",
    "top_real" : "",
    "left_real" : "",
    "width_real" : "",
    "height_real" : ""
};

var hratio=1;
var vratio=1;
var ratio=1;
var Tmatrix=[1,0,0,1,0,0];


function imageLoad(){
    /*
      Load the page image to the canvas
      with proper scaling and store
      the scaling ratios for drawing rectangles afterwards

     */
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
    // redrawPageImage(image, context, canvas);
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
    // Get scale factor for correctly drawing rectangle
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

    // xcoord = mouseXTrans; // real coordinates
    // ycoord = mouseYTrans; // real coordinates
    xcoord = mouseX;
    ycoord = mouseY;
    // mouseX = Math.floor(mouseX/shiftx);
    // mouseY = Math.floor(mouseY*vratio);
    //
    // store the starting mouse position
    mousePress=true;
}

function canvasMouseUp(event){
    mousePress=false;
    console.log("in mouse up");
}

function canvasMouseMove(event){
    // regroups functions that activates with
    // mouse move on canvas
    var imcanvas = document.getElementById("image-canvas");
    var context = imcanvas.getContext('2d');
    var canvasOffsetX = imcanvas.offsetLeft;
    var canvasOffsetY = imcanvas.offsetTop;
    var mouseX=parseInt(event.layerX - canvasOffsetX);
    var mouseY=parseInt(event.layerY - canvasOffsetY);
    var mouseXTrans = (mouseX) / hratio; // real coordinates
    var mouseYTrans = (mouseY) / vratio; // real coordinates
    //
    drawLineBounds(event);
    //
    if(mousePress === false){
        return;
    }
    if(mousePress === true){
        context.strokeStyle = "lightgray";
        context.lineWidth=2;
        console.log(event);
        context.clearRect(0,0,
                          imcanvas.width,
                          imcanvas.height);
        redrawPageImage(context, imcanvas);
        // drawRectangleSelection(mouseXTrans,
        //                        mouseYTrans,
        //                        context);
        drawRectangle(mouseX,
                      mouseY,
                      mouseXTrans,
                      mouseYTrans,
                      xcoord,
                      ycoord,
                      hratio,
                      vratio,
                      context,
                      currentRect);
    }
    console.log("drawn");
}

function drawRectangle(mouseX2,
                       mouseY2,
                       mouseX2Trans,
                       mouseY2Trans,
                       x1coord,
                       y1coord,
                       hratio,
                       vratio,
                       context,
                       rectUpdate){
    // Rectangle draw function
    var rectW = mouseX2 - x1coord;
    var rectH = mouseY2 - y1coord;
    var x_real = x1coord / hratio;
    var y_real = y1coord / vratio;
    var width_real = Math.floor(mouseX2Trans - x_real);
    var height_real = Math.floor(mouseY2Trans - y_real);
    //
    rectUpdate["top"] = y1coord;
    rectUpdate["left"] = x1coord;
    rectUpdate["width"] = rectW;
    rectUpdate["height"] = rectH;
    rectUpdate["hratio"] = hratio;
    rectUpdate["vratio"] = vratio;
    rectUpdate["left_real"] = Math.floor(x_real);
    rectUpdate["top_real"] = Math.floor(y_real);
    rectUpdate["width_real"] = width_real;
    rectUpdate["height_real"] = height_real;
    //
    console.log(rectUpdate);
    context.beginPath();
    context.rect(x1coord,
                 y1coord,
                 rectW,
                 rectH);
    context.stroke();
}

function checkLineBound(mX,
                        mY,
                        line){
    // check if the line contains the mX and mY
    var linetop = parseInt(line["top"], 10);
    var lineleft = parseInt(line["left"], 10);
    var linetop2 = linetop + parseInt(line["height"], 10);
    var lineleft2 = lineleft + parseInt(line["width"], 10);
    var check = false;
    //
    if(
        (linetop <= mX) && (mX <= linetop2) &&
            (lineleft <= mY) && (mY <= lineleft2)
    ){
        check=true;
    }
    return check;
}

function getLineBound(mXcoord, mYcoord){
    // get the line that is to be drawn based on the
    // coordinates provided
    var lineInBound = [];
    //
    for(i=0; i<lines.length; i++){
        var aLine = lines[i];
        if(checkLineBound(mXcoord, mYcoord, aLine) === true){
            lineInBound.push(aLine);
        }
    }
    //
    return lineInBound[0];
}

function drawLineBounds(event){
    // makes the line bounding box
    // visible if the mouse is
    // in its coordinates
    var imcanvas = document.getElementById("image-canvas");
    var context = imcanvas.getContext('2d');
    var canvasOffsetX = imcanvas.offsetLeft;
    var canvasOffsetY = imcanvas.offsetTop;
    var mouseX2=parseInt(event.layerX - canvasOffsetX);
    var mouseY2=parseInt(event.layerY - canvasOffsetY);
    var mouseX2Trans = (mouseX2) / hratio; // real coordinates
    var mouseY2Trans = (mouseY2) / vratio; // real coordinates
    context.clearRect(0,0,
                      imcanvas.width,
                      imcanvas.height);
    redrawPageImage(context, imcanvas);
    var lineDraw = getLineBound(mouseX2Trans,
                                mouseY2Trans);
    console.log("linedraw");
    console.log(lineDraw);
    // TODO add the x2, y2 as well
    // instead of taking them from mouse positions
    var y1_real = parseInt(lineDraw["top"], 10);
    var x1_real = parseInt(lineDraw["left"], 10);
    var x1coord = x1_real * hratio;
    var y1coord = y1_real * vratio;
    context.strokeStyle = "red";
    context.lineWidth=1;
    //
    // draw the rectangle
    drawRectangle(mouseX2,
                  mouseY2,
                  mouseX2Trans,
                  mouseY2Trans,
                  x1coord,
                  y1coord,
                  hratio,
                  vratio,
                  context,
                  hoveringRect);
}

function redrawPageImage(context, canvas){
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

function redrawRect(context, rectObj){
    // redraw the last hovering rectangle
    var x1coord = rectObj["left"];
    var y1coord = rectObj["top"];
    var nwidth = rectObj["width"];
    var nheight = rectObj["height"];
    // draw
    context.strokeStyle = "red";
    context.lineWidth=1;
    context.beginPath();
    context.rect(x1coord,
                 y1coord,
                 nwidth,
                 nheight);
    context.stroke();
}
function restoreOldCanvas(){
    // restore canvas to its old state
    var imcanvas = document.getElementById("image-canvas");
    var context = imcanvas.getContext('2d');
    context.clearRect(0,0,
                      imcanvas.width,
                      imcanvas.height);
    redrawPageImage(context, imcanvas);
    redrawRect(context, hoveringRect);

}
//
function resetRect(){
    // Clears canvas and redraws the original image
        currentRect = {
        "top" : "",
        "left" : "",
        "width" : "",
        "height" : "",
        "hratio": "",
        "vratio" : "",
        "top_real" : "",
        "left_real" : "",
        "width_real" : "",
        "height_real" : "",
    };
    restoreOldCanvas();
    console.log(currentRect);
}

function createItemId(){
    // creates the id of item group based on the
    // the number of elements the text-line-list has
    var orList = document.getElementById("text-line-list");
    var children = orList.childNodes;
    var childArray = [];
    for(var i=0; i < children.length; i++){
        var newchild = children[i];
        if(newchild.className === "item-group"){
            childArray.push(newchild);
        }
    }
    //
    var newId = childArray.length + 1;
    return newId;
}

function checkRectangle(){
    // check if the selection rectangle is empty
    var emptyRect = {
        "top" : "",
        "left" : "",
        "width" : "",
        "height" : "",
        "hratio": "",
        "vratio" : "",
        "top_real" : "",
        "left_real" : "",
        "width_real" : "",
        "height_real" : "",
    };
    var result = false;
    if(currentRect === emptyRect){
        result = true;
    }else{
        result = false;
    }
    //
    return result;
}
function createIGroup(idstr){
    // create the list element that will hold the group
    var listItem = document.createElement("li");
    listItem.setAttribute("class", "item-group");
    listItem.setAttribute("id", idstr);
    //
    return listItem;
}

function createItList(idstr){
    // Unordered list that would hold the checkbox
    // and the transcription line
    var ulList = document.createElement("ul");
    ulList.setAttribute("class", "item-list");
    ulList.setAttribute("id", idstr);
    //
    return ulList;
}

function createTLine(idstr){
    // transcription line
    var transLine = document.createElement("li");
    transLine.setAttribute("id", idstr);
    transLine.setAttribute("contenteditable", "true");
    transLine.setAttribute("spellcheck", "true");
    transLine.setAttribute("class", "editable-line");
    var placeholder = "Enter text for line ";
    placeholder.concat(idstr);
    transLine.setAttribute("data-placeholder", placeholder);
    var bbox = "";
    bbox = bbox.concat(currentRect["left_real"]);
    bbox = bbox.concat(", ");
    bbox = bbox.concat(currentRect["top_real"]);
    bbox = bbox.concat(", ");
    bbox = bbox.concat(currentRect["width_real"]);
    bbox = bbox.concat(", ");
    bbox = bbox.concat(currentRect["height_real"]);
    transLine.setAttribute("data-bbox", bbox);
    //
    return transLine;
}

function createLineWidget(idstr){
    // Create the line widget that holds
    // checkboxes and other functionality
    var lineWidget = document.createElement("li");
    lineWidget.setAttribute("id", idstr);
    var labelContainer = document.createElement("label");
    labelContainer.setAttribute("class", "lbl-container");
    var textNode = document.createTextNode("Mark for deletion");
    labelContainer.appendChild(textNode);
    var delInput = document.createElement("input");
    delInput.setAttribute("id", idstr);
    delInput.setAttribute("type","checkbox");
    delInput.setAttribute("class", "delete-checkbox");
    labelContainer.appendChild(delInput);
    var spanElement = document.createElement("span");
    spanElement.setAttribute("class", "checkmark");
    labelContainer.appendChild(spanElement);
    lineWidget.appendChild(labelContainer);
    //
    return lineWidget;
}

function addTranscription(){
    // adds a transcription box to item list
    var check = checkRectangle();
    if( check === true){
        alert("Please select an area before adding a transcription");
    }
    var orList = document.getElementById("text-line-list");
    // create the new line id
    var newListId = createItemId();
    //
    var listItem = createIGroup(newListId);
    var ulList = createItList(newListId);
    var transLine = createTLine(newListId);
    var lineWidget = createLineWidget(newListId);
    //
    // transline and linewidget goes into ullist
    ulList.appendChild(transLine);
    ulList.appendChild(lineWidget);
    // ul list goes into list item
    listItem.appendChild(ulList);
    // list item goes into or list
    orList.appendChild(listItem);
   }


// Functions related transcription boxes
// sort function for lists
//
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
    var itemparent = document.getElementById("text-line-list");
    var linearr = Array.from(lineList).sort(
        sortOnBbox
    );
    //
    //
    linearr.forEach(el => itemparent.appendChild(el) );
}

function sortOnBbox(a, b){
    // Sorts the list elements according to
    // their placement on the image
    // get editable lines
    var eline1 = a.getElementsByClassName("editable-line");// returns a list 
    var eline2 = b.getElementsByClassName("editable-line");// with single element
    eline1 = eline1[0]; //  get the single element
    eline2 = eline2[0];
    //
    // get bbox
    var bbox1 = eline1.getAttribute("data-bbox");
    var bbox2 = eline2.getAttribute("data-bbox");
    // split the string
    var bbox1_split = bbox1.split(",");
    var bbox2_split = bbox2.split(",");
    // second element is the top value
    // get top value
    var bbox1_top = bbox1_split[1];
    var bbox2_top = bbox2_split[1];
    bbox1_top = bbox1_top.trim();
    bbox2_top = bbox2_top.trim();
    //
    bbox1_top = parseInt(bbox1_top, 10);
    bbox2_top = parseInt(bbox2_top, 10);
    //
    // compare:
    // if the the top value is higher
    // that means the line is at a lower section
    // of the page image
    // so that which has a high value
    // should be placed after it is a simple ascending
    // numbers comparison
    //
    return bbox1_top - bbox2_top;

}
