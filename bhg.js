 //----THE BLACK HOLE-------//
 

 /* 
 
 Karan Bhatt
 
 A short game built on Ga engine for Js13k JavaScript coding competition. 

-----------------------------
GAME DESCRIPTION

ABOUT

 To cross a level you need to devour all the planets. Devouring a planet increases your size. If you touch the edges, the level ends. 

CONTROLS

 Arrow Keys: Move
 P: Pause/Resume 
 Space: Next level

LEVELS

 There are 18 levels in the game with increasing difficulty. The number of planets that you have to eat and the speed also goes up by 1 per level. 

SCORE

 You get score per planet you eat. The more difficult the level, the more the planet is worth. For instance, level 2 planet gives you a score of +2, while a level 16 planet gives you +16.
 Once you hit a wall, certain score is deducted regardless of the level, as a price to replay that level. If the score ever hits zero, the game restarts from level 1.

-----------------------------

SPECIAL THANKS

 I would not have worked on this game was it not for Anya. Many thanks to her for the various, suggestions and consistent grinding of the game which inevitably became the motivation for finishing the challenge.

 Many thanks to Sid and Mahesh for testing out various levels and their recommendations to improve it.

 I am novice at game development, and this is one of the first games I've made, and Ga engine is the first game engines that I have worked on. The documentation on it is insanely well written and really helped me understand how javascript game development goes. Even the code is well commented and seggmented making it easier to edit it for this challenge. I absolutely enjoyed using it and learned a lot along the way.

 link to the Ga Engine repository: https://github.com/kittykatattack/ga

 The sounds I have taken from https://xem.github.io/MiniSoundEditor/ with some minor changes of my own. 

-----------------------------

INTRODUCTION

I am just a beginner at this, so most of my code might not be the shortest or the most efficient. But I have made an effort to make it readable and comments become a basic part of that. 

Some of the variables are not named well, because I was looking to cut size, but that is completely my fault as I realised I should have just done that at a later stage of the game when everything was done and dusted and all I had to do was minify the game. It would have been a better idea to keep long descriptive variable names and just replacing them later with alphabets or characters.

-----------------------------




 */
 
 


//Initialize Ga engine
let g = ga(
  window.innerWidth - 30, window.innerHeight - 30, setup,
  [
  
    //load all resources
    "i/sky.png",
    "i/p1.png",
    "i/p2.png",
    "i/p3.png",
    "i/star.png",
    "i/p4.png",
    "i/p5.png",
    "i/p6.png",
    "i/p7.png"

  ]
);

//Start the Ga engine.
g.start();

//Declare all variables
//Will destructure to save space
let b, //Black Hole sprite 
    c, //planet sprites
    message, message2,e, ee, sc,  //text sprites
    collisions, gameover, dvd, //other
    x1, y1, //velocities
    sky, particleStream; //particle system

let speed = 4; //speed of blackhole per level

let howmuchfood = 15; //Planets are reffered to as food for blackhole. How many planets needed to be devoured to progress to the next level.

let level = 1;

let score=0;
/*obsolete avriables*/
/*
let a;
let spritespeed = 0; 
let spritecolor = [
"#a34abc", "#3ffc00", "#2bcaba", "#dff200", "#e600cf"
];
let reset2 = g.keyboard(114);
let dir = 1;
*/

//added a random function to array prototype. This function returns one random value from an array or any size. 
Array.prototype.random = function () {
return this[Math.floor((Math.random()*this.length))];
}

//Audio
f =[ 
  //win sound
  function(i){
    var n=8e4;
    if (i > n) return null;
    return Math.sin(i/1000 - Math.sin(i/100)*Math.sin(i/61))*t(i,n);
  }
,
//lose sound
function(i){
  var n=12e4;
  if (i > n) return null;
  return Math.sin(i/2000 - Math.sin(i/331)*Math.sin(i/61))*t(i,n);
}
//Muted Explosion
, function(i){
  let n=4e4;
  if (i > n) return null;
  return Math.sin(i/2000 - Math.sin(i/331)*Math.sin(i/61))*t(i,n); 
}


]

//Audio player 
//Just calling this function for certain conditions
function spacesound(zz){
t=(i,n)=>(n-i)/n;
A=new AudioContext()
m=A.createBuffer(1,96e3,48e3)
bb=m.getChannelData(0)

  for(i=96e3;i--;)bb[i]=f[zz](i)
s=A.createBufferSource()
s.buffer=m
s.connect(A.destination)
s.start()
}



//setup 
function setup() {

  //game board
  g.canvas.style.border = "3px #3ffc00 solid";
 
 //painting the space sky
 sky = g.tilingSprite(
    g.canvas.width,
    g.canvas.height,
    "i/sky.png"
  );
  

  //make a game scene
  gameScene = g.group();

  //make sprites

  //player sprite
  b = g.rectangle(
    40, 40,
    "black",
    "#3ffc00", 5);
  b.x = 120;
  b.y = g.canvas.height / 2 - b.halfHeight;
  /*b = g.sprite("i/pog.svg")
  b.x = 50;
  b.y = g.canvas.height / 2 - b.halfHeight;*/
  gameScene.addChild(b);

  //planet sprite
 // c = g.circle(40, "#3ffc00")

 //essentially skins for planets. can add more or reduce depending on space left/subscription
  c=g.sprite(["i/p1.png","i/p2.png","i/p3.png","i/p4.png",
  "i/p5.png",
  "i/p6.png",
  "i/p7.png"])
  do {
    x1 = g.randomInt(0, g.canvas.width - c.width)
    y1 = g.randomInt(0, g.canvas.height - c.height)
  } while (x1 > (b.x + c.width) & x1 < (b.x + b.width) || y1 > (b.y + b.height) & y1 < (b.y + c.height))

  c.x = x1
  c.y = y1
  c.vx = 0
  c.vy = 0
  c.type = 1;
  c.number = 1;

  gameScene.addChild(c);
  //text sprite
  e = g.text("l", "20px Futura", "#3ffc00", (g.canvas.width - 250), 10)
  ee = g.text("Level: ", "15px Futura", "#3ffc00", (g.canvas.width -500), 10)
  sc = g.text("Score: ", "15px Futura", "#3ffc00", (g.canvas.width -700), 10)

  //end screen
  message = g.text("", "25px Futura", "#3ffc00", 20, 20);
  message.x = 120;
  message.y = g.canvas.height / 2 - 64;

  message2 = g.text("Level "+level, "30px Futura", "#3ffc00", 20, 20);
  message2.x = 120;
  message2.y = g.canvas.height / 2 - 100;
  //end scene

  gameOverScene = g.group(message, message2);
  gameOverScene.visible = false;
  //g.fourKeyController(b, 5, 38, 39, 40, 37);




  //Left arrow key `press` method
  g.key.leftArrow.press = function () {
    //Change the b's velocity when the key is pressed
    b.vx = speed * (-1);
    b.vy = 0;
  };

  g.key.upArrow.press = function () {
    b.vy = speed * (-1);
    b.vx = 0;
  };

  g.key.rightArrow.press = function () {
    b.vx = speed;
    b.vy = 0;
  };

  g.key.downArrow.press = function () {
    b.vy = speed;
    b.vx = 0;
  };
  g.key.p.press = function () {
    //pause and resume
    if (g.paused==false){
      g.pause()
    } else {
      g.resume()
    }
  };


  //particle stream | Ga engine Particle system
  
  //Particles emiiting from the black hole, signifying planets it destroyed
  particleStream = g.emitter(
    100, //The interval
    function () {
      return g.particleEffect( //The particle function

        //essentially all particles emit from the black hole
        b.x + g.randomInt(0, (b.width)), //x position
        b.y + g.randomInt(0, (b.height)), //y position
    
     
        function () { //Particle sprite
          return g.sprite("i/p1.png");
        },
        c.number, //Number of particles = number of planets destroyed
        0, //Gravity
        false, //Random spacing
        3.14, 6.28, //Min/max angle
        b.height / 25, b.height / 15, //Min/max size
        2, 5 //Min/max speed
      
      );
    }
  );
  /*
  particleStream = g.emitter(
    10, //The interval
    function () {
      return g.particleEffect( //The particle function
       ( b.x), //x position
      ( b.y), //y position
    
     
        function () { //Particle sprite
          return g.sprite("i/p1.png");
        },
        1, //Number of particles
        0, //Gravity
        false, //Random spacing
        3.14, 6.28, //Min/max angle
        b.height / 25, b.height / 15, //Min/max size
        0, 1 //Min/max speed
      
      );
    }
  );*/

  stars = g.emitter(
    10, //The interval
    function () {
      return g.particleEffect( //The particle function
        g.randomInt(0, (g.canvas.width)), //x position
        g.randomInt(0, (g.canvas.height)), //y position
        function () { //Particle sprite
          return g.sprite("i/star.png");
        },
        1, //Number of particles
        0, //Gravity
        false, //Random spacing
        0, 6.28, //Min/max angle
        1, 5, //Min/max size
        0, 1 //Min/max speed
      );
    }
  );


  stars2 = g.emitter(
    10, //The interval
    function () {
      return g.particleEffect( //The particle function
        g.randomInt(0, (g.canvas.width)), //x position
        g.randomInt(0, (g.canvas.height)), //y position
        function () { //Particle sprite
          return g.sprite("i/star.png");
        },
        1, //Number of particles
        0, //Gravity
        true, //Random spacing
        0, 0, //Min/max angle
        0.5, 2, //Min/max size
        b.vx, b.vy //Min/max speed
      );
    }
  );

  g.state = play;
}




function play() {

  g.move(b);
  //fix planet behavior
  g.move(c);

  //planet rotation

  c.rotation+=0.09
    //black hole rotation
     // speed boosts
     if (level%3 == 0) {
      b.rotation+=0.09
    } else {
      //make more performant
      b.rotation=0
    }

  //Warning from border

  if (b.x <= 30 || b.y <= 30 || 30 >=g.canvas.width-b.x-b.width || 30 >=g.canvas.height-b.y-b.height   ) {
    g.canvas.style.borderColor = "red"
  } else {
    g.canvas.style.borderColor = "#3ffc00"
  }



  dvd= g.contain(c, g.stage.localBounds);
  if (dvd === "top" || dvd === "bottom") {
    
    c.vy = c.vy * (-1)
    
  } else if (dvd === "right" || dvd === "left") {

    c.vx = c.vx *  (-1)
  }
  //sky.tileX -= 1;
  sky.tileY -= b.vy;
  sky.tileX -= b.vx;
  particleStream.play();
  stars.play()
  stars2.play()

  gameover = g.contain(b, g.stage.localBounds);
  if (gameover === "top" || gameover === "bottom" || gameover === "right" || gameover === "left" || level == 19) {
    if (level == 19) {
      spacesound(0)
      message2.content = "You won!"
      message.content = "Drifting in an empty universe void of memory. What next?";
      g.state = end;
    } else if((score-25)>=0){
      spacesound(1)
      score= score-25;
      sc.content= "Score: "+score
      message2.content = "Try Again!"
      message.content = "You must continue eating worlds. Press space to try again.";
      g.state = end;
    } else {
      spacesound(1)
      score=0
      sc.content= "Score: 0"
      message2.content = "Game over!"
      message.content = "You need a score of atleast 25 to try again. Press space to restart.";
      level=1;
      speed=4;
      g.state = end;

    }

  }

  collision = g.hit(b, c)

  //change value to reduce level length
  if (c.number == howmuchfood) {
    spacesound(0)
    g.state = next;


  }

  if (collision) {

    //score

    score= score + level
    sc.content= score

 
// Sound

spacesound(2)


//////
    c.number += 1
    e.content += "|"
    ee.content = "Level "+level +" | "+((c.number / howmuchfood) * 100) + "%"
    sc.content = "Score: "+score
    
    //One time particle effect on collision
    g.particleEffect(
      (c.x), //start x position
      (c.y), //start y position
      function () { //Particle function
        //same image as the planet destroyed
        return g.sprite(c.source.name);
        
      },
      50, //Number of particles
      0, //Gravity
      true, //Random spacing
      0, 6.28, //Min/max angle
      6, 12, //Min/max size
      0.25, 5, //Min/max speed 
      0.0009, 0.001, //Min/max scale speed
      0.009, 0.001, //Min/max alpha speed
      0.05, 0.1 //Min/max rotation speed
    );

    //end
    //console.log(c.number)
    do {
      x1 = g.randomInt(0, g.canvas.width - c.width)
      y1 = g.randomInt(0, g.canvas.height - c.height)
    } while (x1 > (b.x + c.width) & x1 < (b.x + b.width) || y1 > (b.y + b.height) & y1 < (b.y + c.height))
    c.x = x1
    c.y = y1
    c.show(g.randomInt(0,6))

    /*if (level >= 3) {
      c.fillStyle= spritecolor.random()
    }*/
  
    console.log(level%2)
   // speed boosts
    if (level%2 == 0) {
    c.vx = g.randomInt(0, 20)
    c.vy = g.randomInt(0, 20)
  }

  //how large does the ball grow?
    if (level<15) {
    b.width += 20
    b.height += 20
    } else {
      b.width += 10
      b.height += 10
    }

  } else {

  }


}

function next() {

  //howmuchfood++;

  //console.log("next "+level%2)

  
  particleStream.stop();
  gameScene.visible = false;
  message.content = "There are more universes to conquer. Press space for level " + level;
  message2.content = "Level "+level + " completed";

  message.content = 
  (level == 1) ? "Your journey begins, their journey ends. Press space for level 2." :
  (level == 2) ? "Forty worlds are not enough. You must devour more. Press space to go to level 3." : 
  (level == 3) ? "Eighty worlds reduced to nothingness. You must persevere. Press space for level 4." :
  (level == 4) ? "One hundred and twenty worlds eaten. Do you feel fulfilled? Press space if you don't." :
  (level == 5) ? "Some worlds are smaller, some worlds larger. Not that it matters; it's all the same to you. You must press space.":
  (level == 6) ? "How many worlds gone? Two hundred? I am losing count. Let me tell you a secret, the count doesn't matter either.":
  (level == 7) ? "Do you strive to be fulfilled? Maybe you shouldn't. Press space to try it anyway.":
  (level == 8) ? "Some worlds want to be devoured, maybe there can be some fulfillment in that. Sometimes there is harmony in chaos. ":
  (level == 9) ? "Your perseverance ends worlds. Hundreds of them, all the time...":
  (level == 10) ? "One universe is never enough. There is always another. Press space to enter another universe.":
  (level == 11) ? "The memory of the worlds will persist. So should you.":
  (level == 12) ? "What comes in the end? You know that very well. You end worlds; don't you know what happens to them?":
  (level == 13) ? "Why must you eat worlds? Why must you not?":
  (level == 14) ? "You don't have to eat worlds if you don't want to. You know what you must do next.":
  (level == 15) ? "Do you feel lost? Maybe you shouldn't.":
  (level == 16) ? "Are they running from you, or towards you? Should you run from them, or towards them?":
  (level == 17) ? "'Now I Am Become Death, the Destroyer of Worlds'":
  (level == 18) ? "You can do what you please, O Devourer of worlds.":
  "You are beyond levels."

 // message2.content= "Level "+level

  

  gameOverScene.visible = true;
  if (g.key.space.isDown) {
    if (level%2 == 1 ) {
    
    
      c.vx = 4
      c.vy = 4
    } else {
      c.vx = 0
      c.vy = 0
  
    }
    howmuchfood++;
    level += 1
    gameScene.visible = true;
    gameOverScene.visible = false;
    speed += 1;
    b.width = 40
    b.height = 40
    b.x = 50;
    c.number = 0
    b.vx = 0
    b.vy = 0
    e.content = " "
    ee.content = " "
    sc.content = " "
    b.y = g.canvas.height / 2 - b.halfHeight;

     
    g.state = play;
  }
}

function end() {
  particleStream.stop();
  gameScene.visible = false;
  gameOverScene.visible = true;
  if (g.key.space.isDown) {

    gameScene.visible = true;
    gameOverScene.visible = false;

    b.width = 40
    b.height = 40
    b.x = 50;
    c.number = 0
    b.vx = 0
    b.vy = 0
    e.content = " "
    ee.content = " "
    b.y = g.canvas.height / 2 - b.halfHeight;
    
    g.state = play;
  }
}
/*
function levels(universe, multiverse) {
  let gamelevels = {
    multiverse1: {
      rules: function () {
        
      },
      level1: function(){
        this.rules();
      },
      level2: function() {
        this.rules();
        
   ;
      }
    },
    multiverse2: {
      rules: function(){
        
        b.fillStyle="white"
        b.strokeStyle="#c003ff"
      }

    },
  }
  let key = "multiverse" + multiverse
  let key2="level"+universe
  console.log(key2)
  return gamelevels[key][key2]()

};*/
