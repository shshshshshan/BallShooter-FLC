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
  SPACE: 32,
  Q: 81,
  W: 87,
  E: 69,
  R: 82,
  T: 84,
  Z: 90,
  X: 88,
  C: 67,
  V: 86,
  B: 66,
  N: 78,
  COMMA: 188,
  PERIOD: 190
}

let engine,
  world,
  bounds = [],
  ball,
  hoop;

let flc

let m_cstr, main, thickness;

var bg;

let lastSavedBallPosition

function preload() {
  bg = loadImage('../background.png')
}

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

  ball = new Ball(500, main.height - thickness / 2 - 30, 30);
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
  bg.filter(OPAQUE)
  bg.filter(BLUR, 5)
}

function keyPressed() {
  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.Q) {
    // Move hoop to highest point in canvas
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, 150))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, 150))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, 150 - hoop.r * 3 / 2))
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.W) {
    // Move hoop to mid-high point in canvas
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, 250))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, 250))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, 250 - hoop.r * 3 / 2))
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.E) {
    // Move hoop to middle point in canvas
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, 350))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, 350))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, 350 - hoop.r * 3 / 2))
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.R) {
    // Move hoop to middle point in canvas
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, 480))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, 480))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, 480 - hoop.r * 3 / 2))
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.T) {
    // Move hoop to middle point in canvas
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, main.height - thickness - hoop.r * 3 / 2 - 6))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, main.height - thickness - hoop.r * 3 / 2 - 6))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, main.height - thickness - hoop.r * 3 / 2 - 6 - hoop.r * 3 / 2))
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.Z) {
    // Move ball very far from the rim
    Body.setPosition(ball.body, createVector(hoop.outerRim.position.x - 1400, ball.body.position.y));
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.X) {
    // Move ball far from the rim
    Body.setPosition(ball.body, createVector(hoop.outerRim.position.x - 1100, ball.body.position.y));
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.C) {
     // Move ball to somewhat far from the rim
     Body.setPosition(ball.body, createVector(hoop.outerRim.position.x - 700, ball.body.position.y));
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.V) {
    // Move ball to somewhat near the rim
    Body.setPosition(ball.body, createVector(hoop.outerRim.position.x - 400, ball.body.position.y));
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.B) {
    // Move ball to near the rim
    Body.setPosition(ball.body, createVector(hoop.outerRim.position.x - 100, ball.body.position.y));
  }

  if (Body.getSpeed(ball.body) <= 0 && keyCode === KEYS.N) {
    // Move ball to within rim
    Body.setPosition(ball.body, createVector(hoop.outerRim.position.x + hoop.r * 3 / 2, ball.body.position.y));
  }

  if (keyCode === KEYS.SPACE) {
    ball.shoot()
  }

  // Save current ball position
  if (keyCode === KEYS.COMMA) {
    lastSavedBallPosition = createVector(ball.body.position.x, ball.body.position.y)
  }

  // Load last ball saved position
  if (keyCode === KEYS.PERIOD) {
    Body.setPosition(ball.body, lastSavedBallPosition)
  }
}

// Adjusting ball starting position and hoop height
function mouseDragged() {
  console.clear()

  let proximity = (hoop.outerRim.position.x + hoop.r * 3 / 2) - ball.body.position.x
  let height = ball.body.position.y - hoop.outerRim.position.y;
  console.log('Prox: ' + proximity);
  console.log('Height: ' + height);

  if (!Composite.allBodies(world).includes(ball.body) && ball.mouseInCircle()) {
    if (mouseY > main.height - thickness / 2 - ball.r || mouseY < ball.r || mouseX > hoop.innerRim.position.x - 10 || mouseX < thickness / 2 + ball.r) return

    Body.setPosition(ball.body, createVector(mouseX, mouseY));
  }

  if (!Composite.allBodies(world).includes(ball.body) && !ball.mouseInCircle() && hoop.mouseInHoop()) {
    if (mouseY < 150 || mouseY > main.height - thickness - hoop.r * 3 / 2 - 5) return
    Body.setPosition(hoop.innerRim, createVector(hoop.innerRim.position.x, mouseY))
    Body.setPosition(hoop.outerRim, createVector(hoop.outerRim.position.x, mouseY))
    Body.setPosition(hoop.board, createVector(hoop.board.position.x, mouseY - hoop.r * 3 / 2))
  }
}

function draw() {
  background(bg);
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
  // ball.showAngles();
  hoop.showRim();
  hoop.showNet();
}