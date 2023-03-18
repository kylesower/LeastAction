var x1 = -200;
var y1 = 0;
var vx1 = 0;
var vy1 = -15;
var m1 = 10;

var x2 = 200;
var y2 = 0;
var vx2 = 0;
var vy2 = 10;
var m2 = 10;

var x3 = 0;
var y3 = -200;
var vx3 = 20;
var vy3 = 5;
var m3 = 10;

var x4 = 0;
var y4 = 200;
var vx4 = -20;
var vy4 = 0;
var m4 = 10;
var steps_per_frame = 40;

var dt = 0.001;
var G = 50;

function setup() {
	width = Math.min(Math.min(windowWidth, windowHeight)*15/16, 800);
  	height = width;
  	rad = width/200;
  	createCanvas(width, height);
  	frameRate(60);
  	b1 = new body(x1, y1, vx1, vy1, m1, 0);
  	b2 = new body(x2, y2, vx2, vy2, m2, 1);
  	b3 = new body(x3, y3, vx3, vy3, m3, 2);
  	b4 = new body(x4, y4, vx4, vy4, m4, 3);
  	bodies = [b1, b2, b3, b4];
}


function draw() {
	background(51);
	for (let j = 0; j < steps_per_frame; j++){
		for (let i = 0; i < bodies.length; i++) {
			bodies[i].calc_forces(bodies)
			bodies[i].update();
			
			//console.log(bodies[i].x, bodies[i].y);
		}
	}
	for (let i = 0; i < bodies.length; i++) {
		bodies[i].show();
	}
	center = center_mass_vel();
	fill(0,100,0);
	circle(center[0], center[1], 10);
	fill(100,0,0);
	circle(center[2], center[3], 10);
	console.log(center[2], center[3]);
}

function center_mass_vel() {
	numx = 0;
	numy = 0;
	numvx = 0;
	numvy = 0;
	den = 0;
	
	for (let i=0; i<bodies.length; i++){
		numx += bodies[i].x * bodies[i].m;
		numy += bodies[i].y * bodies[i].m;
		numvx += bodies[i].vx * bodies[i].m;
		numvy += bodies[i].vy * bodies[i].m;
		den += bodies[i].m;
	}

	return [numx/den, numy/den, numvx/den + width/2, numvy/den + width/2];
}


function body(x, y, vx, vy, m, num) {
	this.x = x + width/2;
	this.y = y + height/2;
	this.vx = vx;
	this.vy = vy;
	this.m = m;
	this.num = num;
	this.rad = rad*Math.sqrt(this.m);
	this.ax = 0;
	this.ay = 0;

	this.calc_forces = function(bodies) {
		this.ax = 0;
		this.ay = 0;
		for (let i = 0; i < bodies.length; i++){
			if (i != num) {
				r = Math.sqrt((bodies[i].x - this.x)**2 + (bodies[i].y - this.y)**2);
				this.ax += G*bodies[i].m/r**2*(bodies[i].x - this.x);
				this.ay += G*bodies[i].m/r**2*(bodies[i].y - this.y);
			}	
		}
	}

	this.update = function() {
		this.vx = this.vx + this.ax*dt;
		this.vy = this.vy + this.ay*dt;
		this.x = this.x + this.vx*dt;
		this.y = this.y + this.vy*dt;
	}

	this.show = function() {
		fill(255);
		circle(this.x, this.y, this.rad);
	}
}