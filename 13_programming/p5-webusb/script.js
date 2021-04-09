
let path = [];


function setup() {
	console.log('setup');
	createCanvas(710, 400, WEBGL);

	// Move the camera on the z axis (pointing toward the screen)
    camera(0, -100, width * 1.5, 0, 0, 0, 0, 1, 0);

    // Rotate on the y axis with the mouse 
    rotateY(map(mouseX, 0, width, 0, PI));

	// path = [];
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


(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        console.log("connected");

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          //console.log(data);
          //console.log(textDecoder.decode(data));
          path.add(new p5.Vector(mouseX, mouseY, textDecoder.decode(data)));
          // if (data.getInt8() === 13) {
          //   currentReceiverLine = null;
          // } else {
          //   appendLine('receiver_lines', textDecoder.decode(data));
          // }
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

    // let colorPicker = document.getElementById("color_picker");

    // colorPicker.addEventListener("change", function(event) {
    //   port.send(new TextEncoder("utf-8").encode(colorPicker.value));
    // });
  });
})();