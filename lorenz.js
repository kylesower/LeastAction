const lorenz = ( sketch ) => {

	sketch.setup = () => {
		x0 = -13.8;
		y0 = -10.6;
		z0 = 36.8;
		sigma = 10;
		rho = 25;
		beta = 7/3;
		xarray = [];
		yarray = [];
		zarray = [];
		vxarray = [];
		vyarray = [];
		vzarray = [];
		num_l = 2000;
		play_animation_lorenz = false;
		plot_coords = true;
		plot_vels = true;
		width = Math.min(Math.min(sketch.windowWidth, sketch.windowHeight)*15/16, 800);
	  	height = width;
	  	offset = width/2;
	  	scale = 10*width/800;
	  	coordcolorscl = 800/width/2;
	  	vscale = 1*width/800;
	  	velcolorscl = 800/width/2;
	  	xspeed = 0.01;
	  	yspeed = 0.02;
	  	zspeed = 0.01;
	  	sketch.createCanvas(width, height);
	  	sketch.frameRate(60);
	  	a = new attractor(x0, y0, z0, sigma, rho, beta, dt);
	  	vx0 = a.vx;
	  	vy0 = a.vy;
	  	vz0 = a.vz;
	  	for (let i=0; i<num_l; i++) {
		    xarray[i] = x0*scale
		    yarray[i] = y0*scale
		    zarray[i] = z0*scale
			vxarray[i] = vx0*vscale
		    vyarray[i] = vy0*vscale
		    vzarray[i] = vz0*vscale
	  	}
	  	cpx1 = a.cx1;
	  	cpy1 = a.cy1;
	  	cpz1 = a.cz1;
	  	cpx2 = a.cx2;
	  	cpy2 = a.cy2;
	  	cpz2 = a.cz2;
	  	cpx = (cpx1 + cpx2) / 2 * scale;
	  	cpy = (cpy1 + cpy2) / 2 * scale;
	  	cpz = (cpz1 + cpz2) / 2 * scale;
	  	document.getElementById("x0").value = x0;
	  	document.getElementById("y0").value = y0;
	  	document.getElementById("z0").value = z0;
	  	document.getElementById("sigma").value = sigma;
	  	document.getElementById("rho").value = rho;
	  	document.getElementById("beta").value = beta;
	  	document.getElementById("plot_coords").checked = true;
	  	document.getElementById("plot_vels").checked = true;
	}


	sketch.draw = () => {
		sketch.background(51);
		if (play_animation_lorenz){
			for ( let i = 1; i < num_l; i++ ) {
			    xarray[i - 1] = xarray[i];
			    yarray[i - 1] = yarray[i];
			    zarray[i - 1] = zarray[i];
			    vxarray[i - 1] = vxarray[i];
			    vyarray[i - 1] = vyarray[i];
			    vzarray[i - 1] = vzarray[i];
		 	}
			a.update();
			xarray[num_l - 1] = a.x*scale;
		 	yarray[num_l - 1] = a.y*scale;
		 	zarray[num_l - 1] = a.z*scale;
		 	vxarray[num_l - 1] = a.vx*vscale;
		 	vyarray[num_l - 1] = a.vy*vscale;
		 	vzarray[num_l - 1] = a.vz*vscale;

		 	if (plot_coords){
			 	for ( let j = 1; j < num_l; j++ ) {
			        sketch.stroke(zarray[j]*coordcolorscl, 20, 250);
			        prevcoords = rotate_x(xarray[j - 1]-cpx, yarray[j - 1]-cpy, zarray[j - 1]-cpz);
			        prevcoords = rotate_y(...prevcoords);
			        newcoords = rotate_x(xarray[j]-cpx, yarray[j]-cpy, zarray[j]-cpz);
			        newcoords = rotate_y(...newcoords);
			        sketch.line(prevcoords[0]+offset, prevcoords[1]+offset, newcoords[0]+offset, newcoords[1]+offset);
			    }
			}
			if (plot_vels) {
			    for ( let j = 1; j < num_l; j++ ) {
			        sketch.stroke(220, (200+vzarray[j])*velcolorscl, 40);
			        prevcoords = rotate_x(vxarray[j - 1], vyarray[j - 1], vzarray[j - 1]);
			        prevcoords = rotate_y(...prevcoords);
			        newcoords = rotate_x(vxarray[j], vyarray[j], vzarray[j]);
			        newcoords = rotate_y(...newcoords);
			        sketch.line(prevcoords[0]+offset, prevcoords[1]+offset, newcoords[0]+offset, newcoords[1]+offset);
			    }
			}
	    }
	}

}

let myp5 = new p5(lorenz, document.getElementById('lorenz'));

function rotate_x(x, y, z) {
	theta = xspeed*myp5.frameCount;
	return [x, Math.cos(theta)*y - Math.sin(theta)*z, Math.sin(theta)*y + Math.cos(theta)*z];
}


function rotate_y(x, y, z) {
	theta = yspeed*myp5.frameCount;
	return [Math.cos(theta)*x + Math.sin(theta)*z, y,-Math.sin(theta)*x + Math.cos(theta)*z];
}


function rotate_z(x, y, z) {
	theta = zspeed*myp5.frameCount;
	return [Math.cos(theta)*x - Math.sin(theta)*y, Math.sin(theta)*x + Math.cos(theta)*y, z];
}


function attractor (x, y, z, sigma, rho, beta){
	this.x = x;
	this.y = y;
	this.z = z;
	this.vx = this.sigma*(this.y - this.x);
	this.vy = this.x*(this.rho-this.z)-this.y;
	this.vz = this.x*this.y - this.beta*this.z;
	this.sigma = sigma;
	this.rho = rho;
	this.beta = beta;
	this.cx1 = Math.sqrt(this.beta*(this.rho-1));
	this.cy1 = this.cx1;
	this.cz1 = this.rho - 1;
	this.cx2 = -this.cx1;
	this.cy2 = -this.cy1;
	this.cz2 = this.cz1;
	this.dt_raw = 2
	this.dt = this.dt_raw/Math.sqrt(this.vx**2 + this.vy**2 + this.vz**2);

	this.update = function() {
		this.dt = this.dt_raw/Math.sqrt(this.vx**2 + this.vy**2 + this.vz**2);
		this.vx = this.sigma*(this.y - this.x);
		this.x = this.x + this.vx*this.dt;
		this.vy = this.x*(this.rho-this.z)-this.y;
		this.y = this.y + this.vy*this.dt;
		this.vz = this.x*this.y - this.beta*this.z;
		this.z = this.z + this.vz*this.dt;
	}

	this.set_new_params = function(x, y, z, sigma, rho, beta) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.sigma = sigma;
		this.rho = rho;
		this.beta = beta;
		this.vx = this.sigma*(this.y - this.x);
		this.vy = (this.x*(this.rho-this.z)-this.y);
		this.vz = (this.x*this.y - this.beta*this.z);
	}

	this.show = function() {
		fill(0, 200, 50, this.z*2);
		circle(this.x + width/2, this.y + width/2, 10);
	}
}


function update_lorenz() {
	play_animation_lorenz = true;
	stop_pend();
	xarray = [];
	yarray = [];
	zarray = [];
	vxarray = [];
	vyarray = [];
	vzarray = [];
  	x_input =  parseFloat(document.getElementById("x0").value);
 	y_input =  parseFloat(document.getElementById("y0").value);
 	z_input =  parseFloat(document.getElementById("z0").value);
 	sigma_input =  parseFloat(document.getElementById("sigma").value);
 	beta_input =  parseFloat(document.getElementById("beta").value);
 	rho_input =  parseFloat(document.getElementById("rho").value);

 	if (isNaN(x_input)) {
 		document.getElementById("x0").value = "Numbers only :)";
 	}
 	if (isNaN(y_input)) {
 		document.getElementById("y0").value = "Numbers only :)";
 	}
 	if (isNaN(z_input)) {
 		document.getElementById("z0").value = "Numbers only :)";
 	}
 	if (isNaN(sigma_input)) {
 		document.getElementById("sigma").value = "Numbers only :)";
 	}
 	if (isNaN(beta_input)) {
 		document.getElementById("beta").value = "Numbers only :)";
 	}
 	if (isNaN(rho_input)) {
 		document.getElementById("rho").value = "Numbers only :)";
 	}

 	if (!isNaN(x_input) && !isNaN(y_input) && !isNaN(z_input) &&
      	!isNaN(sigma_input) && !isNaN(beta_input) && !isNaN(rho_input)) {
      a.set_new_params(x_input, y_input, z_input, sigma_input, rho_input, beta_input);

      for (let i=0; i<num_l; i++) {
        xarray[i] = a.x*scale;
        yarray[i] = a.y*scale;
        zarray[i] = a.z*scale;
        vxarray[i] = a.vx*vscale;
        vyarray[i] = a.vy*vscale;
        vzarray[i] = a.vz*vscale;
      }
    }
}


function stop_lorenz() {
	play_animation_lorenz = false;
	document.getElementById("x0").value = a.x;
  	document.getElementById("y0").value = a.y;
  	document.getElementById("z0").value = a.z;
  	document.getElementById("sigma").value = sigma;
  	document.getElementById("rho").value = rho;
  	document.getElementById("beta").value = beta;
  	delete(myp5);
  	delete(xarray);
  	delete(yarray);
  	delete(zarray);
  	delete(vxarray);
  	delete(vyarray);
  	delete(vzarray);
}


function plot_coord_update(cb) {
  for (let i=0; i<num_l; i++) {
   	xarray[i] = a.x*scale// + offset;
    yarray[i] = a.y*scale// + offset;
    zarray[i] = a.z*scale// + offset;
  }
  plot_coords = cb.checked;
}


function plot_vel_update(cb) {
  for (let i=0; i<num_l; i++) {
	vxarray[i] = a.vx*vscale// + offset;
    vyarray[i] = a.vy*vscale// + offset;
    vzarray[i] = a.vz*vscale// + offset;
  }
  plot_vels = cb.checked;
}


// function keyPressed() {
//   if (myp5.keyCode === myp5.ENTER) {
//   	update_lorenz();
//   }
// }



//delete(myp5.draw);
//delete(myp5.sketch);

