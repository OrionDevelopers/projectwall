<!DOCTYPE html>
<html>
	<head>
		<title>Slide Presenter </title>
		<link href="css/slidePresenter.css" rel="stylesheet"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
		<script src="js/jquery-1.9.js" type="text/javascript"></script>
		<script src="js/kinetic-v4.4.1.js" type="text/javascript"></script>
		<script src="js/slidePresenter.js" type="text/javascript"></script>
	</head>
	<body onload="init();">
		<!-- <p id='debugHelper' >debugger</p> -->
		<div id='leftToolBar'>
			<a href='../../index.php'><button id='homeButton' class='myButton btn btn-info btn-large'>Home</button></a>
			<button id='penToolButton' class='myButton btn btn-info btn-large'>Pen</button>
			<button id='rectToolButton' class='myButton btn btn-info btn-large'>Rectangle</button>
			<!-- <button id='filledRectToolButton' class='myButton'>Filled Rectangle</button> -->
			<button id='focusToolButton' class='myButton btn btn-info btn-large'>Focus</button>
			<button id='eraserToolButton' class='myButton btn btn-info btn-large'>Eraser</button>
			<button id='clearToolButton' class='myButton btn btn-info btn-large'>Clear</button>
		    <button id='zoomIn' class='myButton btn btn-info btn-large'>Zoom In</button>
			<button id='zoomOut' class='myButton btn btn-info btn-large'>Zoom Out</button> 
			<button id='next' class='myButton btn btn-info btn-large'>Next</button>
			<button id='previous' class='myButton btn btn-info btn-large'>Previous</button>
			<!-- <button id='saveButton' class='myButton'>Save</button> -->

		</div>
		<div id='rightToolBar'>
			<div id='strokeWidth' class='submenu'>
				<button id='thin' class='submenuButton btn btn-primary btn-large' onclick="setStrokeWidth(2,this);">Thin</button>
				<button id='medium' class='submenuButton btn btn-info btn-large' onclick="setStrokeWidth(4,this);">Medium</button>
				<button id='thick' class='submenuButton btn btn-info btn-large' onclick="setStrokeWidth(7,this);">Thick</button>
				<button id='extraThick' class='submenuButton btn btn-info btn-large' onclick="setStrokeWidth(12,this)">extraThick</button>
			</div>
			<div id='strokeColor' class='submenu'>
				<button id='blueStroke' class='submenuButton btn btn-info btn-large' onclick="setStrokeColor('blue',this);">blueStroke</button>
				<button id='blackStroke' class='submenuButton btn btn-primary btn-large' onclick="setStrokeColor('black',this);">blackStroke</button>
				<button id='greenStroke' class='submenuButton btn btn-info btn-large' onclick="setStrokeColor('green',this);">greenStroke</button>
				<button id='redStroke' class='submenuButton btn btn-info btn-large' onclick="setStrokeColor('red',this);">redStroke</button>
			</div>
			<!-- <div id='fillColor' class='submenu'>

			</div> -->

		</div>
		<div id='container'></div>
	</body>
</html>