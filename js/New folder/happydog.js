
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.spritesheet('mummy', 'res/happy_dog.png', 50, 60, 3, 3, 0);
    game.load.spritesheet('sad', 'res/sad_dog.png', 54, 55, 3, 3, 0);

}

var sprite;

function create() {

    sprite = game.add.sprite(300, 200, 'mummy');

    sprite.animations.add('walk', [0, 0, 0, 1, 1, 1, 2, 2, 2]);
    sprite.animations.play('walk', 10, true);
    sprite.scale.set(4);
    sprite.smoothed = false;

    game.input.onDown.add(changeTexture, this);

}

function changeTexture() {

    sprite.loadTexture('mummy', 0, false);
    // sprite.smoothed = false;

}
