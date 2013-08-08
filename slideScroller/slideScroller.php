<!DOCTYPE html>
<html>
<head>
<title>Slide Scroller</title>
<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
<link rel="stylesheet" type="text/css" href="css/slideScroller.css">
<script src="js/kinetic-v4.4.1.js" type="text/javascript"></script>
<script type="text/javascript" src="js/slideScroller.js"></script>


</head>
<body onload="onBodyLoad();">
	<div id='wrapper'>
		<!-- <div id='leftMenuBar'>
			<div id='previousButton' class='menuButton' >Previous</div>
		</div>
		<div id='rightMenuBar'>
			<div id='nextButton' class='menuButton'>Next</div>
		</div> -->

		<div id='buttonWrapper'><a href='../index.php'><button class='btn btn-large btn-primary'>Home</button></a></div>
		<div id='container'></div>
		<div id='selectionWrapper'>
			<div id='shaderWindow'></div>
			<div id='selectionWindow'>
				<div id='thumbnailContainer'>
					
				</div>
			</div>
		</div>
	</div>
</body>

</html>