<?php
	// requires php5
	define('UPLOAD_DIR', 'slides/UNIT1/');
	$img = $_POST['img'];
	$fileName = $_POST['fileName'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . $fileName . '.png';
	$success = file_put_contents($file, $data);
	//print $success ? $file : 'Unable to save the file.';
?>