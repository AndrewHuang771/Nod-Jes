var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
c.width = 1400;
c.height = 800;

var widthblocks = Math.floor(c.width/20);
var heightblocks = Math.floor(c.height/20);

var map = [];

for (var i = 0; i < heightblocks; i++) {
	var row = [];
	for (var j = 0; j < widthblocks; j++) {
		if (Math.random() < 0.07) {
			row.push(1);
		} else {
			row.push(0);
		}

	}
	map.push(row);
}

for (var i = 0; i < widthblocks; i++) {
	map[heightblocks-1][i] = 0;
	map[heightblocks-2][i] = 1;
	map[heightblocks-3][i] = 0;
	map[heightblocks-4][i] = 0;
}

map[heightblocks-2][5] = 0;
map[heightblocks-2][6] = 0;
map[heightblocks-3][10] = 1;
map[heightblocks-3][20] = 1;

console.log(map);

var Entity = function() {
	var self = {};
	self.x = 12;
	self.y = heightblocks-2;
	self.height = 1.5;
	self.width = 1;

	self.maxSpeedX = 1;
	self.dx = 0;
	self.ddx = 0.0025;
	self.maxSpeedY = 0.5;
	self.dy = 0.03;
	self.ddy = 0.04;

	self.falling = false;
	self.onGround = true;
	self.stopped = false;

	self.draw = function() { ctx.fillRect((self.x)*20, (self.y-self.height)*20, self.width*20, self.height*20);	}

	self.gravity = function() {self.y -= self.dy;self.dy -= self.ddy;}
	self.terminalVelocity = function() {
		if (self.dy > self.maxSpeedY) self.dy = self.maxSpeedY;
		else if (self.dy < -self.maxSpeedY) self.dy = -self.maxSpeedY;
	}

	self.move = function() {
		if(self.pressingleft || self.pressingright){
			if (self.pressingleft) {

				if(self.stopped){
					self.dx = -0.40;
				}

				self.x += self.dx;

				if(self.dx > -0.45){
					self.dx += self.ddx;
				} 

				if(self.ddx > -0.009){
					self.ddx -= 0.012;
				}
				self.stopped = false;
				console.log(self.dx);
				console.log(self.ddx);
			}
			else if (self.pressingright) {

				if(self.stopped){
					self.dx = 0.40;
				}

				self.x += self.dx; 

				if(self.dx < 0.45){
					self.dx += self.ddx;
				} 

				if(self.ddx < 0.009){
					self.ddx += 0.012;
				}
				self.stopped = false;
				console.log(self.dx);
				console.log(self.ddx);
			}
		}
		else{
			self.ddx = 0;
			self.dx = 0;
			self.stopped = true;
		}

	}
	// self.maxSpeed = function() {
 //    	if (self.dx > self.maxSpeedX) 
 //    		self.dx = self.maxSpeedX;
	// 	else if (self.dx < -self.maxSpeedX) 
	// 		self.dx = -self.maxSpeedX;
	// }

	self.jump = function() {
		if (self.pressingjump) {
			if (self.jumpUsed && !self.doubleJumpUsed && self.tempJumpTracker) {
				self.dy = 0.6;
				self.doubleJumpUsed = true;
			}

			if (self.onGround) {
				self.dy = 0.8; //should make this lower or terminal velocity higher because it passes terminal velocity
				self.jumpUsed = true;
			}
		} else {
			if (!self.onGround) {
				self.tempJumpTracker = true;
			}
		}
	}

	self.isFalling = function() {
		self.dy > 0 ? self.falling=false : self.falling=true;
	}

	self.checkVerticalCollision = function() {

		for (var i = Math.floor(self.x); i < Math.ceil(self.x+self.width); i++) {

			self.onGround = false;
			if (self.falling) {
				if (map[Math.floor(self.y)][i] === 1) {
					self.y = Math.floor(self.y);
					self.dy = 0;
					self.onGround = true;
					self.jumpUsed = false;
					self.doubleJumpUsed = false;
					self.tempJumpTracker = false;
					break;
				}
			} else {
				if (map[Math.ceil(self.y-self.height)-1][i] === 1) {
					self.dy = 0;
					self.y = (Math.ceil(self.y-self.height))+self.height;
					break;
				}
			}

		}
	}

	self.checkHorizontalCollision = function() {

		for (var i = Math.floor(self.y-self.height); i < Math.ceil(self.y); i++) {
			//Left
			if (map[i][Math.floor(self.x)] === 1) {
				self.x = Math.ceil(self.x);
				self.dx = 0;
          		self.ddx = 0.0025;
          		console.log("HIT");
			}
			//Right
			if (map[i][Math.ceil(self.x+self.width-1)] === 1) {
				self.x = Math.ceil(self.x+self.width-1)-self.width;
				self.dx = 0;
        		self.ddx = -0.0025;
			}
		}
	}

	return self;
}

var Player = function() {
	var self = Entity();
	self.pressingjump = false;
	self.pressingleft = false;
	self.pressingright = false;
	self.jumpUsed = false;
	self.doubleJumpUsed = false;
	self.tempJumpTracker = false;

	self.update = function() {
		self.gravity();
		self.isFalling();
		self.checkVerticalCollision();
		self.terminalVelocity();

		self.jump();
		self.move();
		self.checkHorizontalCollision();
	}
	return self;
}

var Andrew = new Player();

function drawmap() {
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			if (map[i][j] === 1) {
				ctx.fillRect(j*20, i*20, 20, 20);
			}
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, 1400, 800);
	drawmap();
	Andrew.update();
	Andrew.draw();
}

animate();
