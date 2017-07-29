
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

var d = new Date();
var n = d.getTime();

var sprite;
var background;
var house;

var timeString;
var timeText;

var entertext;
var passphrase;

var pass_key = "";

const users = {
    '4696': {
        isLate: false,
        isLoggedIn: false,
    },
    '2402': {
        isLate: false,
        isLoggedIn: false,
    },
    '9550': {
        isLate: false,
        isLoggedIn: false,
    },
};


function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.parentIsWindow = true;

    game.load.spritesheet('4696_happy', 'res/piggy_happy.png', 288, 288, 20);
    game.load.spritesheet('4696_sad', 'res/piggy_sad.png', 288, 288, 20);
    game.load.spritesheet('2402_sad', 'res/mugsy_sad.png', 288, 288, 2);
    game.load.spritesheet('2402_happy', 'res/mugsy_happy.png', 288, 288, 9); 
    game.load.spritesheet('9550_sad', 'res/cut_sad.png', 288, 288, 15);
    game.load.spritesheet('9550_happy', 'res/cut_happy.png', 288, 288, 4);
    
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

    var style = {font:"50px Arial", fill: "#ffffff", align: "center"};
    timeText = game.add.text(300, window.screen.availHeight / 8, timeString, style);

    var timer = game.time.create();
    timer.repeat(1 * Phaser.Timer.SECOND, 7200, updateTime, this);
    timer.start();

}

function updateTime() {
    var time = new Date();

    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timeString = hours + ":" + minutes + ":" + seconds;
    timeText.text = timeString;
}

function actionOnClick (pointer) {
    //  Manually changing the frames of the food, i.e, how it will look when you play with it
    pointer.setFrames(2, 2, 1);
    raw_pass_key_digit = pointer.key;
    pass_key_digit = raw_pass_key_digit.replace("food", "");

    pass_key = pass_key + "" + pass_key_digit;
    console.log(pass_key);
 
    if(pass_key.length == 1) {
    	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house1');
    	passphrase_prompt()
        if (typeof sprite !== 'undefined') {
            sprite.kill();
        }
    	//show foot
    }
    else if(pass_key.length == 2) {
    	house.kill();
    	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house2');
    	//show feet
    }
    else if(pass_key.length == 3) {
    	house.kill();
    	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house3');
    	//show feet and eyes
    }
    else if(pass_key.length == 4) {
        if (users[pass_key] && users[pass_key].isLoggedIn) {
            clockOutUser(pass_key);
        }
        else {
            clockInUser(pass_key);
        }
    }
}

function hide_pet(){
	//remove sprites
    reset();
    sprite.kill();
}

function show_pet(passcode){
	//check if it should be sad or happy on logout
    const mood = users[passcode].isLate ? pass_key + '_sad' : pass_key + '_happy';
	reset();
    entertext.kill();
    passphrase.kill();
	sprite = game.add.sprite(300, window.screen.availHeight / 1.5, mood);
    //sprite.animations.add('walk', [0, 0, 0, 1, 1, 1, 2, 2, 2]);
    sprite.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19]);
    sprite.animations.play('walk', 15, true);
    //sprite.scale.set(4);
    sprite.smoothed = false;
}

function reset(){
	pass_key = "";	
	house.kill();
	house = game.add.sprite(150, window.screen.availHeight / 4 + 150, 'house');
}

function passphrase_prompt(){
	entertext = game.add.text(200, window.screen.availHeight / 4, 'Feed Your TandaGotchi\n', {font:"40px Arial", fill: "#ffffff", align: "left"});
	passphrase = game.add.text(300, window.screen.availHeight / 4 + 50, '* * * *\n', {font:"80px Arial", fill: "#ffffff", align: "left"});
}

const url = 'https://my.tanda.co/api/v2';
const authorization = 'bearer 657170d9462612fd89c373e2fffdb65c07b857b0af6e9c48a4fd8bfc0fd33368';

function clockInUser(passcode) {
    getAllUsers(passcode).then((users) => {
        let userId = -1;
        users.forEach((user) => {
            if (user.passcode === passcode) {
                userId = user.id
            }
        });
        return userId;
    }).then((userId) => {
        return clock('clockin', userId)
    }).then((response) => {
        users[passcode].isLoggedIn = true;
        show_pet(passcode);
        users[passcode].isLate = true; // fake late clockin
        console.log('clocked in!');
    }).catch((error) => {
        users[passcode].isLoggedIn = false;
        hide_pet(passcode);
        console.log('failed to clock in!');
        console.log(error);
    });
}

function clockOutUser(passcode) {
    getAllUsers(passcode).then((users) => {
        let userId = -1;
        users.forEach((user) => {
            if (user.passcode === passcode) {
                userId = user.id
            }
        });
        return userId;
    }).then((userId) => {
        const scheduleStart = getUserSchedule(userId);
        const clockinTime = getLastUserClockin(userId);
        const clockout = clock('clockout', userId);

        Promise.all([scheduleStart, clockinTime, clockout]).then((timetables) => {
            if (timetables[1].time - timetables[0].start > 300) {
                users[passcode].isLate = true;
                console.log('you fed me late');
                show_pet(passcode);
            }
            else {
                users[passcode].isLate = false;
                show_pet(passcode);
            }
        }).catch((error) => {
            hide_pet();
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
}

function getAllUsers() {
    return fetch(`${url}/users`, {  
        method: 'get',  
        headers: {
          'Authorization': authorization,
        },  
    })
    .then(status)
    .then(json)  
    .then((response) => {
        return Promise.resolve(response);
    })  
    .catch((error) => {
        return Promise.reject(error);
    });
}

function clock(type, userId) {
    let ts = Math.round((new Date()).getTime() / 1000);
    console.log(userId)
    return fetch(`${url}/clockins`, {  
        method: 'post',  
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          type: type,
          time: ts,
        }),
    })
    .then(status)
    .then(json)  
    .then((response) => {
        return Promise.resolve(response);
    })  
    .catch((error) => {
        return Promise.reject(error);
    });
}

function getUserSchedule(userId) {
    const today = new Date().toJSON().slice(0,10);
    const params = `user_ids=${userId}&from=${today}&to=${today}`;
    return fetch(`${url}/schedules?${params}`, {
        method: 'get',
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json'
        },
    })
    .then(status)
    .then(json)  
    .then((response) => {
        console.log(response);
        return Promise.resolve(response[0]); // we're getting only the user's sched
    })  
    .catch((error) => {
        return Promise.reject(error);
    });
}

function getLastUserClockin(userId) {
    const today = new Date().toJSON().slice(0,10);
    const params = `user_id=${userId}&from=${today}&to=${today}`;
    return fetch(`${url}/clockins?${params}`, {
        method: 'get',
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json'
        },
    })
    .then(status)
    .then(json)  
    .then((response) => {
        let lastClockIn = {};
        for(let i = response.length - 1; i >= 0; i--) {
            if (response[i].type === 'clockin') {
                lastClockIn = response[i];
                break;
            }
        }
        return Promise.resolve(lastClockIn);
    })
    .catch((error) => {
        return Promise.reject(error);
    });
}

function status(response) {  
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  }  
}

function json(response) {  
  return response.json()  
}