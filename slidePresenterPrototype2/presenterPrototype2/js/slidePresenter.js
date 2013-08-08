// Global Contstants
var isTouchSupported = 'ontouchstart' in window;
//window.alert(isTouchSupported);

var CURRENT_COLOR = 'black';
var RECT_FILL_STYLE = 'transparent';
var ERASER_SIZE = 20;
var NUMBER_OF_SLIDES = 20;


var tools = {
	isPenToolSelected:0,
	isRectangleToolSelected:0,
	isFilledRectToolSelected:0,
	isFocusToolSelected:0,
	isEraserToolSelected:0
};
function resetAllTools(){
		if(tools.isFocusToolSelected)
			destroyFocusSheet();
		helperCanvas.style.visibility = 'hidden';
		tools.isPenToolSelected=0;
		tools.isRectangleToolSelected=0;
		tools.isFocusToolSelected=0;
		tools.isFilledRectToolSelected=0;
		tools.isEraserToolSelected=0;

		document.getElementById('penToolButton').className = 'myButton btn btn-info btn-large';
		document.getElementById('rectToolButton').className = 'myButton btn btn-info btn-large';
		document.getElementById('focusToolButton').className = 'myButton btn btn-info btn-large';
		document.getElementById('eraserToolButton').className = 'myButton btn btn-info btn-large';
		document.getElementById('zoomIn').className = 'myButton btn btn-info btn-large';
		document.getElementById('zoomOut').className = 'myButton btn btn-info btn-large';

}
function selectTool(toolName){
		//window.alert(toolName+' selected');
		resetAllTools();
		switch(toolName){
			case 'penTool':
				tools.isPenToolSelected = 1;
				document.getElementById('penToolButton').className = 'myButton btn btn-primary btn-large';
				break;
			case 'rectTool':
				//RECT_FILL_STYLE = 'transparent';
				tools.isRectangleToolSelected=1;
				helperCanvas.style.visibility = 'visible';
				document.getElementById('rectToolButton').className = 'myButton btn btn-primary btn-large';
				break;
			// case 'filledRectTool':
			// 	//RECT_FILL_STYLE = 'yellow';
			// 	tools.isFilledRectToolSelected=1;
			// 	//tools.isRectangleToolSelected=1;
			// 	break;
			case 'focusTool':
				tools.isFocusToolSelected=1;
				document.getElementById('focusToolButton').className = 'myButton btn btn-primary btn-large';
				createFocusSheet();
				break;
			case 'eraserTool':
				tools.isEraserToolSelected=1;
				document.getElementById('eraserToolButton').className = 'myButton btn btn-primary btn-large';
				break;
		}
		console.log(toolName + " Selected");
}
var canvas, context, helperCanvas, helperContext, debugHelper;
var canvas_URI_Array = new Array();   //remember to use this array from index1
var currentSlideIndex; 
var containerReference, containerHeight, containerWidth,containerX,containerY;
var isButtonDown = false;
var isButtonDownOnHelper = false;
var isZoomed = false;
var rectOrigin_X, rectOrigin_Y, rectWidth, rectHeight, rectToDraw = false;
function init(){
	// debugHelper = document.getElementById('debugHelper');
	//canvas = document.getElementById("myCanvas");
	containerReference = document.getElementById('container');
	containerHeight = containerReference.offsetHeight;
	containerWidth = containerReference.offsetWidth;
	containerX = containerReference.offsetLeft;
	containerY = containerReference.offsetTop;
	console.log("x= "+containerX+" y= "+containerY);
	
	///     Creating main canvas ////

	canvas = document.createElement('CANVAS');
	canvas.height = containerHeight;
	canvas.width = containerWidth;
	canvas.style.backgroundImage = "url('slides/UNIT1/Slide1.PNG')";
	currentSlideIndex = 1;
	$.ajax({
			url:'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png',
			type:'HEAD',
			error: function(){
				context.clearRect(0,0,containerWidth,containerHeight);
			},
			success: function(){
				var tempImgObj = new Image();
				tempImgObj.src = 'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png';
				tempImgObj.onload = function(){
					context.clearRect(0,0,containerWidth,containerHeight);
					context.drawImage(tempImgObj,0,0);
				}
			}
		});
	canvas.style.backgroundSize = "100% 100%";
	canvas.style.position = "absolute";
	containerReference.appendChild(canvas);
	context = canvas.getContext('2d');
	
	
	////// Creating Helper Canvas   / ////////

	helperCanvas = document.createElement('CANVAS');
	helperCanvas.height = containerHeight;
	helperCanvas.width = containerWidth;
	helperCanvas.style.backgroundSize = "100% 100%";
	helperCanvas.style.position = "absolute";
	helperCanvas.style.visibility = 'hidden';
	containerReference.appendChild(helperCanvas);
	helperContext = helperCanvas.getContext('2d');
	
	context.strokeStyle = CURRENT_COLOR;
	helperContext.strokeStyle = CURRENT_COLOR;
	//canvas.addEventListener('mousemove', mouseMoved, false);
	//canvas.addEventListener('mouseup', mouseUp, false);
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mouseout', mouseLeave, false);
	helperCanvas.addEventListener('mousedown',helperCanvasMouseDown,false);
	//helperCanvas.addEventListener('mouseup', helperCanvasMouseUp, false);
	//helperCanvas.addEventListener('mousemove', helperCanvasMouseMove, false);
	document.getElementById("penToolButton").addEventListener('click',function(){selectTool('penTool');},false);
	document.getElementById("rectToolButton").addEventListener('click',function(){selectTool('rectTool');},false);
	// document.getElementById('filledRectToolButton').addEventListener('click',function(){selectTool('filledRectTool');},false);
	document.getElementById('focusToolButton').addEventListener('click',function(){selectTool('focusTool');},false);
	document.getElementById('eraserToolButton').addEventListener('click',function(){selectTool('eraserTool');},false);
	document.getElementById('clearToolButton').addEventListener('click',function(){clearSheet();},false);
	document.getElementById('zoomIn').addEventListener('click',zoomIn,false);
	document.getElementById('zoomOut').addEventListener('click',zoomOut,false);
	document.getElementById('next').addEventListener('click',showNextSlide,false);
	document.getElementById('previous').addEventListener('click',showPreviousSlide,false);
	// document.getElementById("saveButton").addEventListener('click',saveCanvas,false);


	/// touch events ......
	//canvas.addEventListener('touchmove',mouseMoved,false);
	//canvas.addEventListener('touchend',mouseUp,false);
	canvas.addEventListener('touchstart',mouseDown,false);
	//helperCanvas.addEventListener('touchmove',helperCanvasMouseMove,false);
	helperCanvas.addEventListener('touchstart',helperCanvasMouseDown,false);
	//helperCanvas.addEventListener('touchend',helperCanvasMouseUp,false);
}

/*function drawSlideImage(){         // not to be used. Very slow to draw heavy images.....(using background images instead)
	var img = new Image();
	img.src="sampleSlide.PNG";
	context.drawImage(img,0,0,canvas.width,canvas.height);
}*/
/*function changeCurrentToolTo(currentToolName){
	isPenToolSelected=false;
	isRectangleToolSelected = false;

}*/
function clearSheet(){
	context.clearRect(0,0,containerWidth,containerHeight);
}
function showNextSlide(){
	if(currentSlideIndex == NUMBER_OF_SLIDES){
		window.alert('No more Slides available');
		return;
	}
	//canvas_URI_Array[currentSlideIndex] = canvas.toDataURL('image/png');
	//canvas_URI_Array.push(canvas.toDataURL('image/png'));
	$.ajax({
  		type: "POST",
  		url: "saveImage.php",
  		data: { 
     		img: canvas.toDataURL('image/png'),
     		fileName: 'canvas'+currentSlideIndex.toString()
  		}
		}).done(function(o) {
  		console.log('saved');
		});
		currentSlideIndex+=1;
		$.ajax({
			url:'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png',
			type:'HEAD',
			error: function(){
				context.clearRect(0,0,containerWidth,containerHeight);
			},
			success: function(){
				var tempImgObj = new Image();
				tempImgObj.src = 'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png';
				tempImgObj.onload = function(){
					context.clearRect(0,0,containerWidth,containerHeight);
					context.drawImage(tempImgObj,0,0);
				}
			}
		});
	
	
	canvas.style.backgroundImage = "url('slides/UNIT1/Slide"+currentSlideIndex.toString()+".PNG')";
}
function showPreviousSlide(){
	if(currentSlideIndex == 1){
		window.alert('This is the first Slide');
		return;
	}
	$.ajax({
  		type: "POST",
  		url: "saveImage.php",
  		data: { 
     		img: canvas.toDataURL('image/png'),
     		fileName: 'canvas'+currentSlideIndex.toString()
  		}
		}).done(function(o) {
  		console.log('saved');
		});

		currentSlideIndex-=1;
		$.ajax({
			url:'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png',
			type:'HEAD',
			error: function(){
				context.clearRect(0,0,containerWidth,containerHeight);
			},
			success: function(){
				var tempImgObj = new Image();
				tempImgObj.src = 'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png';
				tempImgObj.onload = function(){
					context.clearRect(0,0,containerWidth,containerHeight);
					context.drawImage(tempImgObj,0,0);
				}
			}
		});
		
	canvas.style.backgroundImage = "url('slides/UNIT1/Slide"+currentSlideIndex.toString()+".PNG')";


}
function setStrokeWidth(w,obj){
	helperContext.lineWidth = w;
	context.lineWidth = w;
	document.getElementById('thin').className = "submenuButton btn btn-info btn-large";
	document.getElementById('medium').className = "submenuButton btn btn-info btn-large";
	document.getElementById('thick').className = "submenuButton btn btn-info btn-large";
	document.getElementById('extraThick').className = "submenuButton btn btn-info btn-large";
	obj.className = "submenuButton btn btn-primary btn-large";
}
function setStrokeColor(colorName,obj){
	helperContext.strokeStyle = colorName;
	context.strokeStyle = colorName;
	document.getElementById('blueStroke').className = "submenuButton btn btn-info btn-large";
	document.getElementById('blackStroke').className = "submenuButton btn btn-info btn-large";
	document.getElementById('greenStroke').className = "submenuButton btn btn-info btn-large";
	document.getElementById('redStroke').className = "submenuButton btn btn-info btn-large";
	obj.className = "submenuButton btn btn-primary btn-large";	
}
function saveCanvas(e){
	document.location.href = canvas.toDataURL('image/png');
	//Canvas2Image.saveAsPNG(canvas);
	//alert("Cannot save image right now. Function temporarily removed by Sumit.");
}
function mouseLeave(e) {
	e.preventDefault();
	isButtonDown = false;
	return false;
}

function mouseMoved(e) {
	e.preventDefault();  

	// debugHelper.innerHTML = 'mouseMoved';
	if(isTouchSupported){
		e = e.targetTouches[0];
		//window.alert(e.offsetX);
	}

	if (tools.isPenToolSelected) {
		if (isButtonDown) {
			// if(isTouchSupported)
			// 	context.lineTo(e.screenX-containerX, e.screenY-containerY);    //do layerX for Mozilla	
			// else
			var coord = getX_Y(e);
			context.lineTo(coord.X, coord.Y);    
			context.stroke();
		}
	}
	if(tools.isEraserToolSelected){
		if(isButtonDown){
			var coord = getX_Y(e);
			context.clearRect(coord.X-ERASER_SIZE/2,coord.Y-ERASER_SIZE/2,ERASER_SIZE,ERASER_SIZE);
		}
	}
	return false;
}

function mouseDown(e) {
	e.preventDefault();       
	canvas.addEventListener('mousemove', mouseMoved, false);  
	canvas.addEventListener('mouseup',mouseUp,false); 
	canvas.addEventListener('touchmove',mouseMoved,false);
	canvas.addEventListener('touchend',mouseUp,false);  
	// debugHelper.innerHTML = 'mouseDown';
	if(isTouchSupported){
		e = e.targetTouches[0];
		//window.alert(e.screenX);
	}


	isButtonDown = true;
	if (tools.isPenToolSelected) {
		context.beginPath();
		// if(isTouchSupported)
		// 	context.moveTo(e.screenX-containerX, e.screenY-containerY);
		// else
			var coord = getX_Y(e);
			context.moveTo(coord.X, coord.Y);
		/* use e.layerX for other browsers */
	}
	/*
	if (tools.isRectangleToolSelected) {
		var coord = getX_Y(e);
		rectOrigin_X = coord.X;
		rectOrigin_Y = coord.Y;
		rectToDraw = true;

		helperCanvas.addEventListener('mouseup',helperCanvasMouseUp,false);
		helperCanvas.addEventListener('mousemove',helperCanvasMouseMove,false);
		helperCanvas.addEventListener('touchmove',helperCanvasMouseMove,false);
		helperCanvas.addEventListener('touchend',helperCanvasMouseUp,false);

		//helperContext.fillStyle = RECT_FILL_STYLE;
		helperCanvas.style.visibility = "visible";
	}*/
	return false;
}

function mouseUp(e) {
	e.preventDefault();   
	canvas.removeEventListener('mousemove', mouseMoved, false);
	canvas.removeEventListener('mouseup',mouseUp,false);
	canvas.removeEventListener('touchmove',mouseMoved,false);
	canvas.removeEventListener('touchend',mouseUp,false);  
	// debugHelper.innerHTML = 'mouseUp';    
	if(isTouchSupported)
		e = e.targetTouches[0];

	isButtonDown = false;
	return false;
}
function helperCanvasMouseDown(e){
	e.preventDefault();
	if(isTouchSupported){
		e = e.targetTouches[0];
		//window.alert(e.screenX);
	}
	helperCanvas.addEventListener('mouseup',helperCanvasMouseUp,false);
	helperCanvas.addEventListener('mousemove',helperCanvasMouseMove,false);
	helperCanvas.addEventListener('touchmove',helperCanvasMouseMove,false);
	helperCanvas.addEventListener('touchend',helperCanvasMouseUp,false);

	if(tools.isFocusToolSelected){
		isButtonDownOnHelper = true;
		var coord = getX_Y(e);
		rectOrigin_X = coord.X;
		rectOrigin_Y = coord.Y;
		//helperContext.fillStyle = RECT_FILL_STYLE;
	}
	if(tools.isRectangleToolSelected){
		var coord = getX_Y(e);
		rectOrigin_X = coord.X;
		rectOrigin_Y = coord.Y;
		rectToDraw = true;

	}
	// debugHelper.innerHTML = 'helperCanvasMouseDown at X = '+coord.X+" Y = "+coord.Y;
	
	return false;
}
function helperCanvasMouseUp(e) {
	e.preventDefault();
	if(isTouchSupported){
		e = e.changedTouches[0];      ///touch end coordinated will be found in the changedTouches array
		//window.alert(e.screenX);
	}
	

	// debugHelper.innerHTML = 'helperCanvasMouseUp';
	if (tools.isRectangleToolSelected) {
		var coord = getX_Y(e);
		rectWidth = coord.X - rectOrigin_X;
		rectHeight = coord.Y - rectOrigin_Y;
		helperContext.clearRect(0,0,helperCanvas.width,helperCanvas.height);    //added 10:52 26/4
		//helperCanvas.style.visibility = "hidden";
		context.fillStyle = RECT_FILL_STYLE;
		context.strokeRect(rectOrigin_X, rectOrigin_Y, rectWidth, rectHeight);
		
	}
	if(tools.isFocusToolSelected){
		isButtonDownOnHelper=false;
		//alert('drawn at : '+rectOrigin_X+", "+rectOrigin_Y);
		
	}
	helperCanvas.removeEventListener('mouseup',helperCanvasMouseUp,false);
	helperCanvas.removeEventListener('mousemove',helperCanvasMouseMove,false);
	helperCanvas.removeEventListener('touchmove',helperCanvasMouseMove,false);
	helperCanvas.removeEventListener('touchend',helperCanvasMouseUp,false);
	
	return false;
}

function helperCanvasMouseMove(e) {
	e.preventDefault();
	if(isTouchSupported){
		e = e.targetTouches[0];
		//window.alert(e.screenX);
	}
	if(tools.isRectangleToolSelected){
		helperContext.clearRect(0, 0, helperCanvas.width, helperCanvas.height);
		var coord = getX_Y(e);
		helperContext.strokeRect(rectOrigin_X, rectOrigin_Y, coord.X - rectOrigin_X, coord.Y - rectOrigin_Y);
	}
	if(tools.isFocusToolSelected){
		if(isButtonDownOnHelper){
		helperContext.clearRect(0, 0, helperCanvas.width, helperCanvas.height);
		helperContext.fillRect(0,0,helperCanvas.width,helperCanvas.height);
		var coord = getX_Y(e);
		helperContext.clearRect(rectOrigin_X,rectOrigin_Y,coord.X-rectOrigin_X,coord.Y-rectOrigin_Y);
		// debugHelper.innerHTML = 'helperCanvasMouseMove at X = '+coord.X+" Y = "+coord.Y;
		}
	}
	return false;
}
function createFocusSheet(){
	helperCanvas.style.visibility = 'visible';
	helperContext.globalAlpha = 0.8;
	helperContext.fillStyle = 'black';
	helperContext.clearRect(0, 0, helperCanvas.width, helperCanvas.height);
	helperContext.fillRect(0,0,containerWidth,containerHeight);

}
function destroyFocusSheet(){
	helperContext.globalAlpha = 1;
	helperContext.clearRect(0, 0, helperCanvas.width, helperCanvas.height);
	helperCanvas.style.visibility = 'hidden';
}
function zoomIn(){
	//console.log(containerWidth);
	//console.log(containerHeight);
	if(isZoomed){
		window.alert("already Zoomed In");
		return;
	}
	document.getElementById('zoomIn').className = 'myButton btn btn-primary btn-large';
	isZoomed = true;
	var zoomPanel = document.createElement("DIV");
	zoomPanel.setAttribute('id','zoomPanel');
	zoomPanel.style.position="absolute";
	zoomPanel.style.height=containerHeight;
	zoomPanel.style.width=containerWidth;
	zoomPanel.style.backgroundColor = 'pink';
	zoomPanel.style.overflow = 'hidden';
	containerReference.appendChild(zoomPanel);

	var zoomStage = new Kinetic.Stage({
		container:'zoomPanel',
		width:containerWidth,
		height:containerHeight,
		draggable:true
	});

	/// Slide Layer
	var zoomSlideLayer = new Kinetic.Layer();
	var slideImgObj = new Image();
	slideImgObj.src = 'slides/UNIT1/Slide'+currentSlideIndex.toString()+'.PNG';
	var zoomedSlide = new Kinetic.Image({
		x:0,
		y:0,
		height:containerHeight*2,
		width:containerWidth*2,
		image:slideImgObj,
	});

	zoomSlideLayer.add(zoomedSlide);
	zoomSlideLayer.draw();
	zoomStage.add(zoomSlideLayer);
	

	//// canvas Layer .....
	var zoomLayer = new Kinetic.Layer();
	var imgObj = new Image();
	var isCanvasImageAvailable = false;
	//imgObj.src = canvas.toDataURL();
	$.ajax({
			url:'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png',
			type:'HEAD',
			error: function(){
				console.log('error');
				isCanvasImageAvailable = false;
			},
			success: function(){
				imgObj.src = 'slides/UNIT1/canvas'+currentSlideIndex.toString()+'.png';
				isCanvasImageAvailable = true;
			},
			async: false
		});
		
		if(isCanvasImageAvailable){
			var zoomedImage = new Kinetic.Image({
			x:0,
			y:0,
			height:containerHeight*2,
			width:containerWidth*2,
			image:imgObj,
			});
			zoomLayer.add(zoomedImage);
		}
	//zoomLayer.add(rect);
	zoomLayer.draw();
	zoomStage.add(zoomLayer);
	//zoomStage.fire('mousedown');
	//zoomStage.draw();
	
}
function zoomOut(){
	if(isZoomed){
	containerReference.removeChild(zoomPanel);
	isZoomed = false;
	document.getElementById('zoomIn').className = 'myButton btn btn-info btn-large';
	}
	else
	window.alert("Not in a Zoom State");
}
function getX_Y(evt){
	var coord={
		X: null,
		Y: null
	}
	if(isTouchSupported){
		coord.X = evt.clientX-containerX;
		coord.Y = evt.clientY-containerY;
		return coord;
	}
	
	else if(evt.offsetX || evt.offsetX == 0){
		coord.X = evt.offsetX;
		coord.Y = evt.offsetY;
		console.log('offset');
		return coord;
	}

	else if(evt.layerX || evt.layerX == 0){
		coord.X = evt.layerX;
		coord.Y = evt.layerY;
		console.log('layer');
		return coord;
	}
}

