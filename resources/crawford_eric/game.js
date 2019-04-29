/*
Eric Crawford
Programming Basics
School email:        crawford.er@husky.neu.edu
Google Group email:  132435az@gmail.com
Final Project
Action Command RPG
*/

//p5.js and documentation from:
//https://p5js.org/reference/

//p5.play and documentation from:
//http://p5play.molleindustria.org/docs/index.html

//I referenced the TF2 item schema while designing my json files, obtained from:
//http://api.steampowered.com/IEconItems_440/GetSchema/v0001/?key=6A50B013B18080A4F31DBCDCD19995C4.

//Method for wrapping functions to be called later adapted from:
//https://stackoverflow.com/a/899133

//Algorithm for randomly selecting weighted entries in a list adapted from:
//https://softwareengineering.stackexchange.com/questions/150616/return-random-list-item-by-its-weight

var button_height;
var battle_mode = false;
var player_turn = true;
var txt_color = 0;
var wandering = false;
var battle_start = false;
var battle_setup = false;
var battle_end = false;
var world_paused = false;
var current_encounter;
var attacking_enemy;
var target_index;

var SCENE_W = 2000;
var SCENE_H = 800;

////////////////////////////////////////////////////////////////////////////////

//Get assets
function preload() {

  button_img = loadImage("./game_assets/button.png");
  sword_img = loadImage("./game_assets/sword.png");
  bow_img = loadImage("./game_assets/bow.png");
  recover_img = loadImage("./game_assets/recover.png");
  run_img = loadImage("./game_assets/run.png");
  arrow_img = loadImage("./game_assets/arrow.png");
  data = loadJSON("enemies.json");

  player_idle = loadAnimation("./game_assets/knight_idle_1.png", "./game_assets/knight_idle_6.png");
  player_idle_flipped = loadAnimation("./game_assets/knight_idle_flipped_0.png", "./game_assets/knight_idle_flipped_5.png");
  player_idle.frameDelay = 12;
  player_idle_flipped.frameDelay = 12;

  player_run = loadAnimation("./game_assets/knight_run_0.png", "./game_assets/knight_run_9.png");
  player_run.frameDelay = 6;

  player_run_flipped = loadAnimation("./game_assets/knight_run_flipped_0.png", "./game_assets/knight_run_flipped_9.png");
  player_run_flipped.frameDelay = 6;

  player_strike = loadAnimation("./game_assets/knight_swing0.png", "./game_assets/knight_swing7.png");
  player_strike.playing = false;

  player_shoot = loadAnimation("./game_assets/knight_bow_0.png", "./game_assets/knight_bow_2.png")
  player_shoot_done = loadImage("./game_assets/knight_bow_3.png")
  player_shoot.frameDelay = 12;

  enemy_idle = loadAnimation("./game_assets/enemy_idle0.png", "./game_assets/enemy_idle5.png");
  enemy_idle.frameDelay = 12;

  enemy_strike = loadAnimation("./game_assets/enemy_swing_0.png", "./game_assets/enemy_swing_6.png");
  enemy_strike.frameDelay = 12;

  battle_top = loadImage("./game_assets/battle_top.png");
  battle_bottom = loadImage("./game_assets/battle_bottom.png");

}

////////////////////////////////////////////////////////////////////////////////

function setup() {
  textAlign(CENTER);
  createCanvas(800, 600);

  enemies = data.enemies;
  encounters = data.encounters;

  //Create background group
  bg = new Group();

  //Encounter group for collisions
  encount_spr = new Group();

  //Create player
  player = new Player(SCENE_W/2, SCENE_H/2);

  //Set up the damage indicators
  indicators = new Array();

  //Used for targeting in battle and stuff
  enemy_array = new Array();

  //Used to queue up player moves
  player_moves = new Array();
  player_moves_readable = new Array();

  selector = createSprite((SCENE_W/2), (SCENE_H/2));
  selector.scale = 0.25;
  selector.addImage(arrow_img);

  //Set up the battle background
  back_top = createSprite((SCENE_W/2) + 190, - height);
  back_top.addImage(battle_top);
  back_top.scale = 0.55;
  back_bottom = createSprite((SCENE_W/2) + 190, SCENE_H + height);
  back_bottom.addImage(battle_bottom);
  back_bottom.scale = 0.55;

  //Set up battle buttons
  battle_buttons = new Array();
  battle_button_height = height - (height/8);

  battle_buttons.push(new battle_button(0, height+this.height, "Sword"));
  battle_buttons.push(new battle_button(0, height+this.height, "Bow"));
  //battle_buttons.push(new battle_button(0, height+this.height, "Special"));
  battle_buttons.push(new battle_button(0, height+this.height, "Recover"));
  battle_buttons.push(new battle_button(0, height+this.height, "Run!"));

  // TODO: Make a test level and add simple encounters and a layout

  //Set up encounters
  // TODO: This is debug code, make this happen dynamically when loading rooms, instead of in setup
  enemy_encounters = new Array();
  enemy_encounters.push(new Encounter(1, SCENE_W/2 + 600, SCENE_H/2 + 200));
  enemy_encounters.push(new Encounter(0, SCENE_W/2 - 200, SCENE_H/2 - 400));
  enemy_encounters.push(new Encounter(3, SCENE_W/2 + 800, SCENE_H/2 + 400));
  enemy_encounters.push(new Encounter(4, SCENE_W/2 - 600, SCENE_H/2 + 400));

  //Resize/position buttons based on the number that exist
  for(var i = 0; i<battle_buttons.length; i++) {

    battle_buttons[i].spr.position.x = (((width + (battle_buttons[i].spr.width)/2)/(battle_buttons.length + 1)) * (i+1)) - (battle_buttons[i].spr.width)/4;
    battle_buttons[i].spr.setCollider("rectangle", 0, 0, battle_buttons[i].spr.width, battle_buttons[i].spr.height);
  }

  //Debug code for collidable objects, reuse this with invisible
  //objects to match background later
  coll = new Group();
  coll.add(block = createSprite(350, 400, 200, 200));
  coll.add(block2 = createSprite(500, 500, 200, 200));
  coll.add(block2 = createSprite(1200, 200, 400, 200));
  coll.add(block2 = createSprite(1200, 700, 400, 200));

  block.shapeColor = 0;
  block2.shapeColor = 0;

  for(var i = 0; i<coll.length; i++) {
    coll[i].shapeColor = 0;
    //coll[i].debug = true;
  }

}

////////////////////////////////////////////////////////////////////////////////

function draw() {

  target_index = constrain(player_moves.length, 0, enemy_array.length-1);

  background(255);

  //Enable the camera to draw everything other than the HUD
  camera.on();

  //Draw and turn on collisions for everything outside of battle
  if (world_paused == false){
    player.move();
    player.spr.collide(coll);
    for (var i = 0; i < enemy_encounters.length; i++) {
      enemy_encounters[i].spr.collide(coll);
      enemy_encounters[i].spr.collide(encount_spr);
    }

    //Draw the borders, this is temporary until art and collisions are done
    fill(0,0);
    stroke(0);
    rect(0 - player.spr.width/2, 0 - player.spr.height/2, SCENE_W + player.spr.width, SCENE_H + player.spr.height);
  }

  //Draw the background and collidable objects until the battle background is in place
  if(battle_mode == false){

    bg.draw();
    coll.draw();

    //Draw encounters
    for (var i = 0; i < enemy_encounters.length; i++) {
      enemy_encounters[i].display();
      if(world_paused == false){
        enemy_encounters[i].move();
      }
    }

  }

  //Draw battle backgrounds
  drawSprite(back_bottom);
  drawSprite(back_top);

  //Draw enemies in battle
  for (var i = 0; i < enemy_array.length; i++) {
    enemy_array[i].display();
  }

  //Draw player
  player.display();

  //Draw damage counters
  for (var i = 0; i < indicators.length; i++) {
    indicators[i].display();
  }

  //Run the battle loop
  if(world_paused == true) {
   player.battle_active();
 }

  //Disable camera to draw the HUD
  camera.off();

  //Switching to battle
  if(world_paused == true && battle_setup == true){
    player.battle_prep();

    //Shows Battle! text
    if (txt_color >= 10){
      txt_color = lerp(txt_color, 0, 0.05);
      fill(0, txt_color);
      textSize(64);
      text("Battle!", width/2 - 100, height/2);
    }
  }

  //Exit battle
  if(world_paused == true && battle_end == true){
    player.battle_exit();

    //Show "Explore!" text when switching modes
    if (txt_color >= 10){
      txt_color = lerp(txt_color, 0, 0.05);
      fill(0, txt_color);
      textSize(64);
      text("Explore!", width/2 - 120, height/2);
    }
  }

  //Draw the battle buttons
  for(var i = 0; i<battle_buttons.length; i++) {
    battle_buttons[i].display();
  }

  //Debug text/instructions
  fill(0);
  textSize(24);
  textAlign(LEFT);
  //text("WASD to move while outside of battle", 20, 60);
  //text("Press q to remove moves from the queue, and e to perform queued up moves when the queue is full", 20, 80);

  text("Next Moves:", 20, 60);
  if (player_moves_readable[0] != null){
    text(player_moves_readable[0], 20, 85);
  }
  if (player_moves_readable[1] != null){
    text(player_moves_readable[1], 20, 110);
  }

  //Health bar
  playerHealth();

}

////////////////////////////////////////////////////////////////////////////////

class Player{

  //Set up the player
  constructor(x,y){

    //Create sprite and collisions
    this.spr = createSprite(x, y, 50, 100);
    this.spr.addAnimation("idle", player_idle);
    this.spr.addAnimation("idle_flipped", player_idle_flipped);
    this.spr.addAnimation("run", player_run);
    this.spr.addAnimation("run_flipped", player_run_flipped);
    this.spr.addAnimation("attack_sword", player_strike);
    this.spr.addAnimation("attack_bow", player_shoot);
    this.spr.addAnimation("attack_bow_finished", player_shoot_done);

    this.spr.scale = 0.3;

    this.flipped = false;

    this.spr.setCollider("rectangle", 0, 25, 200, 200);
    //this.spr.debug = true;

    this.max_health = 10;
    this.current_health = 10;

    this.can_be_attacked = true;

    //This determines if the player can add moves to the queue
    this.can_attack = true;
    this.in_progress = false;

    //For blocking/dodging
    this.blocking = false;
    this.can_block = true;

    //Stuff for the sword attack
    this.sword_counter = 0;
    this.swordID;

    //Stuff for the Run move
    this.run_meter = 0;
    this.run_visible = false;
    this.meter_drop;

    this.spr.world_position = createVector(this.spr.position.x, this.spr.position.y);

    this.battle_home = createVector(SCENE_W/2, SCENE_H/2);
    this.battle_position = this.battle_home;

  }

  //Draw the player
  display(){

    fill(0,50);
    noStroke();
    ellipse(this.spr.position.x, this.spr.position.y + 45, 70, 20);

    drawSprite(this.spr);

    if(this.blocking == true){

      textSize(24);
      fill(0);
      text("Blocking!", this.spr.position.x - 50, this.spr.position.y - 75);

    }

  }

  //Let the player move around, have the camera follow them
  //Only to be called outside of battle!
  move(){

    if(keyDown("w")) {
      this.spr.addSpeed(3, -90);
    }
    if (keyDown("s")) {
      this.spr.addSpeed(3, 90);
    }
    if (keyDown("a")) {
      this.spr.addSpeed(3, 180);
      if(this.flipped == false){
        this.flipped = true;
      }
    }
    if (keyDown("d")) {
      this.spr.addSpeed(3, 0);
      if(this.flipped == true){
        this.flipped = false;
      }
    }

    if(this.spr.velocity.mag() > 0){

      if(this.flipped == false){
        this.spr.changeAnimation("run");
      } else {
        this.spr.changeAnimation("run_flipped");

      }

    }

    if(keyDown("w") != true && keyDown("s") != true && keyDown("a") != true && keyDown("d") != true){

      if(this.flipped == false){
        this.spr.changeAnimation("idle");
      } else {
        this.spr.changeAnimation("idle_flipped");
      }

    }

    this.spr.limitSpeed(12);
    this.spr.friction = 0.2;

    //set the camera position to the player position
    camera.position.lerp(this.spr.position, 0.3);

    //Zoom the camera based on velocity
    var scl_lerp = lerp(camera.zoom, 1 / (this.spr.velocity.mag()*0.03 + 1), 0.05);
    camera.zoom = scl_lerp;

    //limit the player movements
    if(this.spr.position.x < -60)
      this.spr.position.x = -60;
    if(this.spr.position.y < -85)
      this.spr.position.y = -85;
    if(this.spr.position.x > SCENE_W + 60)
      this.spr.position.x = SCENE_W + 60;
    if(this.spr.position.y > SCENE_H + 35)
      this.spr.position.y = SCENE_H + 35;

  }

  //Moves player to center and sets up battle
  battle_prep(){

    world_paused = true;

    if(battle_start == true){
      this.spr.changeAnimation("idle");
      this.flipped = false;
      this.spr.world_position.set(this.spr.position.x, this.spr.position.y);
      this.can_be_attacked = false;
      battle_start = false;
    }

    //text("Battle Prep!", 100, 140);

    if((this.spr.position.y - (SCENE_H/2)) <= 0.15 && (this.spr.position.y - (SCENE_H/2)) >= -0.15 && (this.spr.position.x - (SCENE_W/2)) <= 0.15 && (this.spr.position.x - (SCENE_W/2) >= -0.15)){

      back_top.position.y = (SCENE_H/2) - 75;
      back_bottom.position.y = (SCENE_H/2) - 75;

      //Snap camera to correct position if it's not there yet
      camera.position.home = createVector(player.spr.position.x + width/4, player.spr.position.y - 50);
      camera.battle_zoom = 1;
      camera.battle_position = camera.position.home;

      camera.position.set(camera.position.home);

      //Snap enemies to battle positions if they haven't reached it yet
      for (var i = 0; i < enemy_array.length; i++) {
        enemy_array[i].spr.position.set(enemy_array[i].spr.home_position);
      }

      this.run_meter = 0;

      //Start the battle once setup is done!
      battle_setup = false;
      battle_mode = true;

    } else {

      var backy_lerp = lerp(back_top.position.y, (SCENE_H/2) - 75, 0.1);
      back_top.position.y = backy_lerp;
      var bottomy_lerp = lerp(back_bottom.position.y, (SCENE_H/2) - 75, 0.1);
      back_bottom.position.y = bottomy_lerp;

      //Move player to the center of the scene for battle
      var posx_lerp = lerp(this.spr.position.x, (SCENE_W/2), 0.1);
      this.spr.position.x = posx_lerp;
      var posy_lerp = lerp(this.spr.position.y, (SCENE_H/2), 0.1);
      this.spr.position.y = posy_lerp;

      //camera during battle setup
      var camx_lerp = lerp(camera.position.x, player.spr.position.x + width/4, 0.1);
      camera.position.x = camx_lerp;
      var camy_lerp = lerp(camera.position.y, player.spr.position.y - 50, 0.1);
      camera.position.y = camy_lerp;

      //Zoom the camera in for battle mode
      var scl_lerp = lerp(camera.zoom, 1, 0.1);
      camera.zoom = scl_lerp;

      //Move enemies to battle positions
      for (var i = 0; i < enemy_array.length; i++) {
        enemy_array[i].slideIn();
      }

    }

  }

  //Moves player back to position and ends battle
  battle_exit(){

    player_moves = [];

    //text("Battle Exit!", 100, 140);

    if((this.spr.position.y - this.spr.world_position.y) <= 0.2 && (this.spr.position.y - this.spr.world_position.y) >= -0.2){

      //Remove any enemies you ran from
      for (var i = 0; i < enemy_array.length; i++) {
        enemy_array[i].spr.remove();
      }


      //Clear all battle arrays so they don't overfill in the next fight
      enemy_array = [];
      player_moves = [];
      player_moves_readable = [];

      //Set the player back to their default battle state
      player.can_attack = true;
      player.in_progress = false;

      //Hide battle background
      back_top.position.y = -back_top.height;
      back_bottom.position.y = SCENE_H + back_top.height;

      //Exit battle
      battle_end = false;
      world_paused = false;

      //Pause before enemies can attack again
      setTimeout("player.can_be_attacked = true;", 1500);

    } else {

      //Move background out
      var backy_lerp = lerp(back_top.position.y, -back_top.height, 0.03);
      back_top.position.y = backy_lerp;
      var bottomy_lerp = lerp(back_bottom.position.y, SCENE_H + back_bottom.height, 0.03);
      back_bottom.position.y = bottomy_lerp;

      //Move to position to exit battle
      this.spr.position.lerp(this.spr.world_position, 0.1);

      //set the camera position to the player position
      camera.position.lerp(this.spr.position, 0.3);

      //Zoom the camera based on velocity
      var scl_lerp = lerp(camera.zoom, 1 / (this.spr.velocity.mag()*0.01 + 1), 0.05);
      camera.zoom = scl_lerp;

      //Move living enemies out
      for (var i = 0; i < enemy_array.length; i++) {
        enemy_array[i].slideOut();
      }

    }

  }

  battle_active(){

    this.run_meter = constrain(this.run_meter, 0, 100);

    if(battle_mode == true){

      //Lerp camera to desired zoom at all times for fancy cinematics
      var scl_lerp = lerp(camera.zoom, camera.battle_zoom, 0.1);
      camera.zoom = scl_lerp;

      //Lerp camera to desired position at all times for fancy cinematics
      camera.position.lerp(camera.battle_position, 0.1);

      this.spr.position.lerp(this.battle_position, 0.1);

    }

    if(this.run_visible == true){

      fill(0);
      textSize(24);
      text("Tap E!", this.spr.position.x - 25, this.spr.position.y - 125);

      fill(200, 200, 200);
      stroke(0);
      rect(this.spr.position.x - 40,this.spr.position.y + 70, 80, 10);
      noStroke();
      fill(255, 0, 0);
      rect(this.spr.position.x - 38,this.spr.position.y + 72, 77*(this.run_meter/100),7);


    }


    if(player_turn == true && player_moves.length < 2 && this.in_progress == false){

      this.can_attack = true;

    } else {

      this.can_attack = false;

    }

    if(this.can_attack == true && enemy_array.length > 0){

      var target_index = constrain(player_moves.length, 0, enemy_array.length-1);

      selector.heightchange = (Math.sin(millis()/100)*3);
      var posx_lerp = lerp(selector.position.x, enemy_array[target_index].spr.position.x, 0.1);
      selector.position.x = posx_lerp;
      var posy_lerp = lerp(selector.position.y, enemy_array[target_index].spr.position.y - 125 - selector.heightchange, 0.1);
      selector.position.y = posy_lerp;

      drawSprite(selector);

    } else if (enemy_array.length == 0){

      if(battle_mode == true){

        enemy_encounters[current_encounter].spr.remove();
        enemy_encounters.splice(current_encounter, 1);

        battle_mode = false;

        this.spr.changeAnimation("idle");
        setTimeout("battle_end = true;txt_color = 255;", 1000);

      }

    }

    //Run if the meter is full
    if(this.run_meter >= 100){

      this.spr.changeAnimation("idle");

      this.run_meter = 0;
      this.run_visible = false;
      txt_color = 255;
      battle_end = true;
      battle_mode = false;

    }

  }

  //Used for all modification of player health at the moment, may change to be
  //a more generalized function and have other functions do the calculations
  modify_health(value, _mode){

    if(this.blocking == true){

      this.health_change = ceil(value/2);

    } else {

      this.health_change = value;

    }

    switch (_mode) {

      //Adds VALUE to CURRENT health, negatives REMOVE health
      case 'add':
        this.current_health += this.health_change;
        indicators.push(new Indicator(this.health_change, this.spr.position.x, this.spr.position.y - 100));
        break;
      //Removes health
      case 'remove':
        this.current_health -= value;
        indicators.push(new Indicator(-this.health_change, this.spr.position.x, this.spr.position.y - 100));
        break;
      //Divides CURRENT health by VALUE
      case 'divide':
        if (value != 0 && this.current_health != 0){
          indicators.push(new Indicator(ceil(this.current_health/this.health_change) - this.current_health, this.spr.position.x, this.spr.position.y - 100));
          this.current_health = ceil(this.current_health/this.health_change);
        }
        break;
      //Adds a percent of MAX health
      case 'add_percent':
        if (value != 0){
          this.current_health += ceil(map(this.health_change, 0, 100, 0, this.max_health));
          indicators.push(new Indicator(ceil(map(this.health_change, 0, 100, 0, this.max_health)), this.spr.position.x, this.spr.position.y - 100));
        }
        break;
      //Removes percent of CURRENT health
      case 'remove_percent':
        if (value != 0){
          var health_removed = -(ceil(map(this.health_change, 0, 100, 0, this.current_health)));
          this.current_health -= ceil(map(this.health_change, 0, 100, 0, this.current_health));
          indicators.push(new Indicator(health_removed, this.spr.position.x, this.spr.position.y - 100));
        }
        break;
      //If no mode is specified, just simulate ADD
      default:
        this.current_health += this.health_change;
        indicators.push(new Indicator(this.health_change, this.spr.position.x, this.spr.position.y - 100));
        break;

    }

  }

  sword(target){

    if(this.sword_counter == 0){

      this.sword_target = target;

      setTimeout("player.sword_counter = 1;",1000);
      //print(createVector(enemy_array[target_index].spr.position.x - 100, enemy_array[target_index].spr.position.y));
      setTimeout("player.battle_position = createVector(player.sword_target.spr.home_position.x - 75, player.sword_target.spr.home_position.y);",100);
      setTimeout("camera.battle_position = createVector(player.sword_target.spr.home_position.x, player.sword_target.spr.home_position.y - 50);camera.battle_zoom = 1.2;", 100);

      setTimeout("player.spr.changeAnimation('attack_sword');", 1000);
      setTimeout("player.spr.animation.changeFrame(0);", 1000);
      this.swordID1 = setTimeout("player.spr.animation.nextFrame();camera.battle_zoom = 1.3;", 1200);
      this.swordID2 = setTimeout("player.spr.animation.nextFrame();camera.battle_zoom = 1.4;", 1400);
      this.swordID3 = setTimeout("player.spr.animation.nextFrame();camera.battle_zoom = 1.5;", 1600);
      this.swordID4 = setTimeout("player.spr.animation.nextFrame();camera.battle_zoom = 1.6;", 1800);
      this.swordID5 = setTimeout("player.spr.animation.nextFrame();player.sword_counter = 2;camera.battle_position = player.battle_position;", 2000);
      this.swordID6 = setTimeout("camera.battle_position = camera.position.home;camera.battle_zoom = 1;player.battle_position = player.battle_home; player.sword_counter = 0;player.flipped = true; player.spr.changeAnimation('run_flipped');", 3000);
      this.swordID7 = setTimeout("player.flipped = false; player.spr.changeAnimation('idle');", 3500);
      this.swordID8 = setTimeout(runMoves, 3500);

    }

    if(this.sword_counter == 1){
      this.sword_counter = 2;
      setTimeout("player.spr.animation.changeFrame(6);camera.battle_zoom = 1.2;", 100);
      setTimeout("player.spr.animation.changeFrame(7);", 200);

      //print(player.spr.animation.getFrame());
      var frame = player.spr.animation.getFrame();

      switch (frame) {
        case 0:
          this.sword_target.damage(0);
        break;
        case 1:
          this.sword_target.damage(1);
        break;
        case 2:
          this.sword_target.damage(2);
        break;
        case 3:
          this.sword_target.damage(3);
        break;
        case 4:
          this.sword_target.damage(4);
        break;
      }

      setTimeout("camera.battle_position = camera.position.home;camera.battle_zoom = 1;player.flipped = true;player.spr.changeAnimation('run_flipped');", 1000);
      setTimeout("player.battle_position = player.battle_home;", 1000);
      setTimeout("player.sword_counter = 0;", 1000);
      //setTimeout("player.spr.changeAnimation('idle');", 1000);

      setTimeout("player.flipped = false; player.spr.changeAnimation('idle');", 1500);
      setTimeout(runMoves, 1500);

    }

  }

  bow(){

    setTimeout("camera.battle_zoom = 1.1;", 100);

    setTimeout("player.spr.changeAnimation('attack_bow');", 100);

    setTimeout("for (var i = 0; i < enemy_array.length; i++) {enemy_array[i].damage(2);}",800);
    setTimeout("player.spr.changeAnimation('attack_bow_finished');", 800);

    setTimeout("player.spr.changeAnimation('idle');", 1500);
    setTimeout("camera.battle_zoom = 1;", 1500);
    setTimeout(runMoves, 2000);

  }

  heal(){

    setTimeout("camera.battle_position = createVector(player.spr.position.x, player.spr.position.y - 50);camera.battle_zoom = 1.5;", 100);
    //setTimeout("camera.battle_zoom = 1.5;", 100);
    setTimeout("player.modify_health(3, 'add');", 900);
    setTimeout("camera.battle_position = camera.position.home;camera.battle_zoom = 1;", 1800);
    //setTimeout("camera.battle_zoom = 1;", 1800);
    setTimeout(runMoves, 3000);

  }

  run(){

    this.run_visible = true;
    setTimeout("camera.battle_position = createVector(player.battle_home.x, player.battle_home.y - 50);camera.battle_zoom = 1.5;player.flipped = true;player.spr.changeAnimation('run_flipped');", 100);

    player.meter_drop = setInterval("player.run_meter--",50);
    setTimeout("camera.battle_position = camera.position.home;camera.battle_zoom = 1;player.run_visible = false;player.flipped = false; player.spr.changeAnimation('idle');clearInterval(player.meter_drop);", 2000);

    setTimeout(runMoves, 2500);


  }

}

////////////////////////////////////////////////////////////////////////////////

class Encounter{

  //Set up the enemy
  constructor(encounter_number, x, y){

    //Create sprite and collisions
    this.spr = createSprite(x, y, 50, 100);

    //Due to a bug in p5.play, I cannot set a circle collider for the encounters
    //so they don't get stuck on corners. p5.play will visually move the circle
    //collider when offset in debug, but will not actually offset the calculations.
    this.spr.setCollider("rectangle", 0, 25, 50, 50);
    //this.spr.debug = true;

    encount_spr.add(this.spr);

    this.encounter_number = encounter_number;

    this.enemy_group = encounters[encounter_number];

    this.spr.world_position = createVector(this.spr.position.x, this.spr.position.y);

    this.wanderID = setInterval(this.flip.bind(this), random(1500, 2500));
    this.wandering = false;

    this.direction = random(360);

  }

  flip(){
    this.wandering = !this.wandering;
  }

  display(){

    if(battle_mode == false){
      drawSprite(this.spr);
      //Debug radius and text
      fill(0,0);
      stroke(0);
      //ellipse(this.spr.position.x, this.spr.position.y, 600,600);
      //text(encounters[this.encounter_number].name, this.spr.position.x, this.spr.position.y);
    }

    //If player can be attacked, collide and start battle
    if(player.can_be_attacked == true && this.spr.collide(player.spr) == true && world_paused == false){
      this.enemy_spawn();
      player_turn = true;
    }

  }

  move(){

    this.spr.limitSpeed(6);
    this.spr.friction = 0.2;

    if(dist(this.spr.position.x, this.spr.position.y, player.spr.position.x, player.spr.position.y) <= 400 && world_paused == false && player.can_be_attacked == true){

      this.wandering = false;
      this.spr.attractionPoint(3, player.spr.position.x, player.spr.position.y);

    } else {

      if(this.wandering == true && world_paused == false && player.can_be_attacked == true){

        this.spr.setSpeed(2,this.direction);

      } else if(this.wandering == false && world_paused == false && player.can_be_attacked == true){

        this.direction = random(360);

      }

    }

    if(this.spr.position.x < 0)
      this.spr.position.x = 0;
    if(this.spr.position.y < -50)
      this.spr.position.y = -50;
    if(this.spr.position.x > SCENE_W)
      this.spr.position.x = SCENE_W;
    if(this.spr.position.y > SCENE_H)
      this.spr.position.y = SCENE_H;

  }

  enemy_spawn(){

    if (battle_end != true) {

      //Start battle
      world_paused = true;
      battle_setup = true;
      battle_start = true;

      current_encounter = enemy_encounters.indexOf(this);

      txt_color = 255;
    }

    for(var i=0; i<this.enemy_group.group.length; i++){

      //Create new enemy and pass it the position and name of the enemy to make
      enemy_array.push(new Enemy(getbyName(this.enemy_group.group[i].name), (SCENE_W/2) + 300 + (100*i), (SCENE_H/2)));

    }

  }

}

////////////////////////////////////////////////////////////////////////////////

//Used to get enemies in encounter group
function getbyName(key) {
  return enemies.filter(
      function(enemies){return enemies.name == key}
  );
}

////////////////////////////////////////////////////////////////////////////////

class Enemy{

  //Set up the enemy
  constructor(enemy_name, x, y){

    this.stats = enemy_name[enemy_name.length-1];

    //Create sprite and collisions
    this.spr = createSprite(SCENE_W + width, (SCENE_H/2), 50, 100);
    this.spr.addAnimation("idle", enemy_idle);
    this.spr.addAnimation("attack_sword", enemy_strike);

    this.spr.scale = 0.3;

    this.spr.setCollider("rectangle", 0, 25, 50, 50);
    //this.spr.debug = true;

    this.current_health = this.stats.health;

    this.defence = this.stats.start_armor;

    this.spr.home_position = createVector(x, y);
    this.spr.battle_position = this.spr.home_position;

    //this.spr.debug = true;

    this.spr.mouseActive = true;
    //Due to a bug in p5.play, I cannot check if the mouse is over the enemy
    //if the camera has been moved. Because of this, I cannot show the Stats
    //of an enemy when you hover over them.

    //Create an array of probablilities of moves
    this.cumulative_weights = new Array();
    for (var i = 0; i < this.stats.moves.length; i++) {
      if (i == 0){
        this.cumulative_weights.push(this.stats.moves[i].weight);
      } else {
        this.cumulative_weights.push(this.stats.moves[i].weight + this.cumulative_weights[i-1]);
      }
    }


  }

  display(){

    //blocking
    if(this.defence != 0){

      textSize(24);
      fill(0);
      text("Blocking!", this.spr.position.x - 50, this.spr.position.y - 75);

    }

    //Move to battle positions
    this.spr.position.lerp(this.spr.battle_position, 0.1);

    //Remove this enemy if it dies
    if (this.current_health <= 0){
      this.spr.remove();
      var i = enemy_array.indexOf(this);
      enemy_array.splice(i, 1);
    }

    //Show name and health, possibly debug
    fill(0);
    textSize(12);
    text(this.stats.name, this.spr.position.x - 40, this.spr.position.y + 65);
    text(this.current_health + "/" + this.stats.health, this.spr.position.x - 40, this.spr.position.y + 95);

    //Health bar and stuff
    this.current_health = constrain(this.current_health, 0, this.stats.health);

    fill(200, 200, 200);
    stroke(0);
    rect(this.spr.position.x - 40,this.spr.position.y + 70, 80, 10);
    noStroke();
    fill(255, 0, 0);
    rect(this.spr.position.x - 38,this.spr.position.y + 72, 77*(this.current_health/this.stats.health),7);

    drawSprite(this.spr);

  }

  slideIn(){

    this.spr.position.lerp(this.spr.home_position, 0.1);

  }

  slideOut(){

    this.spr.position.lerp(createVector(SCENE_W + width, SCENE_H/2), 0.1);

  }

  //Chooses a random moves, taking into account the move's weighting
  getMove(){
    this.r = random() * this.cumulative_weights[this.cumulative_weights.length-1];

      for(var i = 0; i < this.stats.moves.length; i++)
      {
        if (this.cumulative_weights[i] > this.r)
        return(this.stats.moves[i]);
      }
  }

  attack(){

    this.defence = 0;

    //Get the move we are about to use
    this.move = this.getMove();

    //If it is an attack, do the attack
    if(this.move.type == "attack"){

      //player.modify_health(this.move.power, this.move.method);
      this.sword(this.move);

    }

    if(this.move.type == "defend"){

      this.defence = this.move.power;

      //If there is another enemy in the battle after this, run its attack function
      if(enemy_array[attacking_enemy + 1] != null){

        attacking_enemy++;
        setTimeout("enemy_array[attacking_enemy].attack();", 500);


      } else {

        setTimeout("player_turn = true;", 500);

      }

    }

  }


  sword(move){

      this.power = move.power;
      this.method = move.method;

      //print(createVector(enemy_array[target_index].spr.position.x - 100, enemy_array[target_index].spr.position.y));
      setTimeout("enemy_array[attacking_enemy].spr.battle_position = createVector(player.spr.position.x + 75, player.spr.position.y);",100);
      setTimeout("camera.battle_position = createVector(player.spr.position.x, player.spr.position.y - 50);camera.battle_zoom = 1.2;", 100);

      //player.modify_health(this.move.power, this.move.method);

      setTimeout("enemy_array[attacking_enemy].spr.changeAnimation('attack_sword');", 1000);
      setTimeout("enemy_array[attacking_enemy].spr.changeFrame(0);", 1000);
      setTimeout("enemy_array[attacking_enemy].spr.animation.play();", 1000);

      setTimeout("player.modify_health(enemy_array[attacking_enemy].power, enemy_array[attacking_enemy].method);", 2200);
      setTimeout("enemy_array[attacking_enemy].spr.animation.stop();", 2200);

      setTimeout("camera.battle_position = camera.position.home;camera.battle_zoom = 1;", 2500);
      setTimeout("enemy_array[attacking_enemy].spr.battle_position = enemy_array[attacking_enemy].spr.home_position;enemy_array[attacking_enemy].spr.changeAnimation('idle');",2500);

      //If there is another enemy in the battle after this, run its attack function
      if(enemy_array[attacking_enemy + 1] != null){

        setTimeout("attacking_enemy++;", 2999);
        setTimeout("enemy_array[attacking_enemy].attack();", 3000);


      } else {

        setTimeout("player_turn = true;", 3000);

      }

  }

  damage(value){

    this.calculated = value - this.defence;

    this.calculated = constrain(this.calculated, 0, 100);

    this.current_health -= this.calculated;
    indicators.push(new Indicator(this.calculated, this.spr.position.x, this.spr.position.y - 75, true));

  }

  modify_health(value, _mode){

    switch (_mode) {

      //Adds VALUE to CURRENT health, negatives REMOVE health
      case 'add':
        this.current_health += value;
        indicators.push(new Indicator(value, this.spr.position.x, this.spr.position.y - 75));
        break;
      //Divides CURRENT health by VALUE
      case 'divide':
        if (value != 0 && this.current_health != 0){
          indicators.push(new Indicator(ceil(this.current_health/value) - this.current_health, this.spr.position.x, this.spr.position.y - 75));
          this.current_health = ceil(this.current_health/value);
        }
        break;
      //Adds a percent of MAX health
      case 'add_percent':
        if (value != 0){
          this.current_health += ceil(map(value, 0, 100, 0, this.stats.health));
          indicators.push(new Indicator(ceil(map(value, 0, 100, 0, this.stats.health)), this.spr.position.x, this.spr.position.y - 75));
        }
        break;
      //Removes percent of CURRENT health
      case 'remove_percent':
        if (value != 0){
          var health_removed = -(ceil(map(value, 0, 100, 0, this.current_health)));
          this.current_health -= ceil(map(value, 0, 100, 0, this.current_health));
          indicators.push(new Indicator(health_removed, this.spr.position.x, this.spr.position.y - 75));
        }
        break;
      //If no mode is specified, just simulate ADD
      default:
        this.current_health += value;
        indicators.push(new Indicator(value, this.spr.position.x, this.spr.position.y - 75));
        break;

    }

  }

}

////////////////////////////////////////////////////////////////////////////////

class Indicator{

  constructor(value, x, y, invert){

    //Create sprite and collisions
    this.spr = createSprite(x, y, 25, 25);
    this.spr.shapeColor = 0;
    this.spr.setVelocity(0,-1);

    //this.xpos = x;
    //this.ypos = y;
    this.value = value;
    this.life = 25;
    this.invert = invert;

  }

  display(){

    if(this.invert == true){
      if(this.value >= 1){
        fill(200, 0, 0);
      } else if (this.value <= -1){
        fill(0, 200, 0);
      }
    } else {

      if(this.value >= 1){
        fill(0, 200, 0);
      } else if (this.value <= -1){
        fill(200, 0, 0);
      }

    }

    textSize(30);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(2);
    text(this.value, this.spr.position.x, this.spr.position.y);
    this.life--;

    if(this.life <= 0){
      indicators.pop();
      this.spr.remove();
    }

  }

}

////////////////////////////////////////////////////////////////////////////////

class battle_button{

  constructor(x,y,name){

    //Create sprite and collisions
    this.spr = createSprite(width/5, height+this.height);

    this.name = name;

    //Assign sprites to buttons
    switch (name) {
      case 'Sword':
        this.spr.addAnimation("sword", sword_img);
        break;
      case 'Bow':
        this.spr.addAnimation("bow", bow_img);
        break;
      case 'Recover':
        this.spr.addAnimation("recover", recover_img);
        break;
      case 'Run!':
        this.spr.addAnimation("run", run_img);
        break;
      default:
        this.spr.addAnimation("test", button_img);
        break;
      }

    //Set up the functions on each button
    this.spr.mouseActive = true;
    this.spr.onMousePressed = function() {

      var target_index = constrain(player_moves.length, 0, enemy_array.length-1);

      if (player_turn == true && player.can_attack == true && enemy_array.length > 0){
        //Use this switch to call battle functions
        switch (name) {
          case 'Sword':
            print("Sword");
            player_moves_readable.push("Sword");
            player_moves.push(wrapFunction(player.sword, player, [enemy_array[target_index]]));
            break;
          case 'Bow':
            print("Bow");
            player_moves_readable.push("Bow");
            player_moves.push(wrapFunction(player.bow, player));
            //player_moves.push(wrapFunction(enemy_array[target_index].modify_health, enemy_array[target_index], [50, "remove_percent"]));
            break;
          case 'Special':
            print("Special");
            // player_moves_readable.push("Special");
            // player_moves.push(wrapFunction(player.modify_health, player, [50, "remove_percent"]));
            break;
          case 'Recover':
            print("Recover");
            player_moves_readable.push("Recover");
            player_moves.push(wrapFunction(player.heal, player));
            break;
          case 'Run!':
            print("Run");

            player_moves.push(wrapFunction(player.run, player));

            // if(battle_mode == true){
            //   txt_color = 255;
            //   battle_end = true;
            //   battle_mode = false;
            // }
            break;
          default:
            print("Something's wrong! The button " + name + " doesn't have any case assigned to it!");
            break;
        }
      }
    }
  }

  display(){

    if(battle_mode == true){

      //Player's turn
      if(player_turn == true && player.can_attack == true){
        //Show the battle buttons
          var scl_lerp = lerp(this.spr.position.y, battle_button_height, 0.1);
          this.spr.position.y = scl_lerp;

        //Make buttons react to hovering
          if(this.spr.mouseIsOver){
              this.spr.scale = 1.2 * (3/battle_buttons.length);
              this.spr.rotation -= (Math.sin(millis()/100))/5;
            } else {
              var rot_lerp = lerp(this.spr.rotation, 0, 0.5);
              this.spr.rotation = rot_lerp;
              var scl_lerp = lerp(this.spr.scale, (3/battle_buttons.length), 0.1);
              this.spr.scale = scl_lerp;
            }
      }
      //Lower the battle buttons when the queue is full
      else if(player_turn == true && player.can_attack == false) {
          var pos_lerp = lerp(this.spr.position.y, height + this.spr.height/4, 0.1);
          this.spr.position.y = pos_lerp;
          var rot_lerp = lerp(this.spr.rotation, 0, 0.5);
          this.spr.rotation = rot_lerp;
          var scl_lerp = lerp(this.spr.scale, (3/battle_buttons.length), 0.1);
          this.spr.scale = scl_lerp;
      }

    } else {
      //Move battle buttons off screen
        scl_lerp = lerp(this.spr.position.y, canvas.height + this.spr.height, 0.1);
        this.spr.position.y = scl_lerp;
    }

    drawSprite(this.spr);

  }

}

////////////////////////////////////////////////////////////////////////////////

//Displays health bar, might move this to player someday
function playerHealth(){

  player.current_health = constrain(player.current_health, 0, player.max_health);

  fill(200, 200, 200);
  rect(20,20,200,20);
  noStroke();
  fill(255, 0, 0);
  rect(22,22,196*(player.current_health/player.max_health),16);

  if(player.current_health == 0){

    // TODO: Game over screen
    player.spr.remove();
    world_paused = true;
    battle_end = true;
    battle_mode = false;
    textSize(64);
    textAlign(CENTER);
    text("Game Over!", width/2, height/2);

  }

}

////////////////////////////////////////////////////////////////////////////////

//Confirm and delete queue in battle, debug code for switching battle_mode and player_turn
function keyPressed(){

  //Bind the number keys to the battle buttons that exist
  if(keyCode >= 49 && keyCode <= 57){

    if(battle_buttons[keyCode - 49] != null){

      battle_buttons[keyCode - 49].spr.onMousePressed();

    }

  }

  //Press E to run queued moves
  if (keyCode === 69 && player.can_attack == false && player.in_progress == false && player_turn == true){

    //print(player_moves);

    player.in_progress = true;

    runMoves();

  }

  if(keyCode === 69 && player.run_visible == true){

    player.run_meter += 10;

  }

  //Sword Timing Code
  if(keyCode === 69 && player.sword_counter == 1 && player.in_progress == true){

    clearTimeout(player.swordID1);
    clearTimeout(player.swordID2);
    clearTimeout(player.swordID3);
    clearTimeout(player.swordID4);
    clearTimeout(player.swordID5);
    clearTimeout(player.swordID6);
    clearTimeout(player.swordID7);
    clearTimeout(player.swordID8);

    player.sword();

  }

  //Blocking code
  if(keyCode === 69 && player_turn == false && battle_mode == true && player.can_block == true){

    setTimeout("player.spr.animation.changeFrame(0);player.spr.animation.stop();", 0);
    player.blocking = true;
    player.can_block = false;
    setTimeout("player.blocking = false;", 500);
    setTimeout("player.can_block = true;", 1000);
    setTimeout("player.spr.animation.play();camera.battle_zoom = 1;", 1000);

  }

  //Press Q to remove most recent queued move
  if (keyCode === 81){

    if (player_moves.length != 0){

      player_moves.pop();
      player_moves_readable.pop();

      //print(player_moves);

    }

  }

}

////////////////////////////////////////////////////////////////////////////////

//Used to wrap functions to be called later with .call(), used in move queue
wrapFunction = function(func, context, parameters) {
  return function() {
      func.apply(context, parameters);
  };
}

////////////////////////////////////////////////////////////////////////////////

//Runs though the moves in the queue, calling the attacks
function runMoves(){
  if (player_moves.length > 0 && enemy_array.length > 0 && player_turn == true){

    //player_turn = false;
    (player_moves.shift())();
    player_moves_readable.shift();

    //print(player_moves);
    attacking_enemy = 0;

  } else if (enemy_array.length > 0) {

    player_turn = false;
    enemy_array[attacking_enemy].attack();
    //print(enemy_array[attacking_enemy].stats.name);
    player.can_attack = true;
    player.in_progress = false;

  }
}
