
let path;


function setup() {
	console.log('setup');
	createCanvas(710, 400, WEBGL);

	path = [];
}

function draw() {
	background(0);

	drawGrid();
	drawAxis();
	drawPath(); 

}


function drawAxis() {
	let unit = 100;
	strokeWeight(5);
	textSize(40);

	// x axis
	stroke(255, 0, 0);
	line(0, 0, 0, unit, 0, 0);
	fill(255, 0, 0);
	text("X", unit + 5, 0, 0);

	// y axis
	stroke(0, 255, 0);
	line(0, 0, 0, 0, unit, 0);
	fill(0, 255, 0);
	text("Y", 0, unit + 5, 0);


	// z axis
	stroke(0, 0, 255);
	line(0, 0, 0, 0, 0, unit);
	fill(0, 0, 255);
	text("Z", 0, 0, unit + 5);
}

function drawGrid() {
	let cellSize = 50; 
	//stroke(255, finishedDrawing? 50 : 255);
	stroke(255);
	strokeWeight(1);

	//pushMatrix()
	for (let x = 0; x <= width; x += cellSize) {
		line(x, 0, x, height);
	}

	for (let y = 0; y <= height; y += cellSize) {
		line(0, y, width, y);
	}
}

function drawPath() {
	stroke(255, 0, 0);

	// Draw lines
	strokeWeight(3);
	for (let i = 0; i < path.length - 1; i++) {
		line(path[i].x, path[i].y, path[i].z, path[i+1].x, path[i+1].y, path[i+1].z);
	}

	// Draw points
	// strokeWeight(12);
	// path.forEach(p=>{
	// 	point(p.x, p.y);
	// })
}