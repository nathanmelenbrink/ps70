/*Katherine Chao
  Programming Basics
  chao.ka@husky.neu.edu
  Final Project 
*/

var nodes = [];
var speed = 0.05;
var selectedNode = 0;

var img = [];
var smallimg = [];
var otherimg=[];
var extraimg=[];
var finalimg=[];
var fiveimg =[];

var ww = 1024;
var hh = 1024;

var title;
var body;



function preload() {
    title= loadFont("assets/brixsansmedium.otf");
    body = loadFont('assets/brixsansregular.otf');
    italic = loadFont('assets/brixsansitalic.otf');


    img[0] = loadImage("assets/star.png"); 
    img[1] = loadImage("assets/earth.png");
    img[2] = loadImage("assets/surface.png");
    img[3] = loadImage("assets/open.png");
    img[4] = loadImage("assets/deep.png");
    img[5] = loadImage ("assets/star.png");

    smallimg[1] = loadImage("assets/smallearth.png");
    smallimg[2] = loadImage("assets/satellite.png");
    smallimg[3] = loadImage("assets/boat.png");
    smallimg[4] = loadImage("assets/octopus.png");
    smallimg[5] = loadImage("assets/dumbo.png");
    smallimg[6] = loadImage("assets/smallearth.png");

    otherimg[1] = loadImage("assets/blank.png");
    otherimg[2] = loadImage("assets/rocket.png");
    otherimg[3] = loadImage("assets/seagulls.png");
    otherimg[4] = loadImage("assets/ray.png");
    otherimg[5] = loadImage("assets/dumbo.png");
    otherimg[6] = loadImage("assets/blank.png");

    extraimg[1] = loadImage("assets/blank.png");
    extraimg[2] = loadImage("assets/blank.png");
    extraimg[3] = loadImage("assets/blank.png");
    extraimg[4] = loadImage("assets/turtle.png");
    extraimg[5] = loadImage("assets/dumbo.png");
    extraimg[6] = loadImage("assets/blank.png");

    finalimg[1] = loadImage("assets/blank.png");
    finalimg[2] = loadImage("assets/blank.png");
    finalimg[3] = loadImage("assets/blank.png");
    finalimg[4] = loadImage("assets/whale.png");
    finalimg[5] = loadImage("assets/dumbo.png");
    finalimg[6] = loadImage("assets/blank.png");

    fiveimg[1] = loadImage("assets/blank.png");
    fiveimg[2] = loadImage("assets/blank.png");
    fiveimg[3] = loadImage("assets/blank.png");
    fiveimg[4] = loadImage("assets/crab.png");
    fiveimg[5] = loadImage("assets/dumbo.png");
    fiveimg[6] = loadImage("assets/blank.png");

}


function setup() {
  
  createCanvas(window.innerWidth, window.innerHeight);

  for (var i = 0; i < places.length; i++) {
    var n = new Node(places[i]);  
    n.image = img[i];
    n.smallimg = smallimg[i]; 
    n.otherimg = otherimg[i];
    n.extraimg = extraimg[i];
    n.finalimg = finalimg[i];
    n.fiveimg = fiveimg[i];
    nodes.push(n)
  }

  translation(0);

  print(nodes);

}


function draw() {

  image(img[0], width/2, height/2, width, height);

  for (var i = 0; i < nodes.length; i++) {
    nodes[i].displaySelected();
    nodes[i].animate();       
  }

  for (var i = 0; i < nodes.length; i++) {
    nodes[i].displayNeighbor();  
  }

}

function mouseClicked() {

  for (var i = 0; i < nodes.length; i++) {
    if (dist(mouseX, mouseY, nodes[i].neighborX, nodes[i].neighborY) < nodes[i].diameter/2){
      selectedNode = i;
      nodes[selectedNode].textSize = 0;
      nodes[selectedNode].textSize2 = 0;
      nodes[selectedNode].textSize3=0;
      nodes[selectedNode].imgSize = 0;
      nodes[selectedNode].imgSize2 =0;
    }
  }

  print(nodes[selectedNode].name + " has been selected");
  translation(selectedNode);
}

function translation(index){

  var amtX = width/2 - nodes[index].x;
  var amtY = height/2 - nodes[index].y;

  for (var i = 0; i < nodes.length; i++) {
    nodes[i].move(nodes[i].x + amtX, nodes[i].y + amtY);  
    nodes[i].selected = false;
    nodes[i].neighbor = false;
  }

  nodes[index].selected = true; 

  for (var i = 0; i < nodes[index].neighbors.length; i++){ 
    for (var j = 0; j < nodes.length; j++){               
      if (nodes[index].neighbors[i] == nodes[j].name){     
        nodes[j].neighbor = true;                        
      }
    }
  }

}


class Node {

  constructor(p) {
    this.name = p.name;
    this.text=p.text;
    this.x = p.x;
    this.y = p.y;
    this.neighbors = p.neighbors;
    this.diameter = 70;
    this.diameterSelected = 400;

    this.targetX = this.x;
    this.targetY = this.y;
    this.neighborX = this.x;
    this.neighborY = this.y;

    this.imageX = p.imageX;
    this.imageY =p.imageY;

    this.selected = false;
    this.neighbor = false;
    
    this.image; 
    this.smallimg;
    this.otherimg;
    this.extraimg;
    this.finalimg;
    this.fiveimg;

    this.textSize = 0;
    this.textSize2 = 0;
    this.textSize3=0;
    this.imgSize = 0;
    this.imgSize2 = 0 ;

    this.direction = 1; // change this to change bouncing speed
  }

  move(_x, _y){
    this.targetX = _x;
    this.targetY = _y;
  }
  
  displaySelected() {
    this.x = lerp(this.x, this.targetX, speed);
    this.y = lerp(this.y, this.targetY, speed);
    
    this.textSize += speed*3.5;
    this.textSize = constrain (this.textSize, 0, 15);

    this.textSize2 += speed*10;
    this.textSize2 = constrain (this.textSize2, 0, 60);

    this.imgSize2 += speed*400;
    this.imgSize2 = constrain (this.imgSize2, 0, width);
 

    if (this.selected){
      fill(0,0,100);
      noStroke();
      imageMode(CENTER);
      image(this.image, this.x, this.y, this.imgSize2, this.imgSize2);
      textAlign(CENTER);
     
      textSize(this.textSize2);
      fill(241,96,88);
      textFont(title);
      text(this.name, this.x-100, this.y-100);

      textAlign(CENTER);
      textSize(this.textSize);
      textFont(body);
      fill(255);
      text(this.text, this.x*1.15 -100, this.y*1.15-100);
 

    } 
  }

  displayNeighbor() {
    
    if (this.neighbor){
      var scale = (this.diameterSelected/2) / dist(nodes[selectedNode].x, nodes[selectedNode].y, this.x, this.y);
      
      this.neighborX = lerp (nodes[selectedNode].x, this.x, scale)+100;
      this.neighborY = lerp (nodes[selectedNode].y, this.y, scale)+100 ;

      this.imageX=lerp(nodes[selectedNode].x, this.x, speed) +100;
      this.imageY=lerp(nodes[selectedNode].y, this.y, speed) +100;

      this.otherimageX=lerp(nodes[selectedNode].x, this.x, speed) -500;
      this.otherimageY=lerp(nodes[selectedNode].y, this.y, speed) -200 ;

      this.extraimageX=lerp(nodes[selectedNode].x, this.x, speed) -300;
      this.extraimageY=lerp(nodes[selectedNode].y, this.y, speed) +200;

      this.finalimageX=lerp(nodes[selectedNode].x, this.x, speed) +500;
      this.finalimageY=lerp(nodes[selectedNode].y, this.y, speed) +100;

      this.fiveimageX=lerp(nodes[selectedNode].x, this.x, speed) +500;
      this.fiveimageY=lerp(nodes[selectedNode].y, this.y, speed) -100;

      this.imgSize += speed*50;
      this.imgSize = constrain (this.imgSize, 0, 250);

      this.textSize3 += speed*2;
      this.textSize3 = constrain (this.textSize3, 0, 12);
 

      image(this.smallimg, this.imageX, this.imageY,this.imgSize, this.imgSize);
      image(this.otherimg, this.otherimageX, this.otherimageY,this.imgSize, this.imgSize);
      image(this.extraimg, this.extraimageX, this.extraimageY, this.imgSize, this.imgSize);
      image(this.finalimg, this.finalimageX, this.finalimageY, this.imgSize, this.imgSize);
      image(this.fiveimg, this.fiveimageX, this.fiveimageY, this.imgSize, this.imgSize);
      
      textFont(italic);
      textSize(this.textSize3);
      fill(255);
      text(this.name, this.neighborX, this.neighborY);
    } 
  }

  // new animate method
  animate(){
    if (this.neighbor){
      var d = dist(mouseX, mouseY, this.neighborX, this.neighborY);
      
      if (frameCount % 30 == 0){
        this.direction *= -1; // reverse every 30 frames
      }
      if (d < this.imgSize/4){
        this.y += this.direction; // add direction to make displacement
      }
    }
  }

}


 
var places = [


 {
    "name":"Space",
    "x":-71.1167,
    "y":42.3770,
    "text":"We're starting out in the emptiness of space. \n Earth looks so small out here. Like a marble. ",
    "imageX":500,
    "imageY":500,
    "otherimageX":100,
    "otherimageY":100,
    "neighbors":["Earth"]

  },
  {
    "name":"Earth",
    "x":-250,
    "y":45,
    "imageX":500,
    "imageY":500,
    "text":"Home sweet home. You can see the satellites here. \n Explorers are leaving for their journey to new worlds.",
    "neighbors":["Surface"]
  },
  {
    "name":"Surface",
    "x":-10,
    "y":-40,
    "imageX":500,
    "imageY":500,
    "otherimageX":100,
    "otherimageY":100,
    "text":"Back where the sky is light blue. Let's start diving.",
    "neighbors":["Open Water"]
  },
  {
    "name":"Open Water",
      "x":-40,
    "y":-40,
    "imageX":-71.10359,
    "imageY":42.366482,
    "text":"Out here in the water, there lives millions of creatures. \n From the tiny constellation-like formations of krill.\n To the mighty whale & cunning octopus.",
    "neighbors":["Deep Water"]
  },

  {
    "name":"Deep Water",
    "x":-1,
    "y":-19,
    "text":"No light reaches this point. \n Strange creatures live here...\n This brings me back to space.",
    "neighbors":["Return"]
  },

  {
    "name":"Return",
    "x":-71.1167,
    "y":42.3770,
    "text":"We're back amongst the stars now. How small we are... \n So this is how it ends.",
    "neighbors":["The End"]

  },

  {
    "name":"The End",
     "x":-71.1167,
    "y":42.3770,
    "text":"Empty",
    "neighbors":["Stop"]


  },



]
