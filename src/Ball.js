class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = r * 2;

    let options = {
      restitution: .8,
      density: 0.004,
      friction: .6,
    }

    this.body = Bodies.circle(this.x, this.y, this.r, options);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;
    let y_start = main.height - (thickness * .8)
    let left_wall = thickness * .8
    let right_wall = main.width - (thickness * 1.1)

    push();
    // Shadow 
    fill(0, 0, 0, 60 * (y_start + pos.y) / y_start < 3 ? 0 : 60 * (y_start + pos.y) / y_start);
    if (pos.y < -main.height || pos.y > y_start + 1 || pos.x < left_wall || pos.x > right_wall) fill(0, 0, 0, 0) 
    noStroke();
    ellipse(pos.x, y_start + this.r, this.r * 2 + this.r * (y_start - pos.y) / y_start, this.r / 2 + this.r / 2 * (y_start - pos.y) / y_start)

    // Ball
    translate(pos.x, pos.y);
    rotate(angle);
    ellipseMode(CENTER);
    strokeWeight(1);
    stroke(0);
    fill(230, 105, 0);
    circle(0, 0, this.d);

    // Angle indicator
    strokeWeight(1);
    stroke(0);
    line(0 - this.r, 0, this.r, 0)

    pop();
  }

  mouseInCircle() {
    return dist(this.body.position.x, this.body.position.y, mouseX, mouseY) < this.r;
  }

  addToWorld() {
    if (Composite.allBodies(world).includes(this.body)) {
      Composite.remove(world, this.body)

      let options = {
        restitution: 1
      }

      this.body = Bodies.circle(this.body.position.x, this.body.position.y, this.r, options);
      return
    }

    Composite.add(world, this.body);
  }
}