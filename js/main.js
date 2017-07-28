
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

var sprite;
var background;
var house;

var entertext;
var passphrase;

var pass_key = "";

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.parentIsWindow = true;

    game.load.spritesheet('happy', 'res/happy_dog.png', 50, 60, 3, 3, 0);
    game.load.spritesheet('sad', 'res/sad_dog.png', 54, 55, 3, 3, 0);

    game.load.spritesheet('food0', 'res/food0.png', 150,150);
    game.load.spritesheet('food1', 'res/food1.png', 150,150);
    game.load.spritesheet('food2', 'res/food2.png', 150,150);
    game.load.spritesheet('food3', 'res/food3.png', 150,150);
    game.load.spritesheet('food4', 'res/food4.png', 150,150);
    game.load.spritesheet('food5', 'res/food5.png', 150,150);
    game.load.spritesheet('food6', 'res/food6.png', 150,150);
    game.load.spritesheet('food7', 'res/food7.png', 150,150);
    game.load.spritesheet('food8', 'res/food8.png', 150,150);
    game.load.spritesheet('food9', 'res/food9.png', 150,150);
    game.load.image('background','res/bg.png');
    game.load.image('house','res/house.png');
    game.load.image('house1','res/house_eye1.png');
    game.load.image('house2','res/house_eye2.png');
    game.load.image('house3','res/house_eye3.png');

}

function create() {

    //  Setting the background colour
    game.stage.backgroundColor = '#182d3b';

    passphrase_prompt();

    // The numbers given in parameters are the indexes of the frames, in this order: over, out, down
    food0 = game.add.button(25, game.world.centerY * 3, 'food0', actionOnClick, this, 2, 2, 1);
    food1 = game.add.button(175, game.world.centerY * 3, 'food1', actionOnClick, this, 2, 2, 1);
    food2 = game.add.button(325, game.world.centerY * 3, 'food2', actionOnClick, this, 2, 2, 1);
    food3 = game.add.button(475, game.world.centerY * 3, 'food3', actionOnClick, this, 2, 2, 1);
    food4 = game.add.button(625, game.world.centerY * 3, 'food4', actionOnClick, this, 2, 2, 1);
    food5 = game.add.button(25, game.world.centerY * 3.75, 'food5', actionOnClick, this, 2, 2, 1);
    food6 = game.add.button(175, game.world.centerY * 3.75, 'food6', actionOnClick, this, 2, 2, 1);
    food7 = game.add.button(325, game.world.centerY * 3.75, 'food7', actionOnClick, this, 2, 2, 1);
    food8 = game.add.button(475, game.world.centerY * 3.75, 'food8', actionOnClick, this, 2, 2, 1);
    food9 = game.add.button(625, game.world.centerY * 3.75, 'food9', actionOnClick, this, 2, 2, 1);

    house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house');

    //Feed Your Passpet

}

function actionOnClick (pointer) {
    
    //  Manually changing the frames of the food, i.e, how it will look when you play with it
    pointer.setFrames(2, 2, 1);
    raw_pass_key_digit = pointer.key;
    pass_key_digit = raw_pass_key_digit.replace("food", "");

    pass_key = pass_key + "" + pass_key_digit;
    console.log(pass_key);
 
    if(pass_key.length == 1){
    	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house1');
    	passphrase_prompt()
    	sprite.kill();
    	//show foot
    }
    else if(pass_key.length == 2){
    	house.kill();
    	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house2');
    	//show feet
    }
    else if(pass_key.length == 3){
    	house.kill();
    	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house3');
    	//show feet and eyes
    }
    else if(pass_key.length == 4){
    	//show pet
    	if(is_pass_key_valid(pass_key)){ 
    	    show_pet();
    	}
    	else{
    		pass_key = "";
    		hide_pet();
    	}
    }
}

function is_pass_key_valid(pass_key){
	//call pass key validation
	return true;
}

function hide_pet(){
	//remove sprites
    sprite.kill();
    reset();
}

function show_pet(){
	
	//check if it should be sad or happy on logout
	reset();
    entertext.kill();
    passphrase.kill();
	sprite = game.add.sprite(300, window.screen.availHeight / 1.5, 'happy');
    sprite.animations.add('walk', [0, 0, 0, 1, 1, 1, 2, 2, 2]);
    sprite.animations.play('walk', 10, true);
    sprite.scale.set(4);
    sprite.smoothed = false;
}

function reset(){
	pass_key = "";	
	house.kill();
	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house');
}

function passphrase_prompt(){
	entertext = game.add.text(225, window.screen.availHeight / 4, 'Feed Your PassPet\n', {font:"40px Arial", fill: "#ffffff", align: "left"});
	passphrase = game.add.text(300, window.screen.availHeight / 4 + 50, '* * * *\n', {font:"80px Arial", fill: "#ffffff", align: "left"});
}