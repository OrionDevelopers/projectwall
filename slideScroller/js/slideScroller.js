var isTouchSupported = 'ontouchstart' in window;
//window.alert(isTouchSupported);

var NUMBER_OF_SLIDES = 20;
var THRESHOLD_VELOCITY = 0.6;
var initialX,initialY,finalX,finalY,velocity;
var toDrag = false,currentIndex;
var containerReference,containerHeight,containerWidth,containerX,containerY,containerY,stage,layer,selectionWrapper,thumbnailContainer;
var canvasElement = new Array();
var imageElement = new Array();

function onBodyLoad(){
	containerReference = document.getElementById('container');
	containerHeight = containerReference.offsetHeight;
	containerWidth = containerReference.offsetWidth;
	containerX = containerReference.offsetLeft;
	containerY = containerReference.offsetTop;
	fillSelectionWrapper();
	
	stage = new Kinetic.Stage({
		container:'container',
		height:containerHeight,
		width:containerWidth
	});
	layer = new Kinetic.Layer();
	stage.add(layer);
	console.log("containerX = "+containerX+" : containerY = "+containerY +" : containerWidth = "+containerWidth+" : containerHeight = "+containerHeight);
	for(i=1;i<=NUMBER_OF_SLIDES;i++){
		var imageObj = new Image();
		imageObj.src = "slides/UNIT1/Slide"+i.toString()+".PNG";
		imageElement[i] = new Kinetic.Image({
			id:i.toString(),
			x:containerWidth,
			y:0,
			height:containerHeight,
			width:containerWidth,
			image :imageObj,
			draggable: true,
			dragBoundFunc: function(pos){
				return{
					x:pos.x,
					y:0
				};
			}
		});
		layer.add(imageElement[i]);
		imageElement[i].on('dragstart',slideDragStart);
		imageElement[i].on('dragmove',slideDragMove);
		imageElement[i].on('dragend',slideDragEnd);
		
	}
	imageElement[1].setX(0);
	currentIndex = 1;
	document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = '#4190C7';
	layer.draw();
}
function slideDragStart(evt){
	initialX = imageElement[currentIndex].getX();    //obtaining from the amount of slide being pushed
	if(isTouchSupported)
			evt = evt.targetTouches[0];

	var coord = getX_Y(evt);
	initialY = coord.Y;
	var temp = new Date();
	initialTimeStamp = temp.getTime();
}
function slideDragMove(evt){
	index = Number(evt.targetNode.getId());
	//console.log(imageElement[index].getX());
	if(index!=NUMBER_OF_SLIDES)
		imageElement[index+1].setX(imageElement[index].getX()+containerWidth);
	if(index!=1)
		imageElement[index-1].setX(imageElement[index].getX()-containerWidth);
	layer.draw();
}
function slideDragEnd(evt){
	finalX = imageElement[currentIndex].getX();
	if(isTouchSupported)
		evt = evt.changedTouches[0];
	var coord = getX_Y(evt);
	finalY = coord.Y;
	if(finalY-initialY > 100 && finalY-initialY > Math.abs(finalX-initialX)){
		showSelectionWrapper();
		return;
	}

	var temp = new Date();
	finalTimeStamp = temp.getTime();
	velocity = (finalX - initialX)/(finalTimeStamp-initialTimeStamp);
	console.log(velocity);
	if(imageElement[currentIndex].getX() < -containerWidth/4 || velocity < -THRESHOLD_VELOCITY){
		if(currentIndex!=NUMBER_OF_SLIDES){
			moveSlideToCenter(currentIndex+1);
			document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = 'transparent';
			currentIndex+=1;
			document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = '#4190C7';
		}
		else
			moveSlideToCenter(currentIndex);
	}
	else if(imageElement[currentIndex].getX() > containerWidth/4 || velocity  > THRESHOLD_VELOCITY){
		if(currentIndex!=1){
			moveSlideToCenter(currentIndex-1)
			document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = 'transparent';
			currentIndex-=1;
			document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = '#4190C7'
		}
		else
			moveSlideToCenter(currentIndex);
	}
	else
		moveSlideToCenter(currentIndex);
}
function moveSlideToCenter(indexToMove){
	
		imageElement[indexToMove].transitionTo({
			x:0,
			easing: 'strong-ease-out',
			duration:0.5
		});
		if(indexToMove != NUMBER_OF_SLIDES){
		imageElement[indexToMove+1].transitionTo({
			x:containerWidth,
			easing: 'strong-ease-out',
			duration:0.5
		});
		}
		if(indexToMove != 1){
		imageElement[indexToMove-1].transitionTo({
			x:-containerWidth,
			easing: 'strong-ease-out',
			duration:0.5
		});
		}

	}
function showSelectionWrapper(){
	selectionWrapper.style.top = "0px";
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
function fillSelectionWrapper(){
	selectionWrapper = document.getElementById('selectionWrapper');
	thumbnailContainer = document.getElementById('thumbnailContainer');
	for(i=1;i<=NUMBER_OF_SLIDES;i++){     //because slide number starts with 1
		var thumbnailElement = document.createElement('div');
		thumbnailElement.setAttribute('class','thumbnailElement');
		thumbnailElement.setAttribute('id','thumb'+i.toString());
		thumbnailElement.style.height = (containerHeight/4).toString() + 'px';
		var slideImg = document.createElement('img');
		slideImg.src = 'slides/UNIT1/Slide'+i.toString()+'.PNG';
		slideImg.setAttribute('class','thumbnailImage');
		slideImg.setAttribute('id',i.toString());
		slideImg.addEventListener('click',thumbnailClicked,false);
		thumbnailElement.appendChild(slideImg);
		var captionDiv = document.createElement('div');
		captionDiv.setAttribute('class','caption');
		captionDiv.innerHTML = 'Slide'+i.toString();
		thumbnailElement.appendChild(captionDiv);
		thumbnailContainer.appendChild(thumbnailElement);
	}
}
function thumbnailClicked(evt){
	//console.log("hey ya = "+evt.target.getAttribute('id'));
	document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = 'transparent';
	currentIndex = Number(evt.target.getAttribute('id'));
	document.getElementById('thumb'+currentIndex.toString()).style.backgroundColor = '#4190C7';
	for(i=1;i<=NUMBER_OF_SLIDES;i++){
		if(i<currentIndex){
			imageElement[i].setX(-containerWidth);
		}
		else if(i>currentIndex){
			imageElement[i].setX(containerWidth);
		}
		else
			imageElement[i].setX(0);
	}

	layer.draw();
	selectionWrapper.style.top = '-1000px';

}


	