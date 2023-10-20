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

  shoot() {
    let proximity = (hoop.outerRim.position.x + hoop.r * 3 / 2) - this.body.position.x
    let height = this.body.position.y - hoop.outerRim.position.y;

    let url = 'http://127.0.0.1:5000/'
    let postData = {
      proximity: proximity,
      height: height
    }

    if (Composite.allBodies(world).includes(this.body)) {
      this.addToWorld()
      return
    }

    httpPost(url, 'json', postData, res => {
      let a = 0,
        mag = 0

      a = res.force[0]
      mag = res.force[1]

      console.log('Angle: ' + a.toString());
      console.log('Magnitude: ' + mag.toString());

      let trajectory = p5.Vector.fromAngle(-a, mag)

      // Rotate the ball according to trajectory
      this.body.angle = -a;
      Body.setAngularVelocity(this.body, 0)
      Body.setAngularSpeed(this.body, 0)
      Body.applyForce(this.body, this.body.position, trajectory)

      this.addToWorld()
    })
  }

  addToWorld() {
    if (Composite.allBodies(world).includes(this.body)) {
      Composite.remove(world, this.body)

      let options = {
        restitution: .8,
        density: 0.004,
        friction: .6,
      }

      this.body = Bodies.circle(this.body.position.x, this.body.position.y, this.r, options);
      return
    }

    Composite.add(world, this.body);
  }

  showAngles() {
    let length = ball.r + 4
    push()
    stroke('blue')
    strokeWeight(2)
    line(ball.body.position.x, ball.body.position.y, ball.body.position.x, ball.body.position.y - length)
    stroke('green')
    line(ball.body.position.x, ball.body.position.y, ball.body.position.x + length, ball.body.position.y)

    let mid = p5.Vector.fromAngle(-radians(45), length)
    stroke('yellow')
    translate(ball.body.position.x, ball.body.position.y)
    line(mid.x, mid.y, 0, 0)

    let high_mid = p5.Vector.fromAngle(-radians(68), length)
    stroke('red')
    line(high_mid.x, high_mid.y, 0, 0)

    let low_mid = p5.Vector.fromAngle(-radians(23), length)
    stroke('violet')
    line(low_mid.x, low_mid.y, 0, 0)
    pop()
  }

  setNewBallBody(newBallBody) {
    this.body = newBallBody
  }
}

// // Physics modules
// var {
//   Engine,
//   Render,
//   Runner,
//   MouseConstraint,
//   Mouse,
//   Composite,
//   Bodies,
//   Body,
//   Sleeping
// } = Matter

// export default class Ball {
//   constructor(engine, world, x, y, r, isStatic = false) {
//     this.engine = engine
//     this.world = world
//     this.body = new Bodies.circle(x, y, r, {
//       isStatic: isStatic,
//       restitution: .8,
//       friction: .6,
//       render: {
//         fillStyle: 'rgb(230, 105, 0)',
//       },
//       label: 'ball'
//     })

//     Composite.add(this.world, this.body);
//     this.dragging = false
//   }

//   toggleDraggable() {
//     this.dragging = !this.dragging

//     Body.setVelocity(this.body, { x: 0, y: 0 })
//     Sleeping.set(this.body, !this.body.isSleeping)
//     this.engine.gravity.scale = this.dragging ? 0 : 0.001;
//   }
// }