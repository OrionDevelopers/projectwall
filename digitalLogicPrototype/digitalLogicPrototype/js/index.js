var isTouchSupported = 'ontouchstart' in window;

var GRID_SIZE = 20;
var gateImageSrc = {
	AND:"images/gates/and.png",
	NAND:"images/gates/nand.png",
	OR:"images/gates/or.png",
	NOR:"images/gates/nor.png",
	XOR:"images/gates/xor.png",
	XNOR:"images/gates/xnor.png",
	NOT:"images/gates/not.png"
}

var containerHeight, containerWidth, containerX, containerY, layer, stage;
var drawWire = false;
var anchorSetArray = new Array();
var totalAnchorSet = 0;
var initialX, initialY;
var dragBoundFuncSet = false;
var gateArray = new Array();
var totalGates = 0;
var outputPanelArray = new Array();
var totalOutputPanel = 0;

function onBodyLoad() {
	containerHeight = document.getElementById('container').offsetHeight;
	containerWidth = document.getElementById('container').offsetWidth;
	// this is the way you obtain the rendered height and width
	// note object.style.height will not work as the height and width are rendered
	// with jQuery its simple : $('idOfObject').height
	containerX = document.getElementById('container').offsetLeft;
	containerY = document.getElementById('container').offsetTop;
	stage = new Kinetic.Stage({
		container : 'container',
		height : containerHeight,
		width : containerWidth
	});
	layer = new Kinetic.Layer();

	var x = GRID_SIZE;
	while (x < containerWidth) {
		var horizontalGridLine = new Kinetic.Line({
			points : [x, 0, x, containerHeight],
			stroke : 'gray',
			strokeWidth : 0.3
		});
		layer.add(horizontalGridLine);
		x += GRID_SIZE;
	}
	var y = GRID_SIZE;
	while (y < containerHeight) {
		var horizontalGridLine = new Kinetic.Line({
			points : [0, y, containerWidth, y],
			stroke : 'gray',
			strokeWidth : 0.3
		});
		layer.add(horizontalGridLine);
		y += GRID_SIZE;
	}

	//createGate();
	//createInputSource();
	stage.add(layer);

}

function createOutputPanel() {
	var outputPanelGroup = new Kinetic.Group({
		x : 20,
		y : 20,
		draggable : true,
		name : 'panel' + totalOutputPanel
	});
	var rect = new Kinetic.Rect({
		x : 0,
		y : 0,
		height : 40,
		width : 40,
		stroke : 'black',
		strokeWidth : 3,
		fill : 'silver'

	});
	var text = new Kinetic.Text({
		x : 15,
		y : 10,
		text : "",
		fontSize : 20,
		fill : 'blue',
		id : 'textBox' + totalOutputPanel
	})
	var line = new Kinetic.Line({
		points : [-40, 20, 0, 20],
		strokeWidth : 2,
		stoke : 'black'
	});
	outputPanelGroup.add(rect);
	outputPanelGroup.add(text);
	outputPanelGroup.add(line);
	outputPanelGroup.on('dragend', function(evt) {
		nearestJoint = getNearestJoint(this.getX(), this.getY());
		this.setX(nearestJoint.newX);
		this.setY(nearestJoint.newY);
		layer.draw();
	});
	outputPanelGroup.on('dblclick dbltap', function(evt) {     // 5/3/2013
		evt.preventDefault();
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else if (document.selection)
			document.selection.empty();
		
		outputPanelArray[Number(this.getName().slice(5))].anchorSetIndex = createWireAnchors(this.getX() - 40, this.getY() + 20, false, true, 'blue', true, 'normal');   // giving wire value as 1 for temp time

		this.setDraggable(false);    // 5/3/2013
		
	});
	var outputPanelObject = {
			outputPanelGroup : outputPanelGroup,
			anchorSetIndex : null,
			textBoxId : 'textBox' + totalOutputPanel,
			changeText : function(textId, newText) {
				stage.get('#'+textId)[0].setText(newText);
				layer.draw();
			}
		}
		outputPanelArray.push(outputPanelObject);
		totalOutputPanel++;

	layer.add(outputPanelGroup);
	layer.draw();
}

function createInputSource(mySourceValue) {
	var inputSourceGroup = new Kinetic.Group({
		x : 20,
		y : 20,
		draggable : true
	});
	var circle = new Kinetic.Circle({
		x : 20,
		y : 20,
		radius : 20,
		stroke : 'black',
		strokeWidth : 3,
		fill : 'silver'
	});
	var text = new Kinetic.Text({
		x:15,
		y:8,
		text:mySourceValue.toString(),
		fontSize:20,
		fill:'blue',
		name:'sourceText'
	})
	var line = new Kinetic.Line({
		points : [40, 20, 80, 20],
		stroke : 'black',
		strokeWidth : 3
	});
	inputSourceGroup.add(circle);
	inputSourceGroup.add(text);
	inputSourceGroup.add(line);
	inputSourceGroup.on('dblclick dbltap', function(evt) {    //5/3/2013
		evt.preventDefault();
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else if (document.selection)
			document.selection.empty();
		var groupId = createWireAnchors(this.getX() + 80, this.getY() + 20, false, true, 'black', false, 'source', mySourceValue);
		
		this.setDraggable(false);    // 3/5/2013
		this.setId(groupId.toString());   //5/5/2013

	});
	inputSourceGroup.on('dragend', function(evt) {
		nearestJoint = getNearestJoint(this.getX(), this.getY());
		this.setX(nearestJoint.newX);
		this.setY(nearestJoint.newY);
		layer.draw();
	});
	inputSourceGroup.on('click tap',function(evt){
		if(!this.getDraggable()){    //if the group is fixed then go for toggling the input on click
			if(anchorSetArray[Number(this.getId())].value) 
				anchorSetArray[Number(this.getId())].value=0;
			else
				anchorSetArray[Number(this.getId())].value=1;
			this.get('.sourceText')[0].setText(anchorSetArray[Number(this.getId())].value.toString());
			layer.draw();
		}
	});
	layer.add(inputSourceGroup);
	layer.draw();
}

function createGate(myGateType) {
	if(myGateType == 'NOT'){
		create_NOT_Gate(myGateType);
		return;
	}

	var gateGroup = new Kinetic.Group({
		x : 20,
		y : 20,
		draggable : true
	});
	var imgObject = new Image();
	imgObject.src =  gateImageSrc[myGateType];
	var img = new Kinetic.Image({
		x:0,
		y:0,
		image: imgObject,
		width:60,
		height:80
	});
	/*var gateRect = new Kinetic.Rect({
		width : 60,
		height : 80,
		//fill : 'silver'
	});*/
	var inputA = new Kinetic.Line({
		points : [-20, 20, 0, 20],
		strokeWidth : 2
	});
	var inputB = new Kinetic.Line({
		points : [-20, 60, 0, 60],
		strokeWidth : 2
	});
	var output = new Kinetic.Line({
		points : [60, 40, 80, 40],
		strokeWidth : 3
	})
	gateGroup.on('dragend', function() {
		newCoord = getNearestJoint(this.getX(), this.getY());
		this.setX(newCoord.newX);
		this.setY(newCoord.newY);
		layer.draw();
	});
	//gateGroup.add(gateRect);
	gateGroup.add(inputA);
	gateGroup.add(img);
	gateGroup.add(inputB);
	gateGroup.add(output);
	gateGroup.on('dblclick dbltap', function(evt) {   //5/3/2013
		evt.preventDefault();
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else if (document.selection)
			document.selection.empty();
		var gateInfo = {
			gateType : null,
			inputA : null,
			inputB : null,
			output : null
		}
		gateInfo.gateType = myGateType;
		/// consider all the gates are AND gate for the time being

		gateInfo.inputA = createWireAnchors(this.getX() - 20, this.getY() + 20, false, true);
		gateInfo.inputB = createWireAnchors(this.getX() - 20, this.getY() + 60, false, true);
		gateInfo.output = createWireAnchors(this.getX() + 80, this.getY() + 40, false, true, 'black', 'false', 'gate', -1, totalGates);
		gateArray.push(gateInfo);
		totalGates++;

		this.setDraggable(false);    // 5/3/2013
	});

	layer.add(gateGroup);
	layer.draw();
}
function create_NOT_Gate(myGateType){
	var gateGroup = new Kinetic.Group({
		x : 20,
		y : 20,
		draggable : true
	});
	var imgObject = new Image();
	imgObject.src =  gateImageSrc[myGateType];
	var img = new Kinetic.Image({
		x:0,
		y:0,
		image: imgObject,
		width:60,
		height:80
	});
	/*var gateRect = new Kinetic.Rect({
		width : 60,
		height : 80,
		//fill : 'silver'
	});*/
	var inputA = new Kinetic.Line({
		points : [-20, 40, 0, 40],
		strokeWidth : 2
	});
	// var inputB = new Kinetic.Line({
	// 	points : [-20, 60, 0, 60],
	// 	strokeWidth : 2
	// });
	var output = new Kinetic.Line({
		points : [60, 40, 80, 40],
		strokeWidth : 3
	})
	gateGroup.on('dragend', function() {
		newCoord = getNearestJoint(this.getX(), this.getY());
		this.setX(newCoord.newX);
		this.setY(newCoord.newY);
		layer.draw();
	});
	//gateGroup.add(gateRect);
	gateGroup.add(inputA);
	gateGroup.add(img);
	//gateGroup.add(inputB);
	gateGroup.add(output);
	gateGroup.on('dblclick dbltap', function(evt) {
		evt.preventDefault();
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else if (document.selection)
			document.selection.empty();
		var gateInfo = {
			gateType : null,
			inputA : null,
			inputB : null,
			output : null
		}
		gateInfo.gateType = myGateType;
		/// consider all the gates are AND gate for the time being

		gateInfo.inputA = createWireAnchors(this.getX() - 20, this.getY() + 40, false, true);
		//gateInfo.inputB = createWireAnchors(this.getX() - 20, this.getY() + 60, false, true);
		gateInfo.output = createWireAnchors(this.getX() + 80, this.getY() + 40, false, true, 'black', 'false', 'gate', -1, totalGates);
		gateArray.push(gateInfo);
		totalGates++;

		this.setDraggable(false);    // 5/3/2013
	});

	layer.add(gateGroup);
	layer.draw();
}

function createWireAnchors(X, Y, anchor1Visible, anchor2Visible, anchorColor, anchorDraggable, wireType, wireValue, gateIndex) {
	if ( typeof (anchorColor) === 'undefined')
		anchorColor = 'blue';
	if ( typeof (anchorDraggable) === 'undefined')
		anchorDraggable = true;
	if ( typeof (wireType) === 'undefined')
		wireType = 'normal';
	if ( typeof (wireValue) === 'undefined')
		wireValue = -1;
	if ( typeof (gateIndex) === 'undefined')
		gateIndex = -1;
	anchor1 = new Kinetic.Circle({
		x : X,
		y : Y,
		radius : 5,
		fill : anchorColor,
		visible : anchor1Visible,
		draggable : anchorDraggable,
		name : 'a_anchor' + totalAnchorSet,
		drawHitFunc: function(canvas) {
          var context = canvas.getContext();
          context.beginPath();
          context.arc(0, 0, this.getRadius() + 10, 0, Math.PI * 2, true);
          context.closePath();
          canvas.fillStroke(this);
        }
	});
	anchor2 = new Kinetic.Circle({
		x : X,
		y : Y,
		radius : 5,
		visible : anchor2Visible,
		fill : anchorColor,
		draggable : anchorDraggable,
		name : 'b_anchor' + totalAnchorSet,
		drawHitFunc: function(canvas) {
          var context = canvas.getContext();
          context.beginPath();
          context.arc(0, 0, this.getRadius() + 10, 0, Math.PI * 2, true);
          context.closePath();
          canvas.fillStroke(this);
        }
	});
	wire = new Kinetic.Line({
		points : [X, Y, X, Y],
		stroke : 'black',
		strokeWidth : 2,
		name : 'wire' + totalAnchorSet
	});
	var anchorSet = {
		anchor1 : null,
		anchor2 : null,
		getValueFromWireIndex : -1,
		attachedGateIndex : -1,
		type : null,
		value : null,
		wire : null,
		wireJunctions : []
	};
	anchorSet.anchor1 = anchor1;
	anchorSet.anchor2 = anchor2;
	anchorSet.attachedGateIndex = gateIndex;
	anchorSet.wire = wire;
	anchorSet.type = wireType;
	anchorSet.value = wireValue;

	anchorSetArray.push(anchorSet);

	layer.add(wire);
	layer.add(anchor1);
	layer.add(anchor2);
	layer.draw();
	anchor1.on('dragstart', commonDragStart);
	anchor2.on('dragstart', commonDragStart);
	anchor1.on('dragmove', commonDragMove);
	anchor2.on('dragmove', commonDragMove);
	anchor1.on('dragend', commonDragEnd);
	anchor2.on('dragend', commonDragEnd);

	return totalAnchorSet++;

}

function commonDragStart(evt) {
	//nearestJoint = getNearestJoint(stage.getMousePosition().x, stage.getMousePosition().y);
	nearestJoint = getNearestJoint(evt.targetNode.getX(),evt.targetNode.getY());
	initialX = nearestJoint.newX;
	initialY = nearestJoint.newY;

}

function commonDragMove(evt) {
	//changedX = stage.getMousePosition().x;
	//changedY = stage.getMousePosition().y;

	// changedX = evt.targetNode.getX();
	// changedY = evt.targetNode.getY();

	if(isTouchSupported)
		evt = evt.targetTouches[0];

	var coord = getX_Y(evt);
	changedX = coord.X;
	changedY = coord.Y;

	if (Math.abs(changedX - initialX) > Math.abs(changedY - initialY)) {
		evt.targetNode.setX(initialX + changedX > initialX ? changedX : -changedX);
		evt.targetNode.setY(initialY);

		evt.targetNode.setDragBoundFunc(function(pos) {
			return {
				x : pos.x,
				y : initialY
			}
		});
	} else {
		evt.targetNode.setX(initialX);
		evt.targetNode.setY(initialY + changedY > initialY ? changedY : -changedY);

		evt.targetNode.setDragBoundFunc(function(pos) {
			return {
				x : initialX,
				y : pos.y
			}
		})
	}
	var indexInAnchorSet = Number(evt.targetNode.getName().slice(8));
	var PointsArr = new Array();
	PointsArr = [anchorSetArray[indexInAnchorSet].anchor1.getX(), anchorSetArray[indexInAnchorSet].anchor1.getY(), anchorSetArray[indexInAnchorSet].anchor2.getX(), anchorSetArray[indexInAnchorSet].anchor2.getY()];
	anchorSetArray[indexInAnchorSet].wire.setPoints(PointsArr);
	layer.draw();
}

function commonDragEnd(evt) {
	//window.alert("getX = "+evt.targetNode.getX() +" getY = "+evt.targetNode.getY());
	nearestJoint = getNearestJoint(evt.targetNode.getX(), evt.targetNode.getY());

	evt.targetNode.setX(nearestJoint.newX);
	evt.targetNode.setY(nearestJoint.newY);
	evt.targetNode.setVisible(false);
	var indexInAnchorSet = Number(evt.targetNode.getName().slice(8));
	var PointsArr = new Array();
	PointsArr = [anchorSetArray[indexInAnchorSet].anchor1.getX(), anchorSetArray[indexInAnchorSet].anchor1.getY(), anchorSetArray[indexInAnchorSet].anchor2.getX(), anchorSetArray[indexInAnchorSet].anchor2.getY()];
	anchorSetArray[indexInAnchorSet].wire.setPoints(PointsArr);

	wireIndex = isJunctionCreated(indexInAnchorSet, nearestJoint.newX, nearestJoint.newY);
	//this wireIndex is the index of the wire on which the index is created
	if (wireIndex == -1) {
		anchorSetArray[indexInAnchorSet].getValueFromWireIndex = createWireAnchors(nearestJoint.newX, nearestJoint.newY, false, true);
	} else {
		createWireAnchors(nearestJoint.newX, nearestJoint.newY, false, true, 'black', false);
		// register the junction point along with the wireIndex
		anchorSetArray[indexInAnchorSet].wireJunctions.push(wireIndex);
		anchorSetArray[indexInAnchorSet].getValueFromWireIndex = wireIndex;
	}
	layer.draw();

}

function isJunctionCreated(indexToSkip, X, Y) {
	var i;
	for ( i = 0; i < totalAnchorSet; i++) {
		if (i == indexToSkip)
			continue;
		pointSet = anchorSetArray[i].wire.getPoints();
		if (pointSet[0].x == pointSet[1].x && pointSet[0].x == X) {
			if ((Math.abs(pointSet[0].y - pointSet[1].y) == (Math.abs(pointSet[0].y - Y) + Math.abs(pointSet[1].y - Y))))
				return i;
		} else if (pointSet[0].y == pointSet[1].y && pointSet[0].y == Y) {
			if ((Math.abs(pointSet[0].x - pointSet[1].x) == (Math.abs(pointSet[0].x - X) + Math.abs(pointSet[1].x - X))))
				return i;
		}
	}
	return -1;
}

function getNearestJoint(X, Y) {
	var nearestJoint = {
		newX : 0,
		newY : 0
	};
	xMod = Math.floor(X / 20);
	yMod = Math.floor(Y / 20);
	minX = xMod * 20;
	maxX = minX + 20;
	minY = yMod * 20;
	maxY = minY + 20;
	nearestJoint.newX = X - minX > maxX - X ? maxX : minX;
	nearestJoint.newY = Y - minY > maxY - Y ? maxY : minY;
	return nearestJoint;
}
function fillOutputPanel() {
	for ( i = 0; i < totalOutputPanel; i++) {
		newValue = getValueOfWire(outputPanelArray[i].anchorSetIndex)
		outputPanelArray[i].changeText(outputPanelArray[i].textBoxId, newValue.toString() );
	}
}

function getOutputAtGate(gateIndex) {
	var output;
	if ( typeof (gateIndex) === 'undefined')
		gateIndex = 0;
	console.log(gateArray[gateIndex].inputA);
	console.log(gateArray[gateIndex].inputB);
	if (gateArray[gateIndex].gateType == 'AND') {
		output = getValueOfWire(gateArray[gateIndex].inputA) & getValueOfWire(gateArray[gateIndex].inputB);
		//window.alert("output at gate : "+gateIndex+ " is " +output);
	}
	else if(gateArray[gateIndex].gateType == 'OR'){
		output = getValueOfWire(gateArray[gateIndex].inputA) | getValueOfWire(gateArray[gateIndex].inputB);
	}
	else if(gateArray[gateIndex].gateType == 'NAND'){
		if(getValueOfWire(gateArray[gateIndex].inputA) & getValueOfWire(gateArray[gateIndex].inputB))
			output=0;
		else
			output=1;
	}
	else if(gateArray[gateIndex].gateType == 'NOR'){
		if(getValueOfWire(gateArray[gateIndex].inputA) | getValueOfWire(gateArray[gateIndex].inputB))
			output=0;
		else
			output=1;
	}
	else if(gateArray[gateIndex].gateType == 'XOR'){
		output = getValueOfWire(gateArray[gateIndex].inputA) ^ getValueOfWire(gateArray[gateIndex].inputB)
	}
	else if(gateArray[gateIndex].gateType == 'XNOR'){
		if(getValueOfWire(gateArray[gateIndex].inputA) ^ getValueOfWire(gateArray[gateIndex].inputB))
			output=0;
		else
			output=1;
	}
	else if(gateArray[gateIndex].gateType == 'NOT'){
		if(getValueOfWire(gateArray[gateIndex].inputA) == 0)    //only inputA is defined for the NOT gate
			output = 1;
		else
			output = 0;
	}

	return output;
}

function getValueOfWire(wireIndex) {
	wireType = anchorSetArray[wireIndex].type;
	console.log(wireType);
	value = anchorSetArray[wireIndex].value;
	if (wireType == 'normal' && value == -1) {
		if (anchorSetArray[wireIndex].getValueFromWireIndex != -1)
			return getValueOfWire(anchorSetArray[wireIndex].getValueFromWireIndex);
		else
			window.alert("Error detected at wireIndex = " + wireIndex);
	} else if (wireType == 'gate') {
		console.log("attachedGate = " + anchorSetArray[wireIndex].attachedGateIndex);
		return getOutputAtGate(anchorSetArray[wireIndex].attachedGateIndex)
	} else {
		//window.alert("returning : "+value);
		return value;
	}

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
