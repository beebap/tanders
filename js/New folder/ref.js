var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas',
	{preload: preload,
		create: create,
		update: update}); 

var paddle;
var paddle2;
var ball;
var bricks;

var score = 0;
var hiScore = localStorage.getItem("ark_hiscore");
var lives = 3;

var scoreText;
var hiScoreText;
var livesText;

var paddle_sound;
var brick_sound;

var bHasLaunched = false;

function preload(){
	console.log("Preloading");
	game.load.image('bg','res/bg3.jpg');
	game.load.image('paddle','res/paddle2.png');
	game.load.image('ball','res/balls/ball3.png');
	game.load.image('brick','res/bricks/brick.png');
	game.load.image('brick2','res/bricks/brick2.png');

	game.load.audio('paddle_sound', 'res/sounds/paddlebounce.mp3');
	game.load.audio('brick_sound', 'res/sounds/oink.mp3');

}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.physics.arcade.checkCollision.down = false;

	game.add.sprite(0, 0,'bg');
	paddle_sound = game.add.audio('paddle_sound');
	brick_sound = game.add.audio('brick_sound');
    
	bricks = game.add.group();
	bricks.enableBody = true;
	bricks.physicsBodyType = Phaser.Physics.ARCADE;
	var brickPrefab;
	var rows = 3;
	var cols = 7;

	for(var x = 0; x < rows; x++){
			for(var y = 0; y < cols; y++){
				if((x + y) == 3 || (y - x) == 3){
					brickPrefab = bricks.create(100 + (y * 90), 100 + (x * 80), 'brick2');					
				}
				else{
					brickPrefab = bricks.create(100 + (y * 90), 100 + (x * 80), 'brick');
				}
				brickPrefab.body.bounce.set(1);
				brickPrefab.body.immovable = true;
			}
	}

	paddle = game.add.sprite(game.world.centerX, 500, 'paddle');
	paddle.anchor.set(0.5, 0.5);

	//paddle.scale.x = 1.5;	

	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.collideWorldBounds = true;
	paddle.body.bounce.set(1);
	paddle.body.immovable = true;

	ball = game.add.sprite(game.world.centerX, paddle.y - 20, 'ball');
	ball.anchor.set(0.5, 0.5);
	ball.checkWorldBounds = true;

	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);

	ball.events.onOutOfBounds.add(ballReset, this);

	scoreText = game.add.text(32, 550, 'Score: 0', {font:"20px Arial", fill: "#ffffff", align: "left"});
	hiScoreText = game.add.text(340, 550, 'HighScore: '+ hiScore, {font:"20px Arial", fill: "#ffffff", align: "center"});
	livesText = game.add.text(680, 550, 'Lives: 3', {font:"20px Arial", fill: "#ffffff", align: "left"});

	game.input.onDown.add(launchBall,this);

}

function launchBall(){
	if(!bHasLaunched){
		bHasLaunched = true;
		ball.body.velocity.y = -250;
		ball.body.velocity.x = 75;
	}
}

function ballReset(){

	lives--;

	livesText.text = 'Lives: '+ lives;

	if(lives <= 0){
		bHasLaunched = false;
		ball.reset(paddle.body.x, paddle.y -20);	
		bricks.callAll('revive');
		lives = 3;
		livesText.text = 'Lives: '+ lives;
		score = 0;
		scoreText.text = 'Score: '+ score;
	}
	else{
		bHasLaunched = false;
		ball.reset(paddle.body.x, paddle.y -20);	
	}
}

function ballHitPaddle(p_paddle, p_ball){
	let diff = 0;
	let veolcityConstant = 10;

	paddle_sound.play();

	if(p_ball.x < p_paddle.x){
		diff = p_paddle.x - p_ball.x;
		p_ball.body.velocity.x = (-10 * diff);
	}
	else if(p_ball.x > p_paddle.x){
		diff =  p_ball.x - p_paddle.x;
		p_ball.body.velocity.x = (10 * diff);
	}
	else{
		p_ball.body.velocity.x = 2 + Math.random() * 8;
	}
}

function ballHitBrick(p_ball, p_brick){
	brick_sound.play();
	p_brick.kill();

	score += 10;

	scoreText.text = 'Score: '+ score;
	if(score > (hiScore * 1)){
		localStorage.setItem("ark_hiscore", score.toString());
		hiScore = score;
		hiScoreText.text = 'HighScore: '+ hiScore;
	}

	if(bricks.countLiving() == 0){
		ballReset();
		bricks.callAll('revive');
		lives = 3;
		livesText.text = 'Lives: '+ lives;
		score = 0;
		scoreText.text = 'Score: '+ score;
	}
}

function update(){
	paddle.x = game.input.x;

	if(!bHasLaunched){
		ball.x = paddle.x;
	}
	else{
		game.physics.arcade.collide(paddle, ball, ballHitPaddle, null, this);
		game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
	}
}