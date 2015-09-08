// Enemies our player must avoid
var Enemy = function(lane) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  // Initate monster's initial location
  this.x = 0;
  this.y = (lane + 1) * Resources.ROW_SIZE;

  // Randomize monster's starting speed
  this.reset = false;
  this.SPD_MULTIPLIER = 100;
  this.baseSpd = Math.random();
  this.spd = this.baseSpd * this.SPD_MULTIPLIER;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = (this.x + this.spd * dt) % (6 * Resources.COL_SIZE);

  // Reset enemy's speed when it respawns and speed up the multiplier
  if (this.x > (5 * Resources.COL_SIZE) && !this.reset) {
    this.reset = true;
    this.SPD_MULTIPLIER += Math.floor(Math.random() * 20);
    this.spd = this.baseSpd * this.SPD_MULTIPLIER;
  }

  if (this.reset && this.x < (5 * Resources.COL_SIZE)) {
    this.reset = false;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// All Characters available for player to select
var availChars = [
  'images/char-boy.png',
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png'
];

// Player class to instantiate controllable characters
var Player = function(selected) {
  // Randomize a character if not specified
  if (!selected) {
    selected = Math.floor(Math.random() * 5);
  }
  this.sprite = availChars[selected];

  this.setStartingPosition();
};

// Move the character across the board by user's input
Player.prototype.handleInput = function(key) {
  switch(key) {
    case 'left':
      this.update(this.x - Resources.COL_SIZE, this.y);
      break;
    case 'right':
      this.update(this.x + Resources.COL_SIZE, this.y);
      break;
    case 'up':
      this.update(this.x, this.y - Resources.ROW_SIZE);
      break;
    case 'down':
      this.update(this.x, this.y + Resources.ROW_SIZE);
      break;
    default:
      break;
  }
};

// Render playable character on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Set player's starting position
Player.prototype.setStartingPosition = function() {
  this.x = 2 * Resources.COL_SIZE;
  this.y = 5 * Resources.ROW_SIZE;
};

// Set position of the player based on xy coordinate
Player.prototype.update = function(x, y) {
  // Check input
  if (typeof x === 'undefined' || typeof y === 'undefined') {
    return;
  }

  // Check if the player moves out of boundary
  if (x < 0 || y < 0 || x > (4 * Resources.COL_SIZE) || y > (5 * Resources.ROW_SIZE)) {
    return;
  }

  this.x = x;
  this.y = y;
};

// Board class controlls game mechanics such as timer, score, checking for collisions, etc.
var Board = function(player, enemies) {
  this.player = player;
  this.enemies = enemies;

  // Set initial timer to 30 seconds
  this.timer = 30;

  this.score = 0;
  this.gem = null;
  this.finished = false;
};

// Clear generated gem
Board.prototype.clearGem = function() {
  this.gem = null;
};

// Generate a new gem
Board.prototype.generateGem = function() {
  var GEMS = [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png'
  ];
  var selected = Math.floor(Math.random() * 3);
  var x = Math.floor(Math.random() * 5);
  var y = Math.floor(Math.random() * 3) + 1;
  this.gem = {
    img: GEMS[selected],
    x: x * Resources.COL_SIZE,
    y: y * Resources.ROW_SIZE
  };
};

// Check if the player has collected any gem
Board.prototype.hasCollectedGem = function() {
  if (this.isFinished()) {
    return false;
  }

  if (this.player.y === this.gem.y && this.player.x === this.gem.x) {
    return true;
  }
  return false;
};

// Check if the player has collided with any enemy
// Right now, collision detection allows the enemies to overlap with the player by
// a small margin of error. In the future, the accuracy can be improved by getting
// the exact edge of the player. For example, when the player is first drawn on
// screen, the algorithm can scan the drawn image for the leftmost/rightmost
// non-transparent pixel using a nested for-loop
Board.prototype.hasCollided = function() {
  if (this.isFinished()) {
    return false;
  }

  var collided = false;
  this.enemies.forEach(function(enemy) {
    if (this.player.y == enemy.y) {
      var x_left = this.player.x + 20;
      var x_right = this.player.x + Resources.COL_SIZE - 20;
      if ((x_left < enemy.x + Resources.COL_SIZE && x_left > enemy.x) ||
          (x_right < enemy.x + Resources.COL_SIZE && x_right > enemy.x)) {
        collided = true;
      }
    }
  });
  return collided;
};

// Check if the player has advanced to water
Board.prototype.hasCrossed = function() {
  return this.player.y === 0;
};

// Check if the game has timed up
Board.prototype.hasTimedUp = function() {
  return this.timer <= -1;
};

// Return the variable `finished`
Board.prototype.isFinished = function() {
  return this.finished;
};

// Render board entities including gems, timer and score
Board.prototype.render = function() {
  this.renderGem();
  this.renderTimer();
  this.renderScore();
};

// Render gem on board
Board.prototype.renderGem = function() {
  if (this.gem !== null) {
    ctx.drawImage(Resources.get(this.gem.img), this.gem.x, this.gem.y);
  }
};

// Render current score
Board.prototype.renderScore = function(score) {
  if (typeof score === 'undefined') {
    score = this.score;
  }
  ctx.clearRect(430, 0, 100, 45);
  ctx.fillText(score, 430, 40);
};

// Render curent time
Board.prototype.renderTimer = function() {
  var time = Math.ceil(this.timer);
  ctx.clearRect(160, 0, 100, 45);
  ctx.fillText(time, 160, 40);
};

// Update board status at every tick of the system
Board.prototype.update = function(dt) {
  this.timer -= dt;

  // Check if player collide with any enemy
  if (this.hasCollided()) {
    this.score--;
    this.player.setStartingPosition();
    return;
  }

  // Check if the player has collected a gem
  if (this.gem !== null && this.hasCollectedGem()) {
    this.score++;
    this.clearGem();
  }

  // Genearte new gem every 5 seconds
  if (this.gem === null && Math.ceil(this.timer) % 5 === 0) {
    this.clearGem();
    this.generateGem();
  }

  // Check if the player has crossed to water
  if (this.hasCrossed()) {
    this.finished = true;
  }

  // Check if the game has finished and whether the player has advanced to water
  if (this.hasTimedUp()) {
    this.finished = true;
    if (!this.hasCrossed()) {
      this.renderScore(0);
    }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Instantiate 3 monsters, one in each lane
var allEnemies = [];
for (var i = 0; i < 3; i++) {
  allEnemies.push(new Enemy(i));
}

// Instantiate controllable player
var player = new Player();

// Instantiate board object that dictates game mechanics
var board = new Board(player, allEnemies);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
