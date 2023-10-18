// TODO: Create rules for FLC, create a 6-tuple m-array based on the input-infused rules, calculate cog, return the value

// Physics module aliases
const { Engine,
  Bodies,
  Body,
  Composite,
  Mouse,
  MouseConstraint
  } = Matter;

const KEYS = {
  SPACE: 32
}

let engine,
  world,
  bounds = [],
  ball,
  hoop;

let flc

let m_cstr, main, thickness;

function setup() {

  // Setup canvas
  frameRate(165)
  main = select('#main')
  let canvas = createCanvas(main.width - 60, main.height);

  // Initialize world
  engine = Engine.create();
  world = engine.world;

  // Bottom Left Right
  thickness = 100;
  bounds.push(new Bounds(0, main.height, main.width * 2, thickness));
  bounds.push(new Bounds(0, 0, thickness, main.height * 2));
  bounds.push(new Bounds(main.width - 60, main.height, thickness, main.height * 2));
  Composite.add(world, bounds)

  ball = new Ball(500, main.height - thickness + thickness / 5, 30);
  hoop = new Hoop(main.width - 250, 200, 40);

  var canvasMouse = Mouse.create(canvas.elt);
  canvasMouse.pixelRatio = pixelDensity();

  m_cstr = MouseConstraint.create(engine, {
    mouse: canvasMouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })

  Composite.add(world, m_cstr);

  // Init FLC
  flc = new FLC()
}

function keyPressed() {
  if (keyCode === KEYS.SPACE) {
    // ball.addToWorld() 
    console.clear()

    let proximity = dist(ball.body.position.x, ball.body.position.y, hoop.outerRim.position.x, ball.body.position.y)
    console.log('Prox: ' + proximity);
    let actual_height = dist(hoop.outerRim.position.x, main.height - thickness + thickness / 5, hoop.outerRim.position.x, hoop.outerRim.position.y) - dist(ball.body.position.x, main.height - thickness + thickness / 5, ball.body.position.x, ball.body.position.y);
    let height = dist(ball.body.position.x, ball.body.position.y, ball.body.position.x, hoop.outerRim.position.y);
    console.log('Height: ' + height);

    // Body.setVelocity(ball.body, createVector(10, -20))
  }
}

// Adjusting ball starting position and hoop height
function mouseDragged() {
  if (!Composite.allBodies(world).includes(ball.body) && ball.mouseInCircle()) {
    Body.setPosition(ball.body, createVector(mouseX, mouseY));
  }

  if (!Composite.allBodies(world).includes(ball.body) && !ball.mouseInCircle() && hoop.mouseInHoop()) {
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, mouseY))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, mouseY))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, mouseY - hoop.r * 3 / 2))
  }

  // Body.applyForce(ball.body, { x: 0.1 , y: 0.001  }, { x: 0.001, y: 0.005 });
}

function draw() {
  background(255);
  Engine.update(engine);

  bounds.forEach(bound => bound.show())

  // If ball clicked, draw line guide
  if (m_cstr.body && m_cstr.body === ball.body) {
    Matter.Sleeping.set(ball.body, true)
  }

  if (!Composite.allBodies(world).includes(ball.body) && hoop.mouseInHoop() || ball.mouseInCircle()) {
    cursor('pointer');
  } else {
    cursor('default');
  }

  hoop.show();
  ball.show();
}