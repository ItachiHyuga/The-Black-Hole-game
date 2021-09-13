
GA = GA || {};
GA.plugins = function(ga) {

//-------------

  //First, you need an array to store the particles.
  ga.particles = [];

  ga.particleEffect = function(
    x, 
    y, 
    spriteFunction,
    numberOfParticles,
    gravity,
    randomSpacing,
    minAngle, maxAngle,
    minSize, maxSize, 
    minSpeed, maxSpeed,
    minScaleSpeed, maxScaleSpeed,
    minAlphaSpeed, maxAlphaSpeed,
    minRotationSpeed, maxRotationSpeed
  ) {

    if (x === undefined) x = 0;
    if (y === undefined) y = 0; 
    if (spriteFunction === undefined) spriteFunction = function(){return ga.circle(10, "red")};
    if (numberOfParticles === undefined) numberOfParticles = 10;
    if (gravity === undefined) gravity = 0;
    if (randomSpacing === undefined) randomSpacing = true;
    if (minAngle === undefined) minAngle = 0; 
    if (maxAngle === undefined) maxAngle = 6.28;
    if (minSize === undefined) minSize = 4; 
    if (maxSize === undefined) maxSize = 16; 
    if (minSpeed === undefined) minSpeed = 0.1; 
    if (maxSpeed === undefined) maxSpeed = 1; 
    if (minScaleSpeed === undefined) minScaleSpeed = 0.01; 
    if (maxScaleSpeed === undefined) maxScaleSpeed = 0.05;
    if (minAlphaSpeed === undefined) minAlphaSpeed = 0.02; 
    if (maxAlphaSpeed === undefined) maxAlphaSpeed = 0.02;
    if (minRotationSpeed === undefined) minRotationSpeed = 0.01; 
    if (maxRotationSpeed === undefined) maxRotationSpeed = 0.03;
    
    //`randomFloat` and `randomInt` helper functions
    var randomFloat = function(min, max){return min + Math.random() * (max - min)},
        randomInt = function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min};

    //An array to store the angles
    var angles = [];

    //A variable to store the current particle's angle
    var angle;

    //Figure out by how many radians each particle should be separated
    var spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

    //Create an angle value for each particle and push that
    //value into the `angles` array
    for(var i = 0; i < numberOfParticles; i++) {

      //If `randomSpacing` is `true`, give the particle any angle
      //value between `minAngle` and `maxAngle`
      if (randomSpacing) {
        angle = randomFloat(minAngle, maxAngle);
        angles.push(angle);
      } 
      
      //If `randomSpacing` is `false`, space each particle evenly,
      //starting with the `minAngle` and ending with the `maxAngle`
      else {
        if (angle === undefined) angle = minAngle;
        angles.push(angle);
        angle += spacing;
      }
    }

    //Make a particle for each angle
    angles.forEach(function(angle){
      makeParticle(angle)
    });

    //Make the particle
    function makeParticle(angle) {

      //Create the particle using the supplied sprite function
      var particle = spriteFunction();

      //Display a random frame if the particle has more than 1 frame
      if (particle.frames.length > 0) {
        particle.gotoAndStop(randomInt(0, particle.frames.length - 1));
      }

      //Set the x and y position
      particle.x = x - particle.halfWidth;
      particle.y = y - particle.halfHeight;

      //Set a random width and height
      var size = randomInt(minSize, maxSize);
      particle.width = size;
      particle.height = size;

      //Set a random speed to change the scale, alpha and rotation
      particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
      particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
      particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);

      //Set a random velocity at which the particle should move
      var speed = randomFloat(minSpeed, maxSpeed);
      particle.vx = speed * Math.cos(angle);
      particle.vy = speed * Math.sin(angle);

      //The particle's `update` method is called on each frame of the
      //game loop
      particle.updateParticle = function() {

        //Add gravity
        particle.vy += gravity;

        //Move the particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        //Change the particle's `scale`
        if (particle.scaleX - particle.scaleSpeed > 0) {
          particle.scaleX -= particle.scaleSpeed;
        }
        if (particle.scaleY - particle.scaleSpeed > 0) {
          particle.scaleY -= particle.scaleSpeed;
        }

        //Change the particle's rotation
        particle.rotation += particle.rotationSpeed;

        //Change the particle's `alpha`
        particle.alpha -= particle.alphaSpeed;

        //Remove the particle if its `alpha` reaches zero
        if (particle.alpha <= 0) {
          ga.remove(particle);
          ga.particles.splice(ga.particles.indexOf(particle), 1);
        }
      };

      //Push the particle into the `particles` array
      //The `particles` array needs to be updated by the game loop each
      //frame
      ga.particles.push(particle);
    }
  }

  //`updateParticles` loops through all the sprites in `ga.particles`
  //and runs their `updateParticles` functions.
  ga.updateParticles = function() {
    
    //Update all the particles in the game.
    if (ga.particles.length > 0) {
      for(var i = ga.particles.length - 1; i >= 0; i--) {
        var particle = ga.particles[i];
        particle.updateParticle();
      }
    }
  }

  //Push `updateParticles` into the `ga.updateFunctions` array so that
  //it runs inside Ga's game loop. (See the `ga.update` method in the 
  //`ga.js` file to see how this works.
  ga.updateFunctions.push(ga.updateParticles);

ga.emitter = function(interval, particleFunction) {
    var emitter = {},
        timerInterval = undefined;

    emitter.playing = false;

    function play() {
      if (!emitter.playing) {
        particleFunction();
        timerInterval = setInterval(emitParticle.bind(this), interval);
        emitter.playing = true;
      }
    }

    function stop() {
      if (emitter.playing) {
        clearInterval(timerInterval);
        emitter.playing = false;
      }
    }

    function emitParticle() {
      particleFunction();
    }

    emitter.play = play;
    emitter.stop = stop;
    return emitter;
  }


  ga.tilingSprite = function(width, height, source, x, y) {

    //Set the defaults.
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;

    //Figure out the tile's width and height.
    var tileWidth, tileHeight;

    //If the source is a texture atlas frame, use its
    //`frame.w` and `frame.h` properties.
    if(ga.assets[source].frame) {
      tileWidth = ga.assets[source].frame.w;
      tileHeight = ga.assets[source].frame.h;
    }

    //If it's an image, use the image's 
    //`width` and `height` properties.
    else {
      tileWidth = ga.assets[source].width;
      tileHeight = ga.assets[source].height;
    }

    //Figure out the rows and columns.
    //The number of rows and columns should always be
    //one greater than the total number of tiles
    //that can fit in the rectangle. This give us one 
    //additional row and column that we can reposition
    //to create the infinite scroll effect.

    var columns, rows;

    //1. Columns
    //If the width of the rectangle is greater than the width of the tile,
    //calculate the number of tile columns.
    if (width >= tileWidth) {
      columns = Math.round(width / tileWidth) + 1;
    } 
    
    //If the rectangle's width is less than the width of the
    //tile, set the columns to 2, which is the minimum.
    else {
      columns = 2;
    }

    //2. Rows
    //Calculate the tile rows in the same way.
    if (height >= tileHeight) {
      rows = Math.round(height / tileHeight) + 1;
    } else {
      rows = 2; 
    }

    //Create a grid of sprites that's just one sprite larger
    //than the `totalWidth` and `totalHeight`.
    var tileGrid = ga.grid(
      columns, rows, tileWidth, tileHeight, false, 0, 0,
      function(){

        //Make a sprite from the supplied `source`.
        var tile = ga.sprite(source);
        return tile;
      }
    );

    //Declare the grid's private properties that we'll use to
    //help scroll the tiling background.
    tileGrid._tileX = 0;
    tileGrid._tileY = 0;

    //Create an empty rectangle sprite without a fill or stoke color.
    //Set it to the supplied `width` and `height`.
    var container = ga.rectangle(width, height, "none", "none");
    container.x = x;
    container.y = y;

    //Set the rectangle's `mask` property to `true`. This switches on `ctx.clip()`
    //In the rectangle sprite's `render` method.
    container.mask = true;

    //Add the tile grid to the rectangle container.
    container.addChild(tileGrid);

    //Define the `tileX` and `tileY` properties on the parent container
    //so that you can scroll the tiling background.
    Object.defineProperties(container, {
      tileX: {
        get: function() {
          return tileGrid._tileX;
        },

        set: function(value) {

          //Loop through all of the grid's child sprites.
          tileGrid.children.forEach(function(child){

            //Figure out the difference between the new position
            //and the previous position.
            var difference = value - tileGrid._tileX;
            
            //Offset the child sprite by the difference.
            child.x += difference;

            //If the x position of the sprite exceeds the total width
            //of the visible columns, reposition it to just in front of the 
            //left edge of the container. This creates the wrapping
            //effect.
            if (child.x > (columns - 1) * tileWidth) {
              child.x = 0 - tileWidth + difference;
            }

            //Use the same procedure to wrap sprites that 
            //exceed the left boundary.
            if (child.x < 0 - tileWidth - difference) {
              child.x = (columns - 1) * tileWidth;
            }
          });

          //Set the private `_tileX` property to the new value.
          tileGrid._tileX = value;
        },
        enumerable: true, configurable: true
      },
      tileY: {
        get: function() {
          return tileGrid._tileY;
        },

        //Follow the same format to wrap sprites on the y axis.
        set: function(value) {
          tileGrid.children.forEach(function(child){
            var difference = value - tileGrid._tileY;
            child.y += difference;
            if (child.y > (rows - 1) * tileHeight) child.y = 0 - tileHeight + difference;
            if (child.y < 0 - tileHeight - difference) child.y = (rows - 1) * tileHeight;
          });
          tileGrid._tileY = value;
        },
        enumerable: true, configurable: true
      }
    });

    //Return the rectangle container.
    return container;
  }


  
  ga.grid = function(
    columns, rows, cellWidth, cellHeight,
    centerCell, xOffset, yOffset,
    makeSprite,
    extra
  ){
  //Set the defaults
  if (columns === undefined) columns = 0;
  if (rows === undefined) rows = 0;
  if (cellWidth === undefined) cellWidth = 32;
  if (cellHeight === undefined) cellHeight = 32;
  if (xOffset === undefined) xOffset = 0;
  if (yOffset === undefined) yOffset = 0;
  if (centerCell === undefined) centerCell = false;
  
  /*
  if (!columns && columns !== 0) columns = 0;
  if (!rows && rows !== 0) rows = 0;
  if (!cellWidth && cellWidth !== 0) cellWidth = 32;
  if (!cellHeight && cellHeight !== 0) cellHeight = 32;
  if (!xOffset && xOffset !== 0) xOffset = 0;
  if (!yOffset && yOffset !== 0) yOffset = 0;
  centerCell = centerCell || false;
  */

  //Create an empty DisplayObjectContainer
  var container = ga.group();

  //The `create` method
  container.createGrid = function() {
    var length = columns * rows;
    for(var i = 0; i < length; i++) {
      var x = ((i % columns) * cellWidth),
          y = (Math.floor(i / columns) * cellHeight);

      //Use the `makeSprite` method supplied in the constructor
      //to make a sprite for the grid cell
      var sprite = makeSprite();
      container.addChild(sprite);

      //Should the sprite be centered in the cell?
      if (!centerCell) {
        sprite.x = x + xOffset;
        sprite.y = y + yOffset;
      }
      else {
        sprite.x = x + (cellWidth / 2 ) - sprite.halfWidth + xOffset;
        sprite.y = y + (cellHeight / 2) - sprite.halfHeight + yOffset;
      }

      //Run any optional extra code. This calls the
      //`extra` method supplied by the constructor
      if (extra) extra(sprite);
    }
  };
  container.createGrid();
  ga.stage.addChild(container);
  return container;
};





ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //### randomFloat
  // Returns a random floating point number between a minimum and maximum value
  ga.randomFloat = function(min, max) {
    return min + Math.random()*(max-min);
  }



  ga.move = function(sprites) {
    if (sprites instanceof Array === false) {
      internal_move(sprites)
    } else {
      for (var i = 0; i < sprites.length; i++) {
        internal_move(sprites[i])
      }
    }
  };

  function internal_move(sprite) {
    sprite.x += sprite.vx | 0;
    sprite.y += sprite.vy | 0;
  }

  ga.contain = function(s, bounds, bounce, extra){

    var x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        height = bounds.height;

    //Set `bounce` to `false` by default
    bounce = bounce || false;

    //The `collision` object is used to store which
    //side of the containing rectangle the sprite hits
    var collision;

    //Left
    if (s.x < x) {

      //Bounce the sprite if `bounce` is true
      if (bounce) s.vx *= -1;

      //If the sprite has `mass`, let the mass
      //affect the sprite's velocity
      if(s.mass) s.vx /= s.mass;
      s.x = x;
      collision = "left";
    }

    //Top
    if (s.y < y) {
      if (bounce) s.vy *= -1;
      if(s.mass) s.vy /= s.mass;
      s.y = y;
      collision = "top";
    }

    //Right
    if (s.x + s.width > width) {
      if (bounce) s.vx *= -1;
      if(s.mass) s.vx /= s.mass;
      s.x = width - s.width;
      collision = "right";
    }

    //Bottom
    if (s.y + s.height > height) {
      if (bounce) s.vy *= -1;
      if(s.mass) s.vy /= s.mass;
      s.y = height - s.height;
      collision = "bottom";
    }

    //The `extra` function runs if there was a collision
    //and `extra` has been defined
    if (collision && extra) extra(collision);

    //Return the `collision` object
    return collision;
  };





  ga.hit = function(a, b, react, bounce, global, extra) {
    var collision;

    //Set the defaults
    react = react || false;
    bounce = bounce || false;
    global = global || false;

    //Check to make sure one of the arguments isn't an array
    if (b instanceof Array || a instanceof Array) {

      //If it is, check for a collision between a sprite and an array
      spriteVsArray();
    } else {

      //If one of the arguments isn't an array, find out what type of
      //collision check to run
      collision = findCollisionType(a, b);
      if (collision && extra) extra(collision);
    }

    //Return the result of the collision.
    //It will be `undefined` if there's no collision and `true` if
    //there is a collision. `rectangleCollision` sets `collsision` to
    //"top", "bottom", "left" or "right" depeneding on which side the
    //collision is occuring on
    return collision;

    function findCollisionType(a, b) {

      //Are `a` and `b` both sprites?
      //(We have to check again if this function was called from
      //`spriteVsArray`)
      var aIsASprite = a.parent !== undefined,
          bIsASprite = b.parent !== undefined;

      if (aIsASprite && bIsASprite) {

        //Yes, but what kind of sprites?
        if(a.diameter && b.diameter) {

          //They're circles
          return circleVsCircle(a, b);
        } 
        else if (a.diameter && !b.diameter) {

          //The first one is a circle and the second is a rectangle
          return circleVsRectangle(a, b);
        } 
        else {

          //They're rectangles
          return rectangleVsRectangle(a, b);
        }
      }

      //They're not both sprites, so what are they?
      //Is `a` not a sprite and does it have x and y properties?
      else if (bIsASprite && !(a.x === undefined) && !(a.y === undefined)) {

        //Yes, so this is a point vs. sprite collision test
        return ga.hitTestPoint(a, b);
      }
      else {
        //The user is trying to test some incompatible objects
        throw new Error("I'm sorry, " + a + " and " + b + " cannot be use together in a collision test.");
      }
    }

    function spriteVsArray() {

      //If `a` happens to be the array, flip it around so that it becomes `b`
      if (a instanceof Array) {
        var temp = a;
        b = a;
        a = temp;
      }

      //Loop through the array in reverse
      for (var i = b.length - 1; i >= 0; i--) {
        var sprite = b[i];
        collision = findCollisionType(a, sprite);
        if (collision && extra) extra(collision, sprite);
      }
    }

    function circleVsCircle(a, b) {

      //If the circles shouldn't react to the collision,
      //just test to see if they're touching
      if(!react) {
        return ga.hitTestCircle(a, b, global);
      }

      //Yes, the circles should react to the collision
      else {

        //Are they both moving?
        if (a.vx + a.vy !== 0 && b.vx + b.vy !== 0) {

          //Yes, they are both moving
          //(moving circle collisions always bounce apart so there's
          //no need for the third, `bounce`, argument)
          return ga.movingCircleCollision(a, b, global);
        }
        else {

          //No, they're not both moving
          return ga.circleCollision(a, b, bounce, global);
        }
      }
    }

    function rectangleVsRectangle(a, b) {

      //If the rectangles shouldn't react to the collision, just
      //test to see if they're touching
      if(!react) {
        return ga.hitTestRectangle(a, b, global);
      }
      //Yes
      else {

        //Should they bounce apart?
        //Yes
        if(bounce) {
          return ga.rectangleCollision(a, b, true, global);
        }
        //No
        else {
          return ga.rectangleCollision(a, b, false, global);
        }
      }
    }

    function circleVsRectangle(a, b) {

      //If the rectangles shouldn't react to the collision, just
      //test to see if they're touching
      if(!react) {
        return ga.hitTestCircleRectangle(a, b, global);
      } 
      else {
        return ga.circleRectangleCollision(a, b, bounce, global);
      }
    }
  };



  ga.hitTestPoint = function(point, sprite) {

    var shape, left, right, top, bottom, vx, vy, magnitude, hit;

    //Find out if the sprite is rectangular or circular depending
    //on whether it has a `radius` property
    if (sprite.radius) {
      shape = "circle";
    } else {
      shape = "rectangle";
    }

    //Rectangle
    if (shape === "rectangle") {

      //Get the position of the sprite's edges
      left = sprite.x;
      right = sprite.x + sprite.width;
      top = sprite.y;
      bottom = sprite.y + sprite.height;

      //Find out if the point is intersecting the rectangle
      hit = point.x > left && point.x < right && point.y > top && point.y < bottom;
    }

    //Circle
    if (shape === "circle") {

      //Find the distance between the point and the
      //center of the circle
      vx = point.x - sprite.centerX,
      vy = point.y - sprite.centerY,
      magnitude = Math.sqrt(vx * vx + vy * vy);

      //The point is intersecting the circle if the magnitude
      //(distance) is less than the circle's radius
      hit = magnitude < sprite.radius;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };

  
  ga.hitTestCircle = function(c1, c2, global) {
    var vx, vy, magnitude, totalRadii, hit;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //Calculate the vector between the circles’ center points
    if(global) {

      //Use global coordinates
      vx = (c2.gx + c2.radius) - (c1.gx + c1.radius);
      vy = (c2.gy + c2.radius) - (c1.gy + c1.radius);
    } else {

      //Use local coordinates
      vx = c2.centerX - c1.centerX;
      vy = c2.centerY - c1.centerY;
    }

    //Find the distance between the circles by calculating
    //the vector's magnitude (how long the vector is)
    magnitude = Math.sqrt(vx * vx + vy * vy);

    //Add together the circles' total radii
    totalRadii = c1.radius + c2.radius;

    //Set hit to true if the distance between the circles is
    //less than their totalRadii
    hit = magnitude < totalRadii;

    //`hit` will be either `true` or `false`
    return hit;
  };

  /*
  #### hitTestRectangle

  Use it to find out if two rectangular sprites are touching.
  Parameters:
  a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
  b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.

  */

  ga.hitTestRectangle = function(r1, r2, global) {
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //A variable to determine whether there's a collision
    hit = false;

    //Calculate the distance vector
    if (global) {
      vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
      vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
    } else {
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;
    }

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
      } else {

        //There's no collision on the y axis
        hit = false;
      }
    } else {

      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };










  //SOUND


  //--------------------

}