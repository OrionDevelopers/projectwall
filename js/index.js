var img1,img2,imgHeight,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12;
function bodyInit(){
//for graph	
    img1 = document.getElementById('graph1');
	img2 = document.getElementById('graph2');
	imgHeight = img1.offsetHeight;
        img2.style.visibility="hidden";
	img2.style.top = imgHeight.toString()+'px';
        window.setInterval(animate,2000);
        //window.setTimeout(function(){animate();},2000);
//        animate();

//for coordinate
img3 = document.getElementById('coordinate1');
	img4 = document.getElementById('coordinate2');
	imgHeight = img3.offsetHeight;
        img4.style.visibility="hidden";
	img4.style.top = imgHeight.toString()+'px';
    window.setTimeout(makeDelay,1333);
    
    //for slide presenter
    img5 = document.getElementById('slidePresenter1');
	img6 = document.getElementById('slidePresenter2');
	imgHeight = img5.offsetHeight;
        img6.style.visibility="hidden";
	img6.style.top = imgHeight.toString()+'px';
    window.setTimeout(makeDelay1,1666);
    //for digital logic
     img7 = document.getElementById('digitalLogic1');
	img8 = document.getElementById('digitalLogic2');
	imgHeight = img7.offsetHeight;
        img8.style.visibility="hidden";
	img8.style.top = imgHeight.toString()+'px';
    window.setTimeout(makeDelay2,1450);
    //for STA
     img9 = document.getElementById('smartTeachingAssitant1');
	img10 = document.getElementById('smartTeachingAssitant2');
	imgHeight = img9.offsetHeight;
        img10.style.visibility="hidden";
	img10.style.top = imgHeight.toString()+'px';
    window.setTimeout(makeDelay3,1800);
    //for kinetic simlator
     img11 = document.getElementById('KinematicsScreenShot1');
	img12 = document.getElementById('KinematicsScreenShot2');
	imgHeight = img11.offsetHeight;
        img12.style.visibility="hidden";
	img12.style.top = imgHeight.toString()+'px';
    window.setTimeout(makeDelay4,1100);
}
function makeDelay(){
    console.log(" in makeDelay");
     window.setInterval(animate1,2000);
}
function makeDelay1(){
    console.log(" in makeDelay");
     window.setInterval(animate2,2000);
}
function makeDelay2(){
    console.log(" in makeDelay");
     window.setInterval(animate3,2000);
}
function makeDelay3(){
    console.log(" in makeDelay");
     window.setInterval(animate4,2000);
}
function makeDelay4(){
    console.log(" in makeDelay");
     window.setInterval(animate5,2000);
}
function animate(){
    img2.style.visibility="visible";
	console.log(imgHeight.toString()+"omsai");
        //console.log(img1.style.getAttribute('top'));
	if(img1.offsetTop == 0){
                console.log('inside');
		img1.style.top = (-imgHeight).toString()+'px';
		//img1.style.top = '-85px';
                img2.style.top= '0px';
	}
	else{
		img1.style.top = '0px';
		img2.style.top = imgHeight.toString()+'px';	
	}
}
function animate1(){
    img4.style.visibility="visible";
	console.log(imgHeight.toString()+"omsai");
        //console.log(img1.style.getAttribute('top'));
	if(img3.offsetTop == 0){
                console.log('inside');
		img3.style.top = (-imgHeight).toString()+'px';
		//img1.style.top = '-85px';
                img4.style.top= '0px';
	}
	else{
		img3.style.top = '0px';
		img4.style.top = imgHeight.toString()+'px';	
	}
}
function animate2(){
    img6.style.visibility="visible";
	console.log(imgHeight.toString()+"omsai");
        //console.log(img1.style.getAttribute('top'));
	if(img5.offsetTop == 0){
                console.log('inside');
		img5.style.top = (-imgHeight).toString()+'px';
		//img1.style.top = '-85px';
                img6.style.top= '0px';
	}
	else{
		img5.style.top = '0px';
		img6.style.top = imgHeight.toString()+'px';	
	}
}
function animate3(){
    img8.style.visibility="visible";
	console.log(imgHeight.toString()+"omsai");
        //console.log(img1.style.getAttribute('top'));
	if(img7.offsetTop == 0){
                console.log('inside');
		img7.style.top = (-imgHeight).toString()+'px';
		//img1.style.top = '-85px';
                img8.style.top= '0px';
	}
	else{
		img7.style.top = '0px';
		img8.style.top = imgHeight.toString()+'px';	
	}
}
function animate4(){
    img10.style.visibility="visible";
	console.log(imgHeight.toString()+"omsai");
        //console.log(img1.style.getAttribute('top'));
	if(img9.offsetTop == 0){
                console.log('inside');
		img9.style.top = (-imgHeight).toString()+'px';
		//img1.style.top = '-85px';
                img10.style.top= '0px';
	}
	else{
		img9.style.top = '0px';
		img10.style.top = imgHeight.toString()+'px';	
	}
}
function animate5(){
    img12.style.visibility="visible";
	console.log(imgHeight.toString()+"omsai");
        //console.log(img1.style.getAttribute('top'));
	if(img11.offsetTop == 0){
                console.log('inside');
		img11.style.top = (-imgHeight).toString()+'px';
		//img1.style.top = '-85px';
                img12.style.top= '0px';
	}
	else{
		img11.style.top = '0px';
		img12.style.top = imgHeight.toString()+'px';	
	}
}

