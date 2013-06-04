/* 
Original Tutorial:
	https://github.com/sebleedelisle/JSTouchController
	Copyright (c)2010-2011, Seb Lee-Delisle, sebleedelisle.com
	All rights reserved.
	
Controls:
- Swipe

*/




var canvas; //canvas
var ctx; //context
var touchable = 'createTouch' in document; //check of the touch screen
var touches = [];
var x; //x position of the finger
var y; //y position of the finger
var fingerOnTheScreen = false;
var snakeBodyX = []; //arrays with body cell objects
var snakeBodyY = [];
var snakeDirectionX = 0; //initial direction
var snakeDirectionY = -10;
var snakeDirection; //one word represenattion of the direction
var snakeLength = 3;
var foodX; //position of the food
var foodY;
var ate = true;
var score = -1;
var pause = false;


setInterval(draw, 1000/40);
setInterval(dir, 1000/16);

if (!touchable) {
alert('You are not using a tablet, please buy one to play this game');	location.assign('http://www.apple.com/');
}

function pauseGame() {
	pause = true;
	document.getElementById('pause').style.display = 'none';
	document.getElementById('start').style.display = 'block';
}

function startGame() {
	pause = false;
	document.getElementById('pause').style.display = 'block';
	document.getElementById('start').style.display = 'none';
	setTimeout(runGame, 1000/8);
}

function setup() {
	snakeBodyX[0] = 500;
	snakeBodyY[0] = 400;
	//alert(snakeBodyX[0]+' '+snakeBodyY[0]);
	for (var i = 1; i < snakeLength; i++) {
		snakeBodyY[i] = snakeBodyY[i-1] - 10;
	};
	
	var container = document.getElementById('container');
	canvas = document.getElementById('canvas');
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	
	if (touchable) {
	canvas.addEventListener( 'touchstart', onTouchStart, false );
	canvas.addEventListener( 'touchmove', onTouchMove, false );
	canvas.addEventListener( 'touchend', onTouchEnd, false );
	
	}
	
	document.body.addEventListener('touchmove', function(event){event.preventDefault();}, false);
	
};


function drawField() {
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#3FF';
	ctx.strokeRect(300,140,450,300);
	
}

function draw() { //only for touch an field
  
	ctx.clearRect(0,0,canvas.width,139);
	ctx.clearRect(0,0,299,canvas.height);
	ctx.clearRect(0,441,canvas.width,canvas.height);
	ctx.clearRect(751,0,300,canvas.height);
		
		if (fingerOnTheScreen) {
		ctx.beginPath(); 
		ctx.strokeStyle = "#3FF";
		ctx.lineWidth = "3";
		ctx.arc(x, y, 55, 0, Math.PI*2, true); 
		ctx.stroke();
		}
	
		for(var i=0; i<touches.length; i++)
		{
			var touch = touches[i]; 
			//ctx.beginPath(); 
			//ctx.fillStyle = "white";
			//ctx.fillText("touch id : "+touch.identifier+" x:"+touch.clientX+" y:"+touch.clientY, touch.clientX+30, touch.clientY-30); 
			

			ctx.beginPath(); 
			ctx.strokeStyle = "#3FF";
			ctx.lineWidth = "6";
			ctx.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true); 
			ctx.stroke();
			
		}
		
	drawField();
}

function setCoordinates() {
	x = touches[0].clientX;
	y = touches[0].clientY;
}

function getDirection() { //converts numbers into word direction
	var dX = touches[0].clientX-x;
	var dY = touches[0].clientY-y;
	//alert(dX+' '+dY);
	if (Math.abs(dX) > 25 || Math.abs(dY) > 25) {
		if (Math.abs(dX) > Math.abs(dY) && dX > 0 && snakeDirectionX != -10) {
			//alert('right'); snakeDirection is check to prevent reverse movement
			snakeDirectionX = 10;
			snakeDirectionY = 0;
			snakeDirection = 'right';
			return; //returns are for immidiate change without delay
		} else if (Math.abs(dX) > Math.abs(dY) && dX < 0 && snakeDirectionX != 10) {
			//alert('left');
			snakeDirectionX = -10;
			snakeDirectionY = 0;
			snakeDirection = 'left';
			return;
		} else if (Math.abs(dX) < Math.abs(dY) && dY < 0 && snakeDirectionY != 10) {
			//alert('top');
			snakeDirectionX = 0;
			snakeDirectionY = -10;
			snakeDirection = 'top';
			return;
		} else if (Math.abs(dX) < Math.abs(dY) && dY > 0 && snakeDirectionY != -10) {
			//alert('bottom');
			snakeDirectionX = 0;
			snakeDirectionY = 10;
			snakeDirection = 'bottom';
			return;
		}
	} else {
		return;
	}
}

function onTouchStart(e) {
	touches = e.touches;
	fingerOnTheScreen = true;
	if (touches.length == 1) {
		setCoordinates();
	}
}

function onTouchEnd(e) {
	touches = e.touches;
	if (touches.length == 0) {
		fingerOnTheScreen = false;
	} else if (touches.length == 1) {
		setCoordinates();
	}
}

function onTouchMove(e) {
	touches = e.touches;
}





//snake physics starts here
function dir() {
	if (fingerOnTheScreen) {
		getDirection();
	}
}

function runGame() {
	
	ctx.clearRect(301,141,448,298);
	
	snakeBodyX[0] += snakeDirectionX;
	snakeBodyY[0] += snakeDirectionY;
	
	drawPoint();
	drawFood();
	
	checkDinner();
	
	if (ate) {
		dropFood();
		score++;
		ate = false;
	}
	
	if (pause == true) {
		clearTimeout(runGame);
		return;
	}
	
	if (checkCollision() || checkBoundaries()) {
		//checks for losing events and stops execution
		alertBox(score);
		clearTimeout(runGame);
		return;
	}
	
	setTimeout(runGame, 1000/8);
}

//end of the main function

function drawPoint() {
	
	ctx.fillStyle="#3FF";
	ctx.fillRect(snakeBodyX[0],snakeBodyY[0],10,10) 
            // draw black boundary
	ctx.lineWidth = 1;
	ctx.strokeStyle="#000";
	ctx.strokeRect(snakeBodyX[0],snakeBodyY[0],10,10);
	
	
	for (var i = snakeLength; i > 0; i--) {
		snakeBodyX[i] = snakeBodyX[i-1];
		snakeBodyY[i] = snakeBodyY[i-1];
		ctx.fillStyle="#3FF";
	ctx.fillRect(snakeBodyX[i],snakeBodyY[i],10,10) 
            // draw black boundary
	ctx.lineWidth = 1;
	ctx.strokeStyle="#000";
	ctx.strokeRect(snakeBodyX[i],snakeBodyY[i],10,10);
	};
}

function checkCollision() {
	for (var i = 2; i < snakeLength; i++) {
		if (snakeBodyX[0] == snakeBodyX[i] && snakeBodyY[0] == snakeBodyY[i]) {
			return true;
		}
	}
}

function checkBoundaries() {
	if (snakeBodyX[0] < 300 || snakeBodyX[0] > 740) {
		return true;
	} else if (snakeBodyY[0] < 140 || snakeBodyY[0] > 430) {
		return true;
	}
}

function checkDinner() {
	if (snakeBodyX[0] == foodX && snakeBodyY[0] == foodY) {
		snakeLength++;
		ate = true;
	}
}

function dropFood() {
	foodX = Math.floor((Math.random()*44)+0)*10+300;
	foodY = Math.floor((Math.random()*29)+0)*10+140;
	//alert(foodX+' '+foodY);
}

function drawFood() {
	ctx.fillRect(foodX,foodY,10,10) 
            // draw black boundary
	ctx.lineWidth = 1;
	ctx.strokeStyle="#000";
	ctx.strokeRect(foodX,foodY,10,10);
}

//alert when lost
function alertBox(score) {
	var blanket = document.getElementById('blanket');
	var box = document.getElementById('alertBox');
	var button = document.getElementById('abButton');
	var topContent = document.getElementById('abTop');
	var mainContent = document.getElementById('abContent');
	var w = window.innerWidth/2;
	var h = 150;
	
	blanket.style.display = 'block';
	box.style.display = 'block';
	button.style.display = 'block';
	topContent.style.display = 'block';
	mainContent.style.display = 'block';
	
	box.style.width = 250 + 'px';
	box.style.height = 150 + 'px';
	
	box.style.top = h + 'px';
	box.style.left = w - 125 + 'px';
	
	score = score.toString();
	topContent.innerText = 'GAME OVER';
	mainContent.innerText = 'YOUR SCORE IS: ' + score;
	document.getElementById('abButtonContent').innerText = 'OK';
	
}
