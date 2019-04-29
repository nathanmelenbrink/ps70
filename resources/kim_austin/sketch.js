// Final Project
// Austin Kim

//lists
var planets = [];
var orbs = [];
var buttons = [];
var alerts = [];
var drops = [];
//environment
var degree = 1;
var meter;
var interval = 0;
var pause;
var pulse;
var placeMode;
var speedInc;
var meterInc;
var orbSpeed = 0;
//sounds
var volume;
var curSound;
var sounds = [];
var hits = [];

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function preload() {
	var metro = loadSound('drums/metro.wav');
	var kick1 = loadSound('drums/k1.wav');
	var kick2 = loadSound('drums/k2.wav');
	var kick3 = loadSound('drums/k3.wav');
	var snare1 = loadSound('drums/sn1.wav');
	var snare2 = loadSound('drums/sn2.wav');
	var snare3 = loadSound('drums/sn3.wav');
	var hat1 = loadSound('drums/hat1.wav');
	var hat2 = loadSound('drums/hat2.wav');
	var hat3 = loadSound('drums/hat3.wav');
	var samp1 = loadSound('drums/sampleTest.mp3');
	var samp2 = loadSound('drums/sampleTest2.wav');
	sounds.push(samp2);
	sounds.push(kick1);
	sounds.push(kick2);
	sounds.push(kick3);
	sounds.push(snare1);
	sounds.push(snare2);
	sounds.push(snare3);
	sounds.push(hat1);
	sounds.push(hat2);
	sounds.push(hat3);
	sounds.push(samp1);
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	background(55);
	pause = true;
	print("the pause is " + pause);
	placeMode = false;

	var vSlider = createSlider(0, 1, 1, 0.1);
	vSlider.position(120, 68);
	volume = vSlider.value();

	//interval is 360 divided by even number, usually power of 2
	meter = 32;
	orbSpeed = 1;
	interval = 360/meter;
	speedInc = 0.2;
	angleMode(DEGREES);
	pulse = 0;

	curSound = 1;
	// var planet1 = new Planet(250, width/3, height/2 - 100);
	// var planet2 = new Planet(250, width*2/3, height/2 - 100);
	// var planet3 = new Planet(250, width/2, height/2 + 250);
	// print("First planet's orb size = " + orbs[0].size);
	// planets.push(planet1);
	// planets.push(planet2);
	// planets.push(planet3);

	// Button(type, label, x, y, w, h, color)
	// type 0 = text, 1 = up, 2 = down, 3 = dot, 4 = circle;
	var incSpeed = new Button(1, "", width - 130, 45, 25, 25, 255);
	var decSpeed = new Button(2, "", width - 100, 45, 25 ,25, 255);
	var reset = new Button(0, "reset", width - 65, 45, 40, 26, 255);
	var kB1 = new Button(3, "K1", width-250, 45, 25, 25, 255);
	var kB2 = new Button(3, "K2", width-250, 80, 25, 25, 255);
	var kB3 = new Button(3, "K2", width-250, 115, 25, 25, 255);
	var sB1 = new Button(3, "S1", width-215, 45, 25, 25, 255);
	var sB2 = new Button(3, "S2", width-215, 80, 25, 25, 255);
	var sB3 = new Button(3, "S3", width-215, 115, 25, 25, 255);
	var hB1 = new Button(3, "H1", width-180, 45, 25, 25, 255);
	var hB2 = new Button(3, "H2", width-180, 80, 25, 25, 255);
	var hB3 = new Button(3, "H3", width-180, 115, 25, 25, 255);
	var pMode = new Button(3, "P", 305, 48, 55, 55, 255);
	// var incMeter = new Button(1, "", 305, 45, 25, 25, 255);
	// var decMeter = new Button(2, "", 335, 45, 25, 25, 255);
	buttons.push(incSpeed);
	buttons.push(decSpeed);
	buttons.push(reset);
	buttons.push(kB1);
	buttons.push(kB2);
	buttons.push(kB3);
	buttons.push(sB1);
	buttons.push(sB2);
	buttons.push(sB3);
	buttons.push(hB1);
	buttons.push(hB2);
	buttons.push(hB3);
	buttons.push(pMode);
	// buttons.push(incMeter);
	// buttons.push(decMeter);
	// buttons.push(setMeter);

	var mainPanel = new DropDown(width-130, 85, 105, 3);
	drops.push(mainPanel);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function draw() {
	background(55, 80);
	masterVolume(volume);

	// control tempo
	if (orbSpeed > 5) {
		orbSpeed = 5;
	} else if (orbSpeed < 0.4) {
		orbSpeed = 0.4;
	}

	//draw status bar
	fill(255, 0, 0);
	noStroke();
	rect(0, 0, width, 25);

	fill(255);
	text("Planetary Music Looper V1", width/2, 17);

	// draw status panel
	for (var c = 0; c < drops.length; c++) {
		drops[c].display();
	}
	// text("Current Sound: " + curSound, width*3/4, 18);

	for (var b = 0; b < buttons.length; b++) {
		buttons[b].display();
		// if (b == 2) {
		// 	buttons[b].acti
		// }
	}

	for (var p = 0; p < planets.length; p++) {
		planets[p].display();
		if (planets[p].state != 2) {
			for (var i = 0; i < planets[p].blcks.length; i++) {
				planets[p].blcks[i].display();
				if (planets[p].blcks[i].loopSound()) {
					sounds[0].stop();
				}	
			}
		}
	}

	//
	fill(255);
	noStroke();
	rectMode(CORNER);
	rect(40, 46, 250, 58);
	fill(255, 0 ,0);
	rect(40, 45, 250, 5);

	if (pause) {
		//stop all sound
		// for (var k = 0; k < sounds.length - 1; k++) {
		// 	sounds[k].pause();
		// }
		//draw orbs
		if (pulse == 27) {
			// print("it is pulsing");
			for (var j = 0; j < orbs.length; j++) {
				orbs[j].display();
			}
			pulse = 0;
		} else {
			pulse +=0.5;
		}
		//play button
		noStroke();
		fill(255, 0, 0);
		triangle(65, 65, 65, 90, 90, 77.5);
	}

	else {
		degree+= orbSpeed;

		if (degree >= 360) {
			degree = 1;
		}

		for (var t = 0; t < orbs.length; t++) {
				orbs[t].display();
		}

		//pause button
		noStroke();
		fill(255, 0, 0);
		rect(65, 65, 10, 25);
		rect(80, 65, 10, 25);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function keyPressed() {
	if (key == ' ') {
		pause = !pause;
	} else if (key === '0') {
		curSound = 0;
		print("curSound is k" + curSound);
	} else if (key === '1') {
		curSound = 1;
		print("curSound is k" + curSound);
	} else if (key === '2') {
		curSound = 2;
		print("curSound is k" + curSound);
	} else if (key === '3') {
		curSound = 3;
		print("curSound is k" + curSound);
	} else if (key === '4') {
		curSound = 4;
		print("curSound is k" + curSound);
	} else if (key === '5') {
		curSound = 5;
		print("curSound is k" + curSound);
	} else if (key === '6') {
		curSound = 6;
		print("curSound is k" + curSound);
	} else if (key === '7') {
		curSound = 7;
		print("curSound is k" + curSound);
	} else if (key === '8') {
		curSound = 8;
		print("curSound is k" + curSound);
	} else if (key === '9') {
		curSound = 9;
		print("curSound is k" + curSound);
	} else if (key === 'p') {
		placeMode = !placeMode;
		print("placemode is " + placeMode);
	}
}

function mouseClicked() {
	// call blocks clicked/active function
	for (var p = 0; p < planets.length; p++) {
		if (planets[p].hover()) {
				planets[p].toggle();
			}
		for (var i = 0; i < planets[p].blcks.length; i++) {
			if (abs(mouseX - planets[p].blcks[i].x) <= planets[p].blcks[i].size &&
				abs(mouseY - planets[p].blcks[i].y) <= planets[p].blcks[i].size) {
				planets[p].blcks[i].toggle();
				planets[p].blcks[i].setSound();
				// print("This block degree is: " + planets[p].blcks[i].deg);
				print("block status is: " + planets[p].blcks[i].active);
				print("block type is: " + planets[p].blcks[i].type);
			}
		}
	}

	for (var j = 0; j < drops.length; j++) {
		if (drops[j].hover()) {
			drops[j].toggle();
		}
		// if (j = 0) {

		// }
	}

	// place new planet
	if (placeMode) {
		if (mouseY > 200) {
			var planetX = new Planet(300, mouseX, mouseY);
			planets.push(planetX);
		}
	}

	// play / pause
	if (mouseX >= 65 && mouseX <= 90 && mouseY >= 65 && mouseY <= 90) {
		pause = !pause;
		print("button hit");
		for (var s = 0; s < sounds.length; s++) {
			sounds[s].pause;
		}
	}

	// control specific button actions
	for (var b = 0; b < buttons.length; b++) {
		if (buttons[b].hover()) {
			if (b == 0) {
				orbSpeed += speedInc;
			} else if (b == 1) {
				orbSpeed -= speedInc;
			} else if (b == 2) {
				for (var p = 0; p < planets.length; p++) {
					for (var i = 0; i < planets[p].blcks.length; i++) {
						if (planets[p].blcks[i].active) {
							planets[p].blcks[i].toggle();
						}
					}
				}
			} else if (b > 2 && b < 12) {
				buttons[b].toggle();
				curSound = b - 2;
				print("curSound is " + curSound);
				// for (x = 3; x < 12; x++) {
				// 	if (x != b) {
				// 		buttons[x].toggle();
				// 	}
				// }
			} else if (b == 12) {
				buttons[b].toggle();
				placeMode = !placeMode;
				print("placemode is " + placeMode);
			}
		}
	}	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

class Planet {
	constructor(size, x, y) {
		this.size = size;
		this.x = x;
		this.y = y;
		this.col = color(0, 50, 140);
		this.blcks = [];
		// 0 = active, 1 = continuous, 2 = off;
		this.state = 0;
		// Block(type, x, y, size, deg, isHit, gs)
		for (var i = 0; i < meter; i++) {
			var b = new Block(1, this.x + (this.size / 2) * cos(i * interval), 
								 this.y + (this.size / 2) * sin(i * interval), this.size/30, i * interval, false, 55);
			this.blcks.push(b);
		}
		var anOrb = new Orb(this.x, this.y, this.size/30, (this.size*2) / 3);
		orbs.push(anOrb);
		print("size: " + orbs[0].size + " x: " + orbs[0].x + " y: " + orbs[0].y + " orbit length: " + orbs[0].orbit);
	}

	// ADD A WAY TO NAME / TYPE TEXT ONTO MIDDLE OF PLANET

	display() {
		var alpha = 255;
		if (this.hover()) {
			alpha = 150;
		} else {
			alpha = 255;
		}
		// stroke(255);
		// for (var i = 1; i < interval - 1; i++) {
		// 	line(0,0, width, 0);
		// }
		noStroke();
		fill(this.col, alpha);
		ellipseMode(CENTER);
		ellipse(this.x, this.y, this.size, this.size);
		fill(150, alpha);
		rectMode(CENTER);
		rect(this.x, this.y, this.size/4, this.size/4);
	}

	hover() {
		if (abs(mouseX - (this.x)) <= this.size/7 &&
			abs(mouseY - (this.y)) <= this.size/7) {
			return true;
		}
		else {
			return false;
		}
	}

	toggle() {
		this.state+=1;
		if (this.state > 2) {
			this.state = 0;
		}
	}

	// pushOrb() {
	// 	// Orb(x, y, size, orbit)
	// 	var anOrb = new Orb(this.x, this.y, this.size/30, (this.size*2) / 3);
	// 	orbs.push(anOrb);
	// }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

class Block {
	constructor(type, x, y, size, deg, isHit, gs) {
		// 0 = off, 1 = hovered, 2 = active
		this.state = 0;
		// grayscale value
		this.gs = gs;
		this.type = type;
		this.active = false;
		this.x = x;
		this.y = y;
		this.size = size;
		this.deg = deg;
		this.isHit = isHit;
	}

	display() {
		var hitbox = 0;
		var alpha;
		var r = 245;
		var g = 235;
		var b = 0;

		if (orbSpeed < 1) {
			hitbox = orbSpeed/2;
		} else {
			hitbox = orbSpeed;
		}

		if (this.active) {
			if (abs(this.deg - degree) < hitbox) {
				this.state = 2;
				print("a block is hit. the type is: " + this.type); 
				alpha = 250;
				r = 255;
				g = 255;
				b = 220;
				sounds[this.type].play();
			} else {
				alpha = 200;
			}
		} else if (this.hover()) {
			this.state = 1;
			alpha = 50;
			// print("the state is hover. This block degree is: " + circle1.blcks[i].deg);
		} else {
			this.state = 0;
			alpha = 10;
		}

		noStroke();
		fill(r, g, b, alpha);
		ellipseMode(CENTER);
		ellipse(this.x, this.y, this.size, this.size);
	}

	hover() {
		if (abs(mouseX - this.x) <= this.size &&
			abs(mouseY - this.y) <= this.size) {
			return true;
		}
		else {
			return false;
		}
	}

	loopSound() {
		if (sounds[0].isPlaying() && this.type == 0 && this.active) {
			return true;
		}
	}

	setSound() {
		this.type = curSound;
	}

	toggle() {
		this.active = !this.active;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

class Orb {
	constructor(x, y, size, orbit) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.orbit = orbit;
		// this.speed = speed;
	}

	display() {
		noStroke();
		fill(255);
		var orbX = this.x + this.orbit * cos(degree);
		var orbY = this.y + this.orbit * sin(degree);

		ellipse(orbX, orbY, this.size, this.size);
		// print("the orb size is " + this.size);
	}

	// increment() {
	// 	this.x 
	// }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

class Button {
	constructor(type, label, x, y, w, h, color) {
		this.type = type;
		this.label = label;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = color;
		this.active = false;
	}

	display() {
		var alpha = 250;
		if (this.hover()) {
			alpha = 150;
		} else {
			alpha = 250;
		}

		fill(this.color, 0, 0, alpha);
		if (this.type == 0) {
			// label
			noStroke();
			fill(this.color, alpha);
			rect(this.x, this.y, this.w, this.h);
			fill(this.color, 0, 0, alpha);
			rect(this.x, this.y, this.w, this.h/6);
			fill(abs(this.color - 255), alpha);
			textAlign(CENTER);
			text(this.label, this.x+2, this.y+8, this.w, this.h);
		} else if (this.type == 1) {
			// up
			noStroke();
			fill(this.color, alpha);
			rect(this.x, this.y, this.w, this.h);
			fill(this.color, 0, 0, alpha);
			triangle(this.x + this.w/5, this.y + (this.h*4/5), this.x + this.w/2, this.y + this.h/5, this.x + (this.w*4/5), this.y + (this.h*4/5));
		} else if (this.type == 2) {
			// down
			noStroke();
			fill(this.color, alpha);
			rect(this.x, this.y, this.w, this.h);
			fill(this.color, 0, 0, alpha);
			triangle(this.x + this.w/5, this.y + this.h/5, this.x + (this.w*4/5), this.y + this.h/5, this.x + this.w/2, this.y + (this.h*4/5));
		} else if (this.type == 3) {
			// circle
			if (this.active) {
				fill(this.color, 0, 0, alpha);
				ellipseMode(CORNER);
				ellipse(this.x, this.y, this.w, this.h);
				fill(abs(this.color), alpha);
				textAlign(CENTER);
				text(this.label, this.x+1, this.y+6, this.w, this.h);
			} else {
				fill(this.color, alpha);
				ellipseMode(CORNER);
				ellipse(this.x, this.y, this.w, this.h);
				fill(abs(this.color - 255), alpha);
				textAlign(CENTER);
				text(this.label, this.x+1, this.y+6, this.w, this.h);
			}		
		}
	}

	hover() {
		if (abs(mouseX - (this.x + this.w/2)) <= this.w/2 &&
			abs(mouseY - (this.y + this.h/2)) <= this.h/2) {
			return true;
		}
		else {
			return false;
		}
	}

	toggle() {
		this.active = !this.active;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

class DropDown {
	constructor(x, y, w, drops) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.drops = drops;
		this.active = false;
	}

	display() {
		var alpha = 255;
		if (this.hover()) {
			alpha = 150;
		} else {
			alpha = 255;
		}
		if (this.active) {
			fill(255);
			rectMode(CORNER);
			rect(this.x, this.y+10, this.w, 30*this.drops);
			fill(0);
			text("Current Sound: " + curSound, this.x + 2, this.y + 27, this.w, 30);
			text("Meter: " + meter, this.x + 2, this.y + 47, this.w, 30);
			text("Track Speed: " + orbSpeed, this.x + 2, this.y + 67, this.w, 30);
		}
		fill(255, 0, 0, alpha);
		rect(this.x, this.y, this.w, 10);
	}

	hover() {
		if (abs(mouseX - (this.x + this.w/2)) <= this.w/2 &&
			abs(mouseY > this.y - 1 && mouseY < this.y + 11)) {
			return true;
		} else {
			return false;
		}
	}

	toggle() {
		this.active = !this.active;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// class alert {
// 	constructor(alert) {
// 		this.alert = alert;
// 	}

// 	display() {
// 		fill(200, 10);
// 		rectMode(CORNER);
// 		rect(0, 0, width, height); 
// 		fill(255);
// 		rectMode(CENTER);
// 		rect(width/2, height/2, 150, 75);
// 		fill(255, 0, 0);
// 		rect(width/2, height/2 - 70, 150, 5);
// 		fill(0);
// 		textAlign(CENTER);
// 		text(this.alert, width/2, height/2, 150, 75);
// 	}
// }









