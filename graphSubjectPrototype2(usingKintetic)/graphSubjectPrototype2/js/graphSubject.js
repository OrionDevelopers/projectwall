var RADIUS_OF_NODE = 20;
var STROKE_COLOR_FOR_NODE = 'black'
var COLOR_OF_NODE = '#498BF3';
var IS_DIRECTED_GRAPH = true;
var HIGHLIGHT_WHILE_MOVE = true;
var TO_CREATE_NODE = false;
var TO_CREATE_EDGE = false;
var HAND_TOOL_SELECTED = false;
var TARGET_EDGE_COLOR = 'red', SOURCE_EDGE_COLOR = 'blue', SELF_LOOP_COLOR = 'green';
var DBL_CLICK = 0;

var containerHeight, containerWidth, containerX, containerY, layer, arrowLayer, stage, containerReference;
var toDrawEdge = false;
var circleClicked = false;
var nodeArray = new Array();
var totalNodes = 0;
var edgeArray = new Array();
var totalEdges = 0;
var selfLoopArray = new Array();
var totalSelfLoops = 0;
var sourceIndex, sourceNode;

function onBodyLoad() {
	containerReference = document.getElementById('container');
	containerHeight = containerReference.offsetHeight;
	containerWidth = containerReference.offsetWidth;
	// this is the way you obtain the rendered height and width
	// note object.style.height will not work as the height and width are rendered
	// with jQuery its simple : $('idOfObject').height
	containerX = containerReference.offsetLeft;
	containerY = containerReference.offsetTop;
	var x = graphType = confirm("Press 'OK' for Directed Graph and 'Cancel' for Undirected.");
	if(x==true){
		IS_DIRECTED_GRAPH = true;
	}
	else{
		IS_DIRECTED_GRAPH = false;
		TARGET_EDGE_COLOR = '#CE643F';
		SOURCE_EDGE_COLOR = '#CE643F';
	}

	stage = new Kinetic.Stage({
		container : 'container',
		height : containerHeight,
		width : containerWidth
	});
	arrowLayer = new Kinetic.Layer();
	layer = new Kinetic.Layer();
	stage.add(arrowLayer);
	stage.add(layer);
	// containerReference.addEventListener('dblclick', function(evt){
	// 	createNode(evt.offsetX, evt.offsetY);
	// },false);
	//
	 /*
	containerReference.addEventListener('dbltap',function(evt){
		window.alert("container dbltap");
		createNode(evt.offsetX, evt.offsetY);
	});
	*/
	containerReference.addEventListener('click', function(evt){
		//console.log('containerClicked');
		if(TO_CREATE_NODE){
			createNode(evt.offsetX, evt.offsetY);	
		}

		if (!circleClicked)
			toDrawEdge = false;
		circleClicked = false;

	},false);
	containerReference.addEventListener('touchstart', function(evt) {
		//console.log('containerClicked');
		evt.preventDefault();
		evt = evt.targetTouches[0];
		DBL_CLICK +=1 ;
		window.setTimeout(function(){DBL_CLICK -=1;},350);
		if(DBL_CLICK == 2){
			//window.alert("container dbltap");
			createNode(evt.clientX-containerX, evt.clientY-containerY);
		}
		//window.alert("container tap");
		if (!circleClicked)
			toDrawEdge = false;
		circleClicked = false;

	},false);
	//createNode(50,50);
}
function highlightEdges(){
	HIGHLIGHT_WHILE_MOVE = HIGHLIGHT_WHILE_MOVE?false:true; 
}
function createNodeButtonClicked(){
	TO_CREATE_NODE = true;
	TO_CREATE_EDGE = false;
	HAND_TOOL_SELECTED = false;
	for(i=0;i<nodeArray.length;i++)
		nodeArray[i].nodeCircle.setDraggable(false);

	document.getElementById('createNodes').className = 'btn btn-primary menuButton';
	document.getElementById('createEdges').className = 'btn btn-info menuButton';
	document.getElementById('handTool').className = 'btn btn-info menuButton';
}
function createEdgeButtonClicked(){
	TO_CREATE_NODE = false;
	TO_CREATE_EDGE = true;
	HAND_TOOL_SELECTED = false;	
	for(i=0;i<nodeArray.length;i++)
		nodeArray[i].nodeCircle.setDraggable(false);

	document.getElementById('createNodes').className = 'btn btn-info menuButton';
	document.getElementById('createEdges').className = 'btn btn-primary menuButton';
	document.getElementById('handTool').className = 'btn btn-info menuButton';
}
function handToolButtonClicked(){
	TO_CREATE_NODE = false;
	TO_CREATE_EDGE = false;
	HAND_TOOL_SELECTED = true;
	for(i=0;i<nodeArray.length;i++)
		nodeArray[i].nodeCircle.setDraggable(true);

	document.getElementById('createNodes').className = 'btn btn-info menuButton';
	document.getElementById('createEdges').className = 'btn btn-info menuButton';
	document.getElementById('handTool').className = 'btn btn-primary menuButton';
}
function createNode(X, Y) {
	var circle = new Kinetic.Circle({
		x : X,
		y : Y,
		radius : RADIUS_OF_NODE,
		stroke : STROKE_COLOR_FOR_NODE,
		strokeWidth : 2,
		fill : COLOR_OF_NODE,
		draggable : false,
		name : 'node' + totalNodes
	});
	var node = {
		nodeCircle : circle,
		sourceEdges : new Array(),
		targetEdges : new Array(),
		selfLoops : new Array()

	}
	nodeArray.push(node);
	totalNodes++;
	circle.on('click', onCircleClicked);
	circle.on('tap',onCircleClicked);
	circle.on('dragstart',onCircleDragStart);
	circle.on('dragend', onCircleDragEnd);
	circle.on('dragmove', onCircleDragMove);
	layer.add(circle);
	layer.draw();

}
function onCircleClicked(evt) {
		//console.log('circleClicked');
		circleClicked = true;
		//evt.preventDefault();
		//evt.cancelBubble = true;   // not working ?  ???
		//evt.stopPropagation();   // not working ? ????
		if (toDrawEdge) {
			if (sourceIndex != Number(evt.targetNode.getName().slice(4))) {
				edgeIndex = createEdge(sourceNode.nodeCircle.getX(), sourceNode.nodeCircle.getY(), this.getX(), this.getY());
				nodeArray[Number(this.getName().slice(4))].targetEdges.push(edgeIndex);
				nodeArray[sourceIndex].sourceEdges.push(edgeIndex);
			} else {// draw a self loop
				selfLoopIndex = createSelfLoop(this.getX(), this.getY());
				nodeArray[sourceIndex].selfLoops.push(selfLoopIndex);
			}
			toDrawEdge = false;
		} else {
			toDrawEdge = true;
			sourceIndex = Number(evt.targetNode.getName().slice(4));
			sourceNode = nodeArray[sourceIndex];
		}
	}
function onCircleDragStart(evt){
		toDrawEdge = false;
		///remove afterwards
		if(HIGHLIGHT_WHILE_MOVE == false)
			return;
		index = Number(evt.targetNode.getName().slice(4));
		//index = Number(this.targetNode.getName().slice(4));
		var targetEdgesIndex = nodeArray[index].targetEdges;
		var sourceEdgesIndex = nodeArray[index].sourceEdges;
		var selfLoopIndex = nodeArray[index].selfLoops;
		for ( i = 0; i < targetEdgesIndex.length; i++) {
			edgeArray[targetEdgesIndex[i]].edgeLine.setStroke(TARGET_EDGE_COLOR);
		}
		for ( i = 0; i < sourceEdgesIndex.length; i++) {
			edgeArray[sourceEdgesIndex[i]].edgeLine.setStroke(SOURCE_EDGE_COLOR);
		}
		for (i=0; i < selfLoopIndex.length; i++){
			selfLoopArray[selfLoopIndex[i]].selfLoopSpline.setStroke(SELF_LOOP_COLOR);
		}
}
function onCircleDragEnd(evt){
		toDrawEdge = false;
		///remove afterwards
		if(HIGHLIGHT_WHILE_MOVE == false)
			return;
		index = Number(evt.targetNode.getName().slice(4));
		//index = Number(this.targetNode.getName().slice(4));
		var targetEdgesIndex = nodeArray[index].targetEdges;
		var sourceEdgesIndex = nodeArray[index].sourceEdges;
		var selfLoopIndex = nodeArray[index].selfLoops;
		for ( i = 0; i < targetEdgesIndex.length; i++) {
			edgeArray[targetEdgesIndex[i]].edgeLine.setStroke('black');
		}
		for ( i = 0; i < sourceEdgesIndex.length; i++) {
			edgeArray[sourceEdgesIndex[i]].edgeLine.setStroke('black');
		}
		for (i=0; i < selfLoopIndex.length; i++){
			selfLoopArray[selfLoopIndex[i]].selfLoopSpline.setStroke('black');
		}
		if(IS_DIRECTED_GRAPH)
			refreshDirectionArrows();
		
		layer.draw();
	}
function onCircleDragMove(evt){
		//console.log('circle Draging');
		toDrawEdge = false;
		///remove afterwards
		index = Number(evt.targetNode.getName().slice(4));
		//index = Number(this.targetNode.getName().slice(4));
		var targetEdgesIndex = nodeArray[index].targetEdges;
		var sourceEdgesIndex = nodeArray[index].sourceEdges;
		var selfLoopIndex = nodeArray[index].selfLoops;
		for ( i = 0; i < targetEdgesIndex.length; i++) {
			pointsArray = edgeArray[targetEdgesIndex[i]].edgeLine.getPoints();
			pointsArray[1].x = nodeArray[index].nodeCircle.getX();
			// here 1 because the target vertices would be at the 1st position and source on 0th postition
			pointsArray[1].y = nodeArray[index].nodeCircle.getY();
			edgeArray[targetEdgesIndex[i]].edgeLine.setPoints(pointsArray);
		}
		for ( i = 0; i < sourceEdgesIndex.length; i++) {
			pointsArray = edgeArray[sourceEdgesIndex[i]].edgeLine.getPoints();
			pointsArray[0].x = nodeArray[index].nodeCircle.getX();
			pointsArray[0].y = nodeArray[index].nodeCircle.getY();
			edgeArray[sourceEdgesIndex[i]].edgeLine.setPoints(pointsArray);
		}
		for (i=0; i < selfLoopIndex.length; i++){
			pointsArray = selfLoopArray[selfLoopIndex[i]].selfLoopSpline.getPoints();
			pointsArray[0].x = nodeArray[index].nodeCircle.getX();
			pointsArray[0].y = nodeArray[index].nodeCircle.getY();
			pointsArray[1].x = nodeArray[index].nodeCircle.getX()-25;
			pointsArray[1].y = nodeArray[index].nodeCircle.getY()-50;
			pointsArray[2].x = nodeArray[index].nodeCircle.getX()+25;
			pointsArray[2].y = nodeArray[index].nodeCircle.getY()-50;
			pointsArray[3].x = nodeArray[index].nodeCircle.getX();
			pointsArray[3].y = nodeArray[index].nodeCircle.getY();
			selfLoopArray[selfLoopIndex[i]].selfLoopSpline.setPoints(pointsArray);
		}
		if(IS_DIRECTED_GRAPH)
			refreshDirectionArrows();
		
		layer.draw();
	}
function createEdge(X1, Y1, X2, Y2) {

	var line = new Kinetic.Line({
		points : [X1, Y1, X2, Y2],
		stroke : 'black',
		strokeWidth : 2
	});
	var textBox =  new Kinetic.Text({
	 x:(X1+X2)/2,
	 y:(Y1+Y2)/2,
	 text:'12',
	 fill:'red',
	 fontSize:'20',
	 fontStyle:'bold'
	 }); 
	var edge = {
		edgeLine : line,
		weight : 0
	}
	edgeArray.push(edge);
	layer.add(line);
	//layer.add(textBox);
	line.setZIndex(0);
	//setZIndex will only work after the object is added to the layer
	//textBox.setZIndex(1);
	if(IS_DIRECTED_GRAPH)
		createDirectionTriangle(X1,Y1,X2,Y2);
	
	layer.draw();
	return totalEdges++;
}

function createSelfLoop(X1, Y1) {
	var spline = new Kinetic.Spline({
		points : [X1, Y1, X1 - 25, Y1 - 50, X1 + 25, Y1 - 50, X1, Y1],
		stroke : 'black',
		strokeWidth : 2
	});
	var loop = {
		selfLoopSpline : spline,
		weight : 0
	}
	selfLoopArray.push(loop);

	layer.add(spline);
	spline.setZIndex(0);
	if(IS_DIRECTED_GRAPH)
		createDirectionTriangle(X1,Y1,X1,Y1);	
	layer.draw();
		
	return totalSelfLoops++;
}
function refreshDirectionArrows(){
	arrowLayer.removeChildren();
	for(i=0 ;i < edgeArray.length;i++){
		pointsArray = edgeArray[i].edgeLine.getPoints();
		createDirectionTriangle(pointsArray[0].x,pointsArray[0].y,pointsArray[1].x,pointsArray[1].y,edgeArray[i].edgeLine.getStroke().toString());
	}
	for(i=0; i < selfLoopArray.length ; i++){
		pointsArray = selfLoopArray[i].selfLoopSpline.getPoints();
		createDirectionTriangle(pointsArray[0].x,pointsArray[0].y,pointsArray[0].x,pointsArray[0].y,selfLoopArray[i].selfLoopSpline.getStroke().toString())
	}
}
function createDirectionTriangle(sX,sY,tX,tY,arrowColor){
	if(typeof(arrowColor) === 'undefined')
		arrowColor = 'black';
	var angle;
	
	var arrowLine1 = new Kinetic.Rect({
		x:(sX+tX)/2,
		y:(sY+tY)/2,
		height:1,
		width:20,
		stroke:arrowColor,
		strokeWidth:1,
		fill:arrowColor,
		//offset: [50,0]		
	});
	var arrowLine2 = new Kinetic.Rect({
		x:(sX+tX)/2,
		y:(sY+tY)/2,
		height:1,
		width:20,
		stroke:arrowColor,
		strokeWidth:1,
		fill:arrowColor,
		//offset: [50,0]		
	});
	//console.log((sY-tY)/(tX-sX));
	if(sX == tX && sY == tY){    //to draw the direction on the self Loop
		arrowLine1.setY(arrowLine1.getY()-67);
		arrowLine2.setY(arrowLine2.getY()-67);
		arrowLine1.rotate(130*Math.PI/180);
		arrowLine2.rotate(-160*Math.PI/180);
	}
    else if(sX<=tX){
	angle = 5*Math.PI/6 - Math.atan((sY-tY)/(tX-sX));
	arrowLine1.rotate(angle);
	arrowLine2.rotate(angle+Math.PI/3);
	
	}
	else{
	//console.log(Math.atan((sY-tY)/(sX-tX)));
	angle =  Math.atan((sY-tY)/(sX-tX)) - Math.PI/6;
	arrowLine1.rotate(angle);
	arrowLine2.rotate(angle+Math.PI/3);
	}
	//layer.add(line);
	arrowLayer.add(arrowLine1);
	arrowLayer.add(arrowLine2);
	arrowLine1.setZIndex(0);
	arrowLine2.setZIndex(0);
	arrowLayer.draw();    
}


