var allEnemies = [];
var enemynum  = 1;
var paused = true;
var constants = {
        // Default canvas text font family
        FONT : '20pt ArcadeClassic',
        // Default canvas text font color
        FONT_COLOR: 'white',
        // Game element height
        ENTITY_HEIGHT : 50,
        // Game element width
        ENTITY_WIDTH : 50,
        // Enemy minimum speed
        MIN_SPEED : 50,
        // Enemy max speed
        MAX_SPEED : 300,
        // Player's start x-position on the canvas
        PLAYER_START_X : 300,
        // Player's start y-position on the canvas
        PLAYER_START_Y : 390,
        // Player movement distance
        PLAYER_MOVEMENT : 50,
        // X position array for game elements 
        POSITION_X : [0, 100, 200, 300, 400, 500],
        // Y position array for game elements
        POSITION_Y : [80 ,160, 230],
        // Left canvas boundary
        LEFT_BOUNDARY : 20,
        // Top canvas boundary
        TOP_BOUNDARY : 20,
        // Right canvas boundary
        RIGHT_BOUNDARY : 400,
        // Bottom canvas boundary
        BOTTOM_BOUNDARY : 390
};

$(document).ready(function() {
        gameMusic.play()
        // Play background music
        //gameMusic.play();
        // Adjust background music volume
        gameMusic.volume(0.3);

        // Hide the start screen on button click
        $("#playGame").click(function() { 
                // Hide the start screen
                $("#startScreen").fadeOut('fast'); 
                // Play the select sound effect
                // Fade in the game music
                /* Unpause the game to allow the player to move around
                 * when arrow keys are pressed
                 */
                 gameSelect.play();
                 gameMusic.fade(0.3, 0.7, 1500);
                paused = false;
        });
        $("#playAgain").click(function(){
            gameSelect.play();
            gameMusic.fade(0.3, 0.7, 1000);
             paused = false;
            $("#gameOver").fadeOut('fast');
        });
        $(".toggle-music").click(function() {
            if($(this).hasClass('on')) {
                gameMusic.pause();
                $(this).hide();
                $(".toggle-music.off").show();
            } 
            if($(this).hasClass('off')) {
                gameMusic.play();
                $(this).hide();
                $(".toggle-music.on").show();
            }
        });


});


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.random()*constants.MAX_SPEED+constants.MIN_SPEED;
    this.x = Math.random()*(-200)+50;
    this.y = constants.POSITION_Y[Math.floor(Math.random()*3)];
    this.height = constants.ENTITY_HEIGHT;
    this.width = constants.ENTITY_WIDTH;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed*dt;
    if (this.x > constants.RIGHT_BOUNDARY+200 ) {
        this.x = Math.random()*(-300)-150;
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
var Enemies = function(){
  this.num = 1;
}
Enemies.prototype.spawn = function(){
    for (var i = 0; i < this.num; i++) {
         allEnemies[i] = new Enemy();
    };
}
Enemies.prototype.reset = function(){
    this.num = 1;
    allEnemies = [];
    this.spawn();
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = constants.PLAYER_START_X;
  this.y = constants.PLAYER_START_Y;
  this.height = constants.ENTITY_HEIGHT;
  this.width = constants.ENTITY_WIDTH;
  this.live = 2;
  this.level = 1;

}
Player.prototype.reset = function(){
  this.x = constants.PLAYER_START_X;
  this.y = constants.PLAYER_START_Y;
  this.live = 2;
  this.level = 1;
}
Player.prototype.update = function(){
    this.xNow = this.x;
    this.yNow = this.y;
}
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.hit = function(){
        playerHit.play();
        $("#collision").show().fadeOut();
        this.live = this.live - 1;
        stats.updateLives(this.live);
        this.x = constants.PLAYER_START_X;
        this.y = constants.PLAYER_START_Y;
}
Player.prototype.handleInput = function(key){
if(key === 'left' && this.x > constants.LEFT_BOUNDARY) {
                this.x = this.xNow + -constants.PLAYER_MOVEMENT;
        }
        /* If the up arrow key is pressed and the 
         * player is within the top boundary of the
         * canvas, allow the player to move upwards.
         */
        if(key === 'up' && this.y > constants.TOP_BOUNDARY) {
                this.y = this.yNow + -constants.PLAYER_MOVEMENT;
        }
        /* If the right arrow key is pressed and the 
         * player is within the right boundary of the
         * canvas, allow the player to move right.
         */
        if(key === 'right' && this.x < constants.RIGHT_BOUNDARY) {
                this.x = this.xNow + constants.PLAYER_MOVEMENT;
        }
        /* If the down arrow key is pressed and the 
         * player is within the bottom boundary of the
         * canvas, allow the player to move down.
         */
        if(key === 'down' && this.y < constants.BOTTOM_BOUNDARY) {
                this.y = this.yNow + constants.PLAYER_MOVEMENT;
        }   
}
var Level = function(){
  enemies.spawn();
}
Level.prototype.updateLevel = function(){
    player.level++;
    stats.updateLevel(player.level);
    enemies.num++;
    enemies.spawn();
    player.x = constants.PLAYER_START_X;
    player.y = constants.PLAYER_START_Y;

}

var Stats = function() {
        this.font = constants.FONT;
        this.fontColor = constants.FONT_COLOR;
        this.currentLevel = player.level;
        this.currentLives = player.live;
        this.currentScore = 0;
        this.currentGems = 0;
};
Stats.prototype.render = function(){
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,50, 707, 45);
    this.level();
    this.lives();
    this.score();
}
Stats.prototype.score = function() {
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        ctx.textAlign = 'end';
        ctx.fillText(this.currentScore, 300, 82);
};
Stats.prototype.level = function() {
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        ctx.textAlign = 'start';
        ctx.fillText('Level '+ this.currentLevel, 10, 82);
};
Stats.prototype.updateLevel = function(level) {
        this.currentLevel = level;
        this.updateScore();
        levelUp.play();
};
Stats.prototype.updateScore = function() {
        this.currentScore = this.currentScore + 600;
};
Stats.prototype.lives = function() {
        ctx.drawImage(Resources.get('images/stat-heart.png'), 430, 62);
        ctx.font = this.font;
        ctx.fontStyle = this.fontColor;
        ctx.textAlign = 'start';
        ctx.fillText('x '+ this.currentLives, 465, 82);
};
Stats.prototype.updateLives = function(lives) {
        this.currentLives = lives;
};
Stats.prototype.gameover = function(){
    gameOver.play();
     paused = true;
    $("#gameOver").show();
}
Stats.prototype.reset = function(){
  $("#gameOver #score").html(this.currentScore);
  stats.updateLives(player.live);
  stats.updateLevel(player.level);
  this.currentScore = 0;
}
var player = new Player();
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemies = new Enemies();
var stats = new Stats();
var level = new Level();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(!paused) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
