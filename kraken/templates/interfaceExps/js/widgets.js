// load image to canvas

window.onload = init;
function init() {
    // Mouse tracking to image
    document.getElementById("page-image-div").addEventListener("mouseenter",
                                                           function() {
                                                               inDiv=true;
                                                           });
    document.getElementById("page-image-div").addEventListener("mouseout",
                                                           function() {
                                                               inDiv=false;
                                                           });
    document.getElementById("page-image-div").addEventListener(
        "dblclick",
        function (){
        }
    );
    // End of mouse tracking
    document.getElementById("image-page").addEventListener(
        "onload", imageLoad()
    );
    //

};

function imageLoad(){
    loadImageToCanvas();
    console.log("now image");
    console.log(image);
    console.log("image width");
    console.log(image.clientWidth);
    console.log("image height");
    console.log(image.clientHeight);
    console.log("canvas width");
    console.log(canvas.clientWidth);
    // image.clientWidth = canvas.clientWidth;
    //
    var i=0;
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "red";
    while(i < lines.length){
        var lineObj = lines[i];
        console.log("line object");
        console.log(lineObj);
        var leftInt = parseInt(lineObj.left, 10);
        leftInt = leftInt * ratio;
        leftInt = Math.floor(leftInt);
        var topInt = parseInt(lineObj.top, 10);
        topInt = topInt * ratio;
        topInt = Math.floor(topInt);
        var widthInt = parseInt(lineObj.width, 10);
        widthInt = widthInt * ratio;
        widthInt = Math.floor(widthInt);
        var heightInt = parseInt(lineObj.height, 10);
        heightInt = heightInt * ratio;
        heightInt = Math.floor(heightInt);
        context.rect(leftInt, topInt, widthInt, heightInt);
        context.stroke();
        i += 1;
    }
};

function loadImageToCanvas(){
     // Canvas load image
    var container = document.getElementById("page-image");
    var canvas = document.getElementById("image-canvas");
    var context = canvas.getContext('2d');
    // set canvas width and height
    var image = document.getElementById("image-page");
    // Get client width/height, that is after styling
    var imcwidth = image.clientWidth;
    var imcheight = image.clientHeight;
    var imnwidth = image.naturalWidth;
    var imnheight = image.naturalHeight;
    var resultList;
    resultList = imageScale(imcwidth,
                            imcheight,
                            imnwidth,
                            imnheight,
                            canvas);
    //
    var cwidth = resultList[0];
    var cheight = resultList[1];
    var ratio = resultList[2];
    var hRatio = resultList[3];
    var canvas = resultList[4];
    var vRatio = resultList[5];
    //
    var centerShift_x = resultList[6];
    var centerShift_y = resultList[7];
    //
    context.drawImage(image,
                      0,0,// coordinate source
                      imnwidth, // source rectangle width
                      imnheight, // source rectangle height
                      centerShift_x, centerShift_y, // destination coordinate
                      // 0,0,
                      imnwidth*ratio, // destination width
                      imnheight*ratio // destination height
                     );
    document.getElementById("image-page").remove();
};

function imageScale(imageClientWidth,
                    imageClientHeight,
                    imageNaturalWidth,
                    imageNaturalHeight,
                    canvasObject){
    // deal with scaling issues of an existing image
    canvasObject.height = imageClientHeight;
    canvasObject.width = imageClientWidth;
    var cwidth = canvasObject.clientWidth;
    var cheight = canvasObject.clientHeight;
    var hRatio = cwidth / imageNaturalWidth;
    var vRatio = cheight / imageNaturalHeight;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = ( cwidth - imageClientWidth * ratio ) / 2;
    var centerShift_y = ( cheight - imageClientHeight * ratio ) / 2;
    var results = [cwidth, cheight,
                   ratio, hRatio, canvasObject,
                   vRatio, centerShift_x,
                   centerShift_y];
    //
    return results;
}

function scaleLineRects(scaleFactor,
                        lineTop, lineLeft,
                        lineNaturalWidth,
                        lineNaturalHeight){
    
};


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

function getMousePosition(event) {
    var posX = event.clientX;
    var posY = event.clientY;
    //
    return posX, posY;
}
// add mouse tracking to page image

var inDiv = false;


function getMousePositionImage(event) {
    var result;
    if(inDiv === false){
        result = null;
    }else{
        result = getMousePosition(event);
    }
    return result;
}
