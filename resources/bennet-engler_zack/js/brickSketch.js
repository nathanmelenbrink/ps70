var paddle, ball, wallTop, wallBottom, wallLeft, wallRight, block1, block2, block3;
var bricks;
var MAX_SPEED = 10;
var WALL_THICKNESS = 30;
var BRICK_W = 80;
var BRICK_H = 20;
var BRICK_MARGIN = 10;
var ROWS = 10;
var COLUMNS = 13;

var w = window.innerwidth
|| document.documentElement.clientWidth
|| document.body.clientwidth;

var h = window.innerheight
|| document.documentElement.clientHeight
|| document.body.clientheight;

function setup() {
  var canv = createCanvas(w, h);
  canv.parent("bgCanvas");

  paddle = createSprite(w/2, h-60, 120, 10);
  paddle.immovable = true;

  wallTop = createSprite(w/2, -WALL_THICKNESS/2, w+WALL_THICKNESS*2, WALL_THICKNESS);
  wallTop.immovable = true;

  wallBottom = createSprite(w/2, h+WALL_THICKNESS/2, w+WALL_THICKNESS*2, WALL_THICKNESS);
  wallBottom.immovable = true;

  wallLeft = createSprite(-WALL_THICKNESS/2, h/2, WALL_THICKNESS, h);
  wallLeft.immovable = true;

  wallRight = createSprite(w+WALL_THICKNESS/2, h/2, WALL_THICKNESS, h);
  wallRight.immovable = true;


  bricks = new Group();

  var offsetX = w/2-(COLUMNS-1)*(BRICK_MARGIN+BRICK_W)/2;
  var offsetY = 120;


  block1 = createSprite(offsetX+2*(BRICK_W+BRICK_MARGIN), offsetY+4.5*(BRICK_H+BRICK_MARGIN), BRICK_W*3.25, BRICK_H*5.5);
  block1.immovable = true;
  block1.shapeColor = color(255);

  block2 = createSprite(offsetX+6*(BRICK_W+BRICK_MARGIN), offsetY+4.5*(BRICK_H+BRICK_MARGIN), BRICK_W*3.25, BRICK_H*5.5);
  block2.immovable = true;
  block2.shapeColor = color(255);

  block3 = createSprite(offsetX+10*(BRICK_W+BRICK_MARGIN), offsetY+4.5*(BRICK_H+BRICK_MARGIN), BRICK_W*3.25, BRICK_H*5.5);
  block3.immovable = true;
  block3.shapeColor = color(255);

  for(var r = 0; r<ROWS; r++) {
    for(var c = 0; c<COLUMNS; c++) {
      var rowBool = (r <= 6 && r >= 3);
      var colBool1 = (c <= 3 && c >= 1);
      var colBool2 = (c <= 7 && c >= 5);
      var colBool3 = (c <= 11 && c >= 9);

      if ((rowBool && colBool1) || (rowBool && colBool2) || (rowBool && colBool3)) {
        // do nothing
      }
      else {
        var brick = createSprite(offsetX+c*(BRICK_W+BRICK_MARGIN), offsetY+r*(BRICK_H+BRICK_MARGIN), BRICK_W, BRICK_H);
        brick.shapeColor = color(255,255,255);
        bricks.add(brick);
        brick.immovable = true;
      }
    }
  }

  ball = createSprite(w/2, h-200, 11, 11);
  ball.maxSpeed = MAX_SPEED;
  paddle.shapeColor = ball.shapeColor = color(255,255,255);
}

function draw() {
  background(30);
  textAlign(RIGHT);
  textSize(12);
  fill(255);
  text("Space to start. Arrows to move", w-50, h-100);

  ball.bounce(wallTop);
  ball.bounce(wallLeft);
  ball.bounce(wallRight);

  if(ball.bounce(paddle))
    {
      var swing = (ball.position.x-paddle.position.x)/3;
      ball.setSpeed(MAX_SPEED, ball.getDirection()+swing);
    }
  if(ball.bounce(block1))
    {
      var swing = (ball.position.x-block1.position.x)/3;
      ball.setSpeed(MAX_SPEED, ball.getDirection()+swing);
    }
  if(ball.bounce(block2))
    {
      var swing = (ball.position.x-block2.position.x)/3;
      ball.setSpeed(MAX_SPEED, ball.getDirection()+swing);
    }
  if(ball.bounce(block3))
    {
      var swing = (ball.position.x-block3.position.x)/3;
      ball.setSpeed(MAX_SPEED, ball.getDirection()+swing);
    }

  if(ball.bounce(wallBottom))
  {
    ball.remove();
    ball = createSprite(w/2, h-200, 11, 11);
    ball.shapeColor = color(255,255,255);
  }

  ball.bounce(bricks, brickHit);
    drawSprites();

  if(paddle.position.x < +50){
    paddle.setSpeed(.1, 0);
 }
   if(paddle.position.x > w-50){
    paddle.setSpeed(.01, 180);
 }
}

function brickHit(ball, brick) {
  brick.remove();
}

function keyPressed() {
 if (keyCode == RIGHT_ARROW) {
 paddle.setSpeed(10, 0);
 }
  else if (keyCode == LEFT_ARROW) {
 paddle.setSpeed(10, 180);

 }
  else if (key == ' ') {
    if(ball.velocity.x == 0 && ball.velocity.y == 0)
        ball.setSpeed(MAX_SPEED, random(90-10, 90+10));
     }
  return false;
}

function keyReleased() {
 if (keyCode == RIGHT_ARROW) {
 paddle.setSpeed(.1, 0);
 }
  else if (keyCode == LEFT_ARROW) {
 paddle.setSpeed(.1, 180);
 }

  return false;
}
