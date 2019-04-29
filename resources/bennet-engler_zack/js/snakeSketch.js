
var snake;
var compt = 0;
var scl = 30;
var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;


function setup() {
    var canv = createCanvas(w, h);
    canv.parent("bgCanvas");

    snake = new Snake();

    frameRate(12);

}

function draw() {

    background(30);
    textAlign(RIGHT);
    textSize(12);
    fill(255);
    text("Arrow keys to move", w-50, h-120);
    text("Guide snake to buttons to redirect to page", w-50, h-100);
    noStroke();

    snake.update();
    snake.display();

    if(compt > 0) compt --;

}


function keyPressed(){

    if((keyCode == DOWN_ARROW && compt == 0)){
        var oppositeDir = createVector(0,-1);
        if(oppositeDir.x != snake.dir.x && oppositeDir.y != snake.dir.y) snake.dir = createVector(0,1);
        compt = 1;
    }

    else if((keyCode == UP_ARROW && compt == 0)){
        var oppositeDir = createVector(0,1);
        if(oppositeDir.x != snake.dir.x && oppositeDir.y != snake.dir.y) snake.dir = createVector(0,-1);
        compt = 1;
    }

    else if((keyCode == LEFT_ARROW && compt == 0)){
        var oppositeDir = createVector(1,0);
        if(oppositeDir.x != snake.dir.x && oppositeDir.y != snake.dir.y) snake.dir = createVector(-1,0);
        compt = 1;
    }

    else if((keyCode == RIGHT_ARROW && compt == 0)){
        var oppositeDir = createVector(-1,0);
        if(oppositeDir.x != snake.dir.x && oppositeDir.y != snake.dir.y) snake.dir = createVector(1,0);
        compt = 1;
    }

}
