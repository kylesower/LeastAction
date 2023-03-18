var dt = 0.08;
var theta1_init = 4.67442176204;
var w1_init = -1.0658286605;
var theta2_init = 0;
var w2_init = -0.9959932864;
var theta1_input;
var omega1_input;
var l1_input;
var theta2_input;
var omega2_input;
var l2_input;
var play_animation = false;
var l1 = 30;
var l2 = 30;
var g = 9.8;
var m1 = .5;
var m2 = .5;
var T;
var U;
var E;
var method = "rk4";
var plot_t = true;
var plot_w = true;

function plot_t_box_update(cb) {
  for (let i=0; i<num; i++) {
    t1array[i] = (p.theta1 + Math.PI) % (2*Math.PI)*tscale + offset;
    t2array[i] = (p.theta2 + Math.PI) % (2*Math.PI)*tscale + offset;
  }
  plot_t = cb.checked;
}

function plot_w_box_update(cb) {
  for (let i=0; i<num; i++) {
    w1array[i] = (p.w1+wmax)*wscale + offset;
    w2array[i] = (p.w2+wmax)*wscale + offset;
  }
  plot_w = cb.checked;
}

function calc_w_scale(p){
	E = calc_E(p);
	//console.log("E");
	//console.log(E);
	Umax = (p.m1+p.m2)*g*p.l_input1+p.m2*g*p.l_input2;
	//console.log("Umax");
	//console.log(Umax);
	w1max = sqrt((E+Umax)/(1/2*p.m1*p.l_input1**2)); // if w2 = 0 and all energy is kinetic
	w2max = sqrt((E+Umax)/(1/2*p.m2*p.l_input2**2)); //if w1 = 0 and all energy is kinetic
	//console.log("wmax");
	//console.log(w1max, w2max)*1.1;
	return max(w1max, w2max)*1.1; // add a cheat factor because I'm lazy and it wasn't quite working
}

function setup() {
  width = Math.min(Math.min(windowWidth, windowHeight)*15/16, 800);
  height = width;
  rad = width/100;
  createCanvas(width, height);
  w1array = [];
  w2array = [];
  t1array = [];
  t2array = [];
  num = 1000;
  
  tscale = width/(2*Math.PI);
  offset = 0;//width/8;

  p = new pend(theta1_init, w1_init, l1, m1, theta2_init, w2_init, l2, m2);
  wmax = calc_w_scale(p);
  wscale = width/(2*wmax);
  console.log("wmax");
  console.log(wmax);
  frameRate(60);
  document.getElementById("theta1").value = theta1_init;
  document.getElementById("omega1").value = w1_init;
  document.getElementById("l1").value = l1;
  document.getElementById("m1").value = m1;
  document.getElementById("theta2").value = theta2_init;
  document.getElementById("omega2").value = w2_init;
  document.getElementById("l2").value = l2;
  document.getElementById("m2").value = m2;
  document.getElementById("g").value = g;
  document.getElementById("plot_t").checked = true;
  document.getElementById("plot_w").checked = true;
  for (let i=0; i<num; i++) {
    w1array[i] = (p.w1+wmax)*wscale + offset;
    w2array[i] = (p.w2+wmax)*wscale + offset;
    t1array[i] = (p.theta1 + Math.PI) % (2*Math.PI)*tscale + offset;//p.theta1*tscale + offset;
    t2array[i] = (p.theta2 + Math.PI) % (2*Math.PI)*tscale + offset;//p.theta2*tscale + offset;
  }
}

function tmap(theta){
	// Assuming theta goes from 0 to 2pi
	// and we want to remap it so that 0 and 2pi are both in the middle of the range
}

function calc_E(p){
  T = (p.m1 + p.m2)/2*(p.l_input1**2*p.w1**2)+p.m2*p.l_input1*p.l_input2*p.w1*p.w2*Math.cos(p.theta1-p.theta2)+p.m2/2*p.l_input2**2*p.w2**2;
  U = (p.m1+p.m2)*g*p.l_input1*(1-Math.cos(p.theta1))+p.m2*g*p.l_input2*(1-Math.cos(p.theta2));
  return T+U
}

function mousePressed() {
  //Do stuff if mouse pressed
}

function draw_words(color){
  stroke(color)
}

function draw() {
  background(51);
  for ( let i = 1; i < num; i++ ) {
    w1array[i - 1] = w1array[i];
    w2array[i - 1] = w2array[i];
    t1array[i - 1] = t1array[i];
    t2array[i - 1] = t2array[i];
  }

  if(play_animation){
    p.update();
    w1array[num - 1] = (p.w1+wmax)*wscale + offset;
    w2array[num - 1] = (p.w2+wmax)*wscale + offset;
    t1array[num - 1] = (p.theta1 + Math.PI) % (2*Math.PI)*tscale + offset;//p.theta1*tscale + offset;
    t2array[num - 1] = (p.theta2 + Math.PI) % (2*Math.PI)*tscale + offset;//p.theta2*tscale + offset;
    if(plot_w){
      for ( let j = 1; j < num; j++ ) {
        val = j / num * 204.0;
        stroke(0, 100, 250, val);
        line(w1array[j - 1], w2array[j - 1], w1array[j], w2array[j]);
      }
      fill(0, 100, 250, 10);
      text("\u03C9", 10, 40);
    }
    if(plot_t){
      for ( let j = 1; j < num; j++ ) {
        val = j / num * 204.0;
        stroke(0, 250, 100, val);
        if (abs(t1array[j-1] - t1array[j]) < 100 && abs(t2array[j-1] - t2array[j]) < 100){
          line(t1array[j - 1], t2array[j - 1], t1array[j], t2array[j]);
        }
      }
      fill(0, 250, 100, 10);
      text("\u03D1", 10, 20);
    }
    //console.log(p.theta1);
    //console.log(p.theta2);
    //stroke('blue');
    //strokeWeight(4);
    //console.log(50+p.w1*100);
    //console.log(50+p.w2*100);
    //point(50+p.w1*100, 50+p.w2*100);
    //E = calc_E(p);
    //console.log(E);
    if (abs(p.w1) > wmax || abs(p.w2) > wmax){
    	console.log(p.w1);
    	console.log(p.w2);
	}
  }
  p.show()

  //console.log(p1.theta);

}

function stop_running(){
	play_animation = false;
	document.getElementById("theta1").value = p.theta1;
	document.getElementById("omega1").value = p.w1;
	document.getElementById("l1").value = p.l_input1;
  	document.getElementById("m1").value = p.m1;
	document.getElementById("theta2").value = p.theta2;
	document.getElementById("omega2").value = p.w2;
	document.getElementById("l2").value = p.l_input2;
  	document.getElementById("m2").value = p.m2;
}

function update_params(){
	play_animation = true;
  theta1_input =  mod(parseFloat(document.getElementById("theta1").value), 2*Math.PI);
 	omega1_input =  parseFloat(document.getElementById("omega1").value);
 	l1_input =  parseFloat(document.getElementById("l1").value);
  m1_input =  parseFloat(document.getElementById("m1").value);
 	theta2_input =  mod(parseFloat(document.getElementById("theta2").value), 2*Math.PI);
 	omega2_input =  parseFloat(document.getElementById("omega2").value);
 	l2_input =  parseFloat(document.getElementById("l2").value);
  m2_input =  parseFloat(document.getElementById("m2").value);
 	g_input = parseFloat(document.getElementById("g").value);
 	console.log(theta1_input);
 	if (isNaN(theta1_input)) {
 		document.getElementById("theta1").value = "Numbers only :)";
 	}
 	if (isNaN(omega1_input)) {
 		document.getElementById("omega1").value = "Numbers only :)";
 	}
 	if (isNaN(l1_input)) {
 		document.getElementById("l1").value = "Numbers only :)";
 	}
 	if (isNaN(theta2_input)) {
 		document.getElementById("theta2").value = "Numbers only :)";
 	}
 	if (isNaN(omega2_input)) {
 		document.getElementById("omega2").value = "Numbers only :)";
 	}
 	if (isNaN(l2_input)) {
 		document.getElementById("l2").value = "Numbers only :)";
 	}
 	if (isNaN(m2_input)) {
 		document.getElementById("m2").value = "Numbers only :)";
 	}
  if (isNaN(g_input)) {
    document.getElementById("g").value = "Numbers only :)";
  }
 	else {
 		g = g_input;
 	}
 	if (!isNaN(theta1_input) && !isNaN(omega1_input) && !isNaN(l1_input) && !isNaN(m1_input) &&
      !isNaN(theta2_input) && !isNaN(omega2_input) && !isNaN(l2_input) && !isNaN(m2_input)) {
      p.set_new_params(theta1_input, omega1_input, l1_input, m1_input, theta2_input, omega2_input, l2_input, m2_input);
  	  wmax = calc_w_scale(p);
  	  wscale = width/(2*wmax);
      for (let i=0; i<num; i++) {
        w1array[i] = (omega1_input+wmax)*wscale + offset;
        w2array[i] = (omega2_input+wmax)*wscale + offset;
        t1array[i] = (theta1_input + Math.PI) % (2*Math.PI)*tscale + offset;
        t2array[i] = (theta2_input + Math.PI) % (2*Math.PI)*tscale + offset;
      }
    }
}

function keyPressed() {
  if (keyCode === ENTER) {
  	update_params();
  }
}

//const button = document.getElementById("button1");

//button.addEventListener("click", (event) => {
//  update_params();
//});

//btn.addEventListener("tap", (event) => {
//  update_params();
//});