// Physics module aliases
const { Engine, World, Bodies, Composite } = Matter;

let engine,
    world, 
    ground,
    ball;


function setup() {
  const main = select('.main')
  createCanvas(main.width - 60, main.height);
  engine = Engine.create();
  world = engine.world;
  ground = new Bounds(200, height, width, 100);
  Composite.add(world, ground);

  ball = new Ball(300, 100, 40);
}

function draw() {
  background(255);
  Engine.update(engine);
  ball.show();
}