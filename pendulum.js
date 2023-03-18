function pend(theta1_init, w1_init, l1, m1, theta2_init, w2_init, l2, m2) {
  this.theta1 = theta1_init;
  this.w1 = w1_init;
  this.l_input1 = l1;
  this.m1 = m1;
  this.l1 = this.l_input1*width/200;
  this.theta2 = theta2_init;
  this.w2 = w2_init;
  this.l_input2 = l2;
  this.m2 = m2;
  this.l2 = this.l_input2*width/200;
  this.x1 = this.l1*Math.sin(this.theta1) + width/2;
  this.y1 = this.l1*(Math.cos(this.theta1)) + height/2;
  this.x2 = this.l1*Math.sin(this.theta1) + this.l2*Math.sin(this.theta2) + width/2;
  this.y2 = this.l1*Math.cos(this.theta1) + this.l2*(Math.cos(this.theta2)) + height/2;

  this.update_cartesian = function() {
    this.x1 = this.l1*Math.sin(this.theta1) + width/2;
    this.y1 = this.l1*(Math.cos(this.theta1)) + height/2;
    this.x2 = this.l1*Math.sin(this.theta1) + this.l2*Math.sin(this.theta2) + width/2;
    this.y2 = this.l1*Math.cos(this.theta1) + this.l2*(Math.cos(this.theta2)) + height/2;
  };

  this.update = function() {
    if (method == "euler") {
      this.theta1dd = a1(this.theta1, this.w1, this.l_input1, this.m1, this.theta2, this.w2, this.l_input2, this.m2);
      this.theta2dd = a2(this.theta1, this.w1, this.l_input1, this.m1, this.theta2, this.w2, this.l_input2, this.m2);
      this.w1 = this.theta1dd*dt + this.w1;
      this.theta1 = mod(this.w1*dt + this.theta1, 2*Math.PI);
      this.w2 = this.theta2dd*dt + this.w2;
      this.theta2 = mod(this.w2*dt + this.theta2, 2*Math.PI);
    }
    else if (method == "rk4"){
      new_vals = rk4(this.theta1, this.w1, a1, this.l_input1, this.m1, this.theta2, this.w2, a2, this.l_input2, this.m2, dt);
      this.theta1 = mod(new_vals[0], 2*Math.PI);
      this.w1 = new_vals[1];
      this.theta2 = mod(new_vals[2], 2*Math.PI);
      this.w2 = new_vals[3];
    }
    this.update_cartesian();
  }

  this.set_new_params = function(theta1, omega1, l1, m1, theta2, omega2, l2, m2){
    this.theta1 = theta1 % (2*Math.PI);
    this.w1 =  omega1;
    this.l_input1 = l1;
    this.l1 = this.l_input1*width/200;
    this.m1 = m1;
    this.theta2 = theta2 % (2*Math.PI);
    this.w2 =  omega2;
    this.l_input2 = l2;
    this.l2 = this.l_input2*width/200;
    this.m2 = m2;
  }

  this.show = function() {
    pendinst.fill(255);
    pendinst.strokeWeight(1);
    pendinst.stroke(100);
    pendinst.line(width/2, height/2, this.x1, this.y1);
    pendinst.fill(50,150,200);
    pendinst.circle(this.x1, this.y1, rad);
    pendinst.stroke(100);
    pendinst.line(this.x1, this.y1, this.x2, this.y2);
    pendinst.fill(50,150,200);
    pendinst.circle(this.x2, this.y2, rad);
  }
}

function mod(n, m){
  return ((n % m) + m) % m;
}

function a1(theta1, w1, l1, m1, theta2, w2, l2, m2){
  dtheta = theta1 - theta2;
  // From the internet
  
  return (-m2*Math.cos(dtheta)*l1*w1**2*Math.sin(dtheta)+m2*Math.cos(dtheta)*g*Math.sin(theta2)
                     -m2*l2*w2**2*Math.sin(dtheta)-(m1+m2)*g*Math.sin(theta1))/
                    (l1*(m1+m2-m2*Math.cos(dtheta)**2));
  // Mine
  /*                    
  return 1/(m1+m2-m2*Math.cos(dtheta)**2)*(-m2*l2/l1*Math.sin(dtheta)*(w2**2+l1/l2*w1**2)
            +m2*g/l1*Math.sin(theta2)*Math.cos(dtheta)-(m1 + m2)*g/l1*Math.sin(theta1));*/
}

function a2(theta1, w1, l1, m1, theta2, w2, l2, m2){
  dtheta = theta1 - theta2;
  // Mine which is now weird for whatever reason
  /*
  theta1dd = 1/(m1+m2-m2*Math.cos(dtheta)**2)*(-m2*l2/l1*Math.sin(dtheta)*(w2**2+l1/l2*w1**2)
            +m2*g/l1*Math.sin(theta2)*Math.cos(dtheta)-(m1 + m2)*g/l1*Math.sin(theta1));
  return 1/(m2*l2**2)*(m2*l1*l2*(w1**2*Math.sin(dtheta)-theta1dd*Math.cos(dtheta))-m2*g*l2*Math.sin(theta2));*/
  // From the internet
  
  return (m1 + m2) * (l1 * w1**2 * Math.sin(dtheta) + 
                    (w2**2*Math.sin(dtheta)*Math.cos(dtheta)*m2*l2)/(m1+m2)+
                    Math.cos(dtheta)*g*Math.sin(theta1)-g*Math.sin(theta2))/
                    (l2*(m1+m2*Math.sin(dtheta)**2));

}

function rk4(x1, v1, a1, l1, m1, x2, v2, a2, l2, m2, dt) {
  // Returns final (position, velocity) array after time dt has passed.
  //        x: initial position
  //        v: initial velocity
  //        a: acceleration function a(x,v,dt) (must be callable)
  //        dt: timestep
  var K0x1 = a1(x1, v1, l1, m1, x2, v2, l2, m2);
  var K0x2 = a2(x1, v1, l1, m1, x2, v2, l2, m2);
  var Q1x1 = v1 + dt/2*K0x1;
  var Q1x2 = v2 + dt/2*K0x2;
  var K1x1 = a1(x1+dt/2*v1, Q1x1, l1, m1, x2+dt/2*v2, Q1x2, l2, m2);
  var K1x2 = a2(x1+dt/2*v1, Q1x1, l1, m1, x2+dt/2*v2, Q1x2, l2, m2);
  var Q2x1 = v1 + dt/2*K1x1;
  var Q2x2 = v2 + dt/2*K1x2;
  var K2x1 = a1(x1+dt/2*Q1x1, Q2x1, l1, m1, x2+dt/2*Q1x2, Q2x2, l2, m2);
  var K2x2 = a2(x1+dt/2*Q1x1, Q2x1, l1, m1, x2+dt/2*Q1x2, Q2x2, l2, m2);
  var Q3x1 = v1 + dt*K2x1;
  var Q3x2 = v2 + dt*K2x2;
  var K3x1 = a1(x1+dt*Q2x1, Q3x1, l1, m1, x2+dt*Q2x2, Q3x2, l2, m2);
  var K3x2 = a2(x1+dt*Q2x1, Q3x1, l1, m1, x2+dt*Q2x2, Q3x2, l2, m2);
  var new_x1 = x1 + dt*(v1 + dt/6*(K0x1 + K1x1 + K2x1));
  var new_x2 = x2 + dt*(v2 + dt/6*(K0x2 + K1x2 + K2x2));
  var new_v1 = v1 + dt/6*(K0x1 + 2*K1x1 + 2*K2x1 + K3x1);
  var new_v2 = v2 + dt/6*(K0x2 + 2*K1x2 + 2*K2x2 + K3x2);
  
  return [new_x1, new_v1, new_x2, new_v2];
}