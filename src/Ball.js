class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = r*2;

    let options = {
      restitution: 1
    }

    this.body = Bodies.circle(this.x, this.y, this.r, options);

    Composite.add(world, this.body);
  }

  show() {
    let pos = this.body.position;

    push();
    translate(pos.x, pos.y);
    strokeWeight(1);
    stroke(0);
    fill('orange');
    circle(0, 0, this.d);
    pop();

    // Mouse hover on ball
    let mouseDist = dist(pos.x, pos.y, mouseX, mouseY);
    if (mouseDist <= this.r) {
      cursor('pointer');
    } else {
      cursor('default');
    }
  }
}