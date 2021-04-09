
let path = [];
let numPoints = 100;

function setup() {
	createCanvas(710, 400, WEBGL);

    camera(0, -100, width * 1.5, 0, 0, 0, 0, 1, 0);

    // Rotate on the y axis with the mouse 
    //rotateY(map(mouseX, 0, width, 0, PI));

}

function draw() {
	background(0);

	orbitControl();

	drawGrid();
	drawAxis();
	drawPath(); 

}


function drawAxis() {
	let unit = 100;
	strokeWeight(5);
	//textSize(40);

	// x axis
	stroke(255, 0, 0);
	line(0, 0, 0, unit, 0, 0);
	fill(255, 0, 0);
	//text("X", unit + 5, 0, 0);

	// y axis
	stroke(0, 255, 0);
	line(0, 0, 0, 0, unit, 0);
	fill(0, 255, 0);
	//text("Y", 0, unit + 5, 0);


	// z axis
	stroke(0, 0, 255);
	line(0, 0, 0, 0, 0, unit);
	fill(0, 0, 255);
	//text("Z", 0, 0, unit + 5);
}

function drawGrid() {
	let cellSize = 50; 

	stroke(255);
	strokeWeight(1);

	for (let x = 0; x <= width; x += cellSize) {
		line(x, 0, x, height);
	}

	for (let y = 0; y <= height; y += cellSize) {
		line(0, y, width, y);
	}
}

function drawPath() {
	
	
	//stroke(255, 0, 0);

	// Draw lines
	strokeWeight(3);
	for (let i = 0; i < path.length - 1; i++) {
		let val = i / numPoints * 204.0 + 51;
    	stroke(val);
		line(path[i].x, path[i].y, path[i].z, path[i+1].x, path[i+1].y, path[i+1].z);
	}

	// Draw points
	// strokeWeight(12);
	// path.forEach(p=>{
	// 	point(p.x, p.y);
	// })
}



(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

    function isNumeric(value) {
	    return /^\d+$/.test(value);
	}

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        console.log("connected");

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          let decodedData = parseInt(textDecoder.decode(data), 10);
          if (isNumeric(decodedData)){
          	// path.push(new p5.Vector(mouseX, mouseY, decodedData));
      		 
			
			// Shift all elements 1 place to the left
			for (let i=1; i < numPoints; i++ ) {
				path[i-1] = path[i];
			}

			path[numPoints-1] = new p5.Vector(mouseX, mouseY, decodedData);
      		


          }
        };
      
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length === 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });

  });
})();