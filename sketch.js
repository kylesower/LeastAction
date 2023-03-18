function plot_t_box_update(cb) {
    for (let i=0; i<num; i++) {
        t1array[i] = (p.theta1 + Math.PI) % (2*Math.PI)*tscale;
        t2array[i] = (p.theta2 + Math.PI) % (2*Math.PI)*tscale;
    }
    plot_t = cb.checked;
}

function plot_w_box_update(cb) {
    for (let i=0; i<num; i++) {
        w1array[i] = (p.w1+wmax)*wscale;
        w2array[i] = (p.w2+wmax)*wscale;
    }
    plot_w = cb.checked;
}

function calc_w_scale(p){
  	E = calc_E(p);
  	Umax = (p.m1+p.m2)*g*p.l_input1+p.m2*g*p.l_input2;
  	w1max = Math.sqrt((E+Umax)/(1/2*p.m1*p.l_input1**2)); // if w2 = 0 and all energy is kinetic
  	w2max = Math.sqrt((E+Umax)/(1/2*p.m2*p.l_input2**2)); //if w1 = 0 and all energy is kinetic
  	return Math.max(w1max, w2max)*1.1; // add a cheat factor because I'm lazy and it wasn't quite working
}
const pendp5 = ( sketch ) => {
    dt = 0.08;
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
    play_animation_pend = false;
    var l1 = 30;
    var l2 = 30;
    var g = 9.8;
    var m1 = .5;
    var m2 = .5;
    var T;
    var U;
    var E;
    method = "rk4";
    plot_t = true;
    plot_w = true;
    sketch.setup = () => {
        width = Math.min(Math.min(sketch.windowWidth, sketch.windowHeight)*15/16, 800);
        height = width;
        rad = width/100;
        sketch.createCanvas(width, height);
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
        sketch.frameRate(60);
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
            w1array[i] = (p.w1+wmax)*wscale;
            w2array[i] = (p.w2+wmax)*wscale;
            t1array[i] = (p.theta1 + Math.PI) % (2*Math.PI)*tscale;
            t2array[i] = (p.theta2 + Math.PI) % (2*Math.PI)*tscale;
        }
    }


    sketch.draw = () => {
        sketch.background(51);
        if(play_animation_pend){
            for ( let i = 1; i < num; i++ ) {
                w1array[i - 1] = w1array[i];
                w2array[i - 1] = w2array[i];
                t1array[i - 1] = t1array[i];
                t2array[i - 1] = t2array[i];
            }

            p.update();
            w1array[num - 1] = (p.w1+wmax)*wscale;
            w2array[num - 1] = (p.w2+wmax)*wscale;
            t1array[num - 1] = (p.theta1 + Math.PI) % (2*Math.PI)*tscale;
            t2array[num - 1] = (p.theta2 + Math.PI) % (2*Math.PI)*tscale;

            if(plot_w){
                for ( let j = 1; j < num; j++ ) {
                    val = j / num * 204.0;
                    sketch.stroke(0, 100, 250, val);
                    sketch.line(w1array[j - 1], w2array[j - 1], w1array[j], w2array[j]);
                }
                sketch.fill(0, 100, 250, 10);
                sketch.text("\u03C9", 10, 40);
            }

            if(plot_t){
                for ( let j = 1; j < num; j++ ) {
                    val = j / num * 204.0;
                    sketch.stroke(0, 250, 100, val);
                    if (sketch.abs(t1array[j-1] - t1array[j]) < 100 && sketch.abs(t2array[j-1] - t2array[j]) < 100){
                        sketch.line(t1array[j - 1], t2array[j - 1], t1array[j], t2array[j]);
                    }
                }
                sketch.fill(0, 250, 100, 10);
                sketch.text("\u03D1", 10, 20);
            }
        }
        p.show()
    }
}


function calc_E(p){
    T = (p.m1 + p.m2)/2*(p.l_input1**2*p.w1**2)+p.m2*p.l_input1*p.l_input2*p.w1*p.w2*Math.cos(p.theta1-p.theta2)+p.m2/2*p.l_input2**2*p.w2**2;
    U = (p.m1+p.m2)*g*p.l_input1*(1-Math.cos(p.theta1))+p.m2*g*p.l_input2*(1-Math.cos(p.theta2));
    return T+U
}


function stop_pend(){
  	play_animation_pend = false;
    delete(w1array);
    delete(w2array);
    delete(t1array);
    delete(t2array);
  	document.getElementById("theta1").value = p.theta1;
  	document.getElementById("omega1").value = p.w1;
  	document.getElementById("l1").value = p.l_input1;
    document.getElementById("m1").value = p.m1;
  	document.getElementById("theta2").value = p.theta2;
  	document.getElementById("omega2").value = p.w2;
  	document.getElementById("l2").value = p.l_input2;
    document.getElementById("m2").value = p.m2;
}


function update_pend(){
  	play_animation_pend = true;
    stop_lorenz();
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
        w1array = [];
        w2array = [];
        t1array = [];
        t2array = [];
        for (let i=0; i<num; i++) {
            w1array[i] = (omega1_input+wmax)*wscale;
            w2array[i] = (omega2_input+wmax)*wscale;
            t1array[i] = (theta1_input + Math.PI) % (2*Math.PI)*tscale;
            t2array[i] = (theta2_input + Math.PI) % (2*Math.PI)*tscale;
        }
    }
}


document.onkeypress = function(e) {
    if (e.which == 13){
        console.log("enter pressed");
        console.log(e.target.id);
        console.log(["x0", "y0", "z0", "sigma", "rho", "beta"].includes(e.target.id))
        if (["x0", "y0", "z0", "sigma", "rho", "beta"].includes(e.target.id)){
            console.log("updating lorenz");
            update_lorenz();
        }
        else if (["theta1", "omega1", "l1", "m1", "theta2", "omega2", "l2", "m2", "g"].includes(e.target.id)){
            console.log("updating pend");
            update_pend();
      }
    }
}


let pendinst = new p5(pendp5, document.getElementById('pendulum'))
