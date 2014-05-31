/*
	"Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
	"Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
*/

/*
	TODO LIST :
            - test on IE, FF, SAFARI
                - FF : police horizontal alignment bug, lineheight problem
                - IE : bug with masks cause doesn't use webgl
            - prettier and animations
                - multiple skins for candy ?
                - animations, like reflects ?
            - sprites to do :
                - background menu ?
            - sounds to do :
                - music ingame and menu ?
*/


var hud;
var level;
var player;


	// HUD

var HUD = function(game, levelNumber) {

    this.game = game;
    this.level = levelNumber;
    CMN.currentLevel = levelNumber;
    this.levelText = null;
    this.levelSentence;
    this.hudBg;
    this.chosenLanguage;
    this.soundButton;
    this.reloadButton;
    this.quitButton;
	
};
 
HUD.prototype = {
	
    preload: function() {

//        this.game.load.image('hud_background', 'cmn_hud_bg1.png');
//        this.game.load.image('reloadButton', 'cmn_reload1.png');
//        this.game.load.image('quitButton', 'cmn_quit1.png');

    },
	
    create: function() {
	
        this.hudBg = this.game.add.image(0, level.mapHeight, "hud_background");
        
        var translations = this.game.cache.getJSON("languages");
        this.chosenLanguage = translations[CMN.language];
        
        this.levelText = this.game.add.text(16, 448, this.chosenLanguage["level"] + ' : ' + this.level, { font: '40px cmn_webfont', fill: '#d3b05f' });
        this.levelText.anchor.setTo(0 , 0.5);
        
        this.levelSentence = this.game.add.text(210, 448, this.chosenLanguage["level" + this.level], { font: '28px cmn_webfont', fill: '#d3b05f' });
        this.levelSentence.anchor.setTo(0 , 0.5);
        
        this.soundButton = this.game.add.button(768, 448, "soundButton", this.muteSound, this, 0, 0, 0, 0);
        this.soundButton.anchor.setTo(0.5, 0.5);
        
        if (this.game.sound.mute) {
                
            this.soundButton.frame = 1;
            this.soundButton.setFrames(1, 1, 1, 1);

        } else if(!this.game.sound.mute) {

            this.soundButton.frame = 0;
            this.soundButton.setFrames(0, 0, 0, 0);

        }
	
        this.reloadButton = this.game.add.button(730, 448, "reloadButton", this.reloadLevel, this);
        this.reloadButton.anchor.setTo(0.5, 0.5);
        
        this.quitButton = this.game.add.button(692, 448, "quitButton", this.quitLevel, this);
        this.quitButton.anchor.setTo(0.5, 0.5);
        
        
    },
	
    update: function() {



    },
    
    muteSound: function() {

        this.soundButton.frame = (this.soundButton.frame + 1) % 2;
        this.soundButton.setFrames(this.soundButton.frame, this.soundButton.frame, this.soundButton.frame);

        if (this.game.sound.mute) {
            
            this.game.sound.mute = false;
            
        } else if(!this.game.sound.mute) {
            
            this.game.sound.mute = true;
            
        }
	
    },
    
    reloadLevel: function() {
        
        this.game.state.start(CMN.levels[this.level-1]);
        
    },
    
    quitLevel: function () {
        
        this.game.state.start("menu");
        
    }
 
};


// LEVEL

var Level = function(game, tilemapSource, candyXY, kingXY, powerXY) {
 
    this.game = game;
    
    this.mirrors;
    
    this.mapWidth = 800;
    this.mapHeight = 416;

    this.candy =    {
                        original : null,
                        right0 : null,
                        left0 : null,
                        top0 : null,
                        bottom0 : null,
                        right1 : null,
                        left1 : null,
                        top1 : null,
                        bottom1 : null,
                        graphicMask : null
                    };
                    
    this.king =     {
                        original : null,
                        right0 : null,
                        left0 : null,
                        top0 : null,
                        bottom0 : null,
                        right1 : null,
                        left1 : null,
                        top1 : null,
                        bottom1 : null,
                        graphicMask : null
                    };
                    
    this.power =     {
                        original : null,
                        right0 : null,
                        left0 : null,
                        top0 : null,
                        bottom0 : null,
                        right1 : null,
                        left1 : null,
                        top1 : null,
                        bottom1 : null,
                        graphicMask : null
                    };

    this.objectsToCreate = [this.candy];
    this.allObjects = [];

    this.candyXY = candyXY;
    this.kingXY = kingXY;
    this.powerXY = powerXY;

    this.avocadoPool = null;
    this.avocadoSpeed = 200;
    this.baseShotDelay = 4000;

    this.maximumDistancePossibleInTheMap = this.game.math.distance(0, 0, this.mapWidth, this.mapHeight);
    this.lastShotAt = 0;

    this.laserShotDelay = 2000;
    this.lastLaserShotAt = 0;

    this.laserBitmap;
    this.laserVisible = false;

    this.end = false;
    this.failed = false;

    this.map;
    this.layer;

    this.tilesMirrors = [];

    this.tilemapSource = tilemapSource;

    this.menuKey;
    
    this.soundForAvocado;
    this.soundForLaser;
    this.soundForDestroyed;
	
    this.alphaOfObjects = 0;
    
};
 
Level.prototype = {
 
    preload: function() {
	
//        this.game.load.image('candy', 'cmn_candy1.png');
//        this.game.load.image('king', 'cmn_king1.png');
//        this.game.load.image('power', 'cmn_power1.png');
//        this.game.load.spritesheet('avocado', 'cmn_avocados1.png', 32, 32);
//        this.game.load.image('tileBg', 'cmn_tile_bg.png');
//        this.game.load.image('tileMirror', 'mirror_temp.png');
        this.game.load.tilemap('level', this.tilemapSource, null, Phaser.Tilemap.TILED_JSON);
        
    },
 
    create: function() {
		
        this.candy.graphicMask = this.game.add.graphics(0, 0);
        
        if (this.kingXY.length === 2) {
            
            this.king.graphicMask = this.game.add.graphics(0, 0);
            
        }
        if (this.powerXY.length === 2) {
            
            this.power.graphicMask = this.game.add.graphics(0, 0);
            
        }

        this.menuKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        this.game.stage.backgroundColor = '#456';

        this.map = this.game.add.tilemap('level');
        this.map.addTilesetImage('mirror', 'tileBg');
        this.map.addTilesetImage('tile_bg', 'tileBg');
 
        this.map.setCollision(1);
 
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 0, this.mapWidth, this.mapHeight);
 
        this.layer = this.map.createLayer("map_cmn", this.mapWidth, this.mapHeight);
		
        this.candy.original = this.game.add.sprite(this.candyXY[0], this.candyXY[1], 'candy');
        this.game.physics.enable(this.candy.original, Phaser.Physics.ARCADE);

        this.allObjects.push(this.candy);

         this.candy.original.alpha = this.alphaOfObjects;
        
        if (this.kingXY.length === 2) {
            
            this.king.original = this.game.add.sprite(this.kingXY[0], this.kingXY[1], 'king');
            
            this.king.original.alpha = this.alphaOfObjects;
            
            this.game.physics.enable(this.king.original, Phaser.Physics.ARCADE);
            
            this.objectsToCreate.push(this.king);
            
            this.allObjects.push(this.king);
            
        }
        
        if (this.powerXY.length === 2) {
            
            this.power.original = this.game.add.sprite(this.powerXY[0], this.powerXY[1], 'power');
            
            this.power.original.alpha = this.alphaOfObjects;
            
            this.game.physics.enable(this.power.original, Phaser.Physics.ARCADE);
            
            this.objectsToCreate.push(this.power);
            
            this.laserBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
            
            this.laserBitmap.context.strokeStyle = 'rgb(108, 219, 255)';
            this.laserBitmap.context.lineWidth = 4;
            this.laserBitmap.context.lineJoin = "round";
            this.laserImage = this.game.add.image(0, 0, this.laserBitmap);
            
            this.allObjects.push(this.power);
            
        }
        
        this.avocadoPoolPhaserGroup = this.game.add.group();
        this.avocadoPool = [];


        this.map.forEach(this.calcMirrors, this, 0, 0, level.map.width, level.map.height, 0);
        
        createImages(this.objectsToCreate);
        
        this.soundForAvocado = this.game.add.audio("avocadoLaunched", 0.2);
        this.soundForLaser = this.game.add.audio("laserShot", 0.2);
        this.soundForDestroyed = this.game.add.audio("objectDestroyed", 0.2);
		
    },
 

    calcMirrors: function(tile) {

        if(tile.index === 1) {
            
            this.tilesMirrors.push(tile);
            
        }

    },
    
    useLaser: function() {
        
        if (this.game.time.now - this.lastLaserShotAt >= this.laserShotDelay) {
            
            this.soundForLaser.play();
            
            this.lastLaserShotAt = this.game.time.now;
            
            var playerPoint = new Phaser.Point(player.spritePlayer.original.x + 16, player.spritePlayer.original.y + 16);
            var laser = new Phaser.Line(playerPoint.x, playerPoint.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
            var deltaXLaser = this.maximumDistancePossibleInTheMap * Math.sin(laser.angle);
            var deltaYLaser = this.maximumDistancePossibleInTheMap * Math.cos(laser.angle);
            var endLaser = new Phaser.Point(playerPoint.x + deltaXLaser,playerPoint.y + deltaYLaser);
            laser.end = endLaser;

            var allLaserPoints = [playerPoint];

            var calculReflection = 0;
            var maxReflections = 50;
            
            var intersect;
            
            while (calculReflection < maxReflections) {
                
                intersect = this.checkLaserIntersection(laser, allLaserPoints.length);
                
                if (intersect.closestObject === "mirror") {
                    
                    allLaserPoints.push(intersect.closestIntersection);
                    
                    var coefficientToAvoidDirectIntersection = 0.2;
                    var newAngleOfReflection;
                    
                    if (intersect.mirrorOrientation === 0) { // top

                        newAngleOfReflection = Math.PI - laser.angle;
                        intersect.closestIntersection.y -= coefficientToAvoidDirectIntersection;

                    } else if (intersect.mirrorOrientation === 3) { // bottom

                        newAngleOfReflection = Math.PI - laser.angle;
                        intersect.closestIntersection.y += coefficientToAvoidDirectIntersection;

                    } else if (intersect.mirrorOrientation === 1) { // left

                        newAngleOfReflection = - laser.angle;
                        intersect.closestIntersection.x -= coefficientToAvoidDirectIntersection;

                    } else if (intersect.mirrorOrientation === 2) { // right

                        newAngleOfReflection = - laser.angle;
                        intersect.closestIntersection.x += coefficientToAvoidDirectIntersection;

                    }

                    laser.start = intersect.closestIntersection;
                    deltaXLaser = this.maximumDistancePossibleInTheMap * Math.sin(newAngleOfReflection);
                    deltaYLaser = this.maximumDistancePossibleInTheMap * Math.cos(newAngleOfReflection);
                    endLaser.set(laser.start.x + deltaXLaser, laser.start.y + deltaYLaser);
                    laser.end = endLaser;

                    calculReflection++;
                        
                } else if (intersect.closestObject.key === "candy") {
                    
                    this.soundForDestroyed.play();
                    
                    allLaserPoints.push(intersect.closestIntersection);
                    calculReflection = maxReflections;
                    
                    this.candy.original.kill();
		
                    this.candy.right0.kill();
                    this.candy.left0.kill();
                    this.candy.top0.kill();
                    this.candy.bottom0.kill();

                    this.candy.right1.kill();
                    this.candy.left1.kill();
                    this.candy.top1.kill();
                    this.candy.bottom1.kill();

                    for (var i = 0; i < this.allObjects.length; i++) {
        
                        if (this.allObjects[i].original === this.candy.original) {
                            this.allObjects.splice(i, 1);
                        }

                    }

                    this.failed = "destroyedCandy";
                    
                        
                } else if (intersect.closestObject.key === "king") {
                    
                    this.soundForDestroyed.play();
                    
                    allLaserPoints.push(intersect.closestIntersection);
                    calculReflection = maxReflections;
                    player.killKing(null, intersect.closestObject);
                        
                } else if (intersect.closestObject === player.spritePlayer.original) {
                    
                    this.soundForDestroyed.play();
                    
                    allLaserPoints.push(intersect.closestIntersection);
                    calculReflection = maxReflections;
                    
                    player.spritePlayer.original.kill();
        
                    player.spritePlayer.right0.kill();
                    player.spritePlayer.right1.kill();
                    player.spritePlayer.left0.kill();
                    player.spritePlayer.left1.kill();
                    player.spritePlayer.top0.kill();
                    player.spritePlayer.top1.kill();
                    player.spritePlayer.bottom0.kill();
                    player.spritePlayer.bottom1.kill();
                    
                    this.failed = "killedYourself";
                        
                } else if (intersect.closestObject === "worldBound") {
                        
                    allLaserPoints.push(intersect.closestIntersection);
                    calculReflection = maxReflections;                  
                        
                } else if (intersect.closestObject.key === "avocado") {
                    
                    this.soundForDestroyed.play();
                    
                    hud.levelSentence.text = "Avocado destroyed !";
                    
                    allLaserPoints.push(intersect.closestIntersection);
                    calculReflection = maxReflections;
                    intersect.closestObject.kill();
                    
                } else {
                    
                    calculReflection++;
                    
                }
                
            }
            
            if (intersect.closestIntersection) {
                
                this.laserVisible = true;
                this.laserImage.alpha = 1;
                
                this.laserBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
                
                this.laserBitmap.context.beginPath();
                this.laserBitmap.context.moveTo(allLaserPoints[0].x, allLaserPoints[0].y);

                for (var i = 1; i < allLaserPoints.length; i++) {

                    this.laserBitmap.context.lineTo(allLaserPoints[i].x, allLaserPoints[i].y);

                }

                this.laserBitmap.context.stroke();
                this.laserBitmap.dirty = true;
                
            }
        }
            
    },
    
    checkLaserIntersection: function(laser, numberOfLaserPoints) {
        
        var distanceToObject = Number.POSITIVE_INFINITY;
        var closestIntersection = null;
        var closestObject;
        var mirrorOrientation;

        this.tilesMirrors.forEach(function(mirror) {
            
            var lines = [
                            new Phaser.Line(mirror.worldX, mirror.worldY, mirror.worldX + mirror.width, mirror.worldY), // top
                            new Phaser.Line(mirror.worldX, mirror.worldY, mirror.worldX, mirror.worldY + mirror.height), // left
                            new Phaser.Line(mirror.worldX + mirror.width, mirror.worldY, mirror.worldX + mirror.width, mirror.worldY + mirror.height), // right
                            new Phaser.Line(mirror.worldX, mirror.worldY + mirror.height, mirror.worldX + mirror.width, mirror.worldY + mirror.height) // bottom
            ];
            
            for(var i = 0; i < lines.length; i++) {
                
                var intersect = Phaser.Line.intersects(laser, lines[i]);
                
                if (intersect) {

                    var distance = this.game.math.distance(laser.start.x, laser.start.y, intersect.x, intersect.y);
                    
                    if (distance < distanceToObject) {
                        distanceToObject = distance;
                        closestIntersection = intersect;
                        closestObject = "mirror";
                        mirrorOrientation = i;
                    }
                }
                
             }
            
        }, this);
        
        this.avocadoPoolPhaserGroup.forEachAlive(function(avocado) {
            
            var lines = [
                            new Phaser.Line(avocado.x, avocado.y, avocado.x + avocado.width, avocado.y), // top
                            new Phaser.Line(avocado.x, avocado.y, avocado.x, avocado.y + avocado.height), // left
                            new Phaser.Line(avocado.x + avocado.width, avocado.x, avocado.x + avocado.width, avocado.y + avocado.height), // right
                            new Phaser.Line(avocado.x, avocado.y + avocado.height, avocado.x + avocado.width, avocado.y + avocado.height) // bottom
            ];
            
            for(var i = 0; i < lines.length; i++) {
                
                var intersect = Phaser.Line.intersects(laser, lines[i]);
                
                if (intersect) {

                    var distance = this.game.math.distance(laser.start.x, laser.start.y, intersect.x, intersect.y);
                    
                    if (distance < distanceToObject) {
                        distanceToObject = distance;
                        closestIntersection = intersect;
                        closestObject = avocado;
                        mirrorOrientation = i;
                    }
                }
                
             }
            
        }, this);
        
        this.allObjects.forEach(function(levelObject) {
            
            levelObject = levelObject.original;
            
            if (levelObject === player.spritePlayer.original && numberOfLaserPoints === 1) { 
                return;
            }
            
            var lines = [
                            new Phaser.Line(levelObject.x, levelObject.y, levelObject.x + levelObject.width, levelObject.y),
                            new Phaser.Line(levelObject.x, levelObject.y, levelObject.x, levelObject.y + levelObject.height),
                            new Phaser.Line(levelObject.x + levelObject.width, levelObject.y, levelObject.x + levelObject.width, levelObject.y + levelObject.height),
                            new Phaser.Line(levelObject.x, levelObject.y + levelObject.height, levelObject.x + levelObject.width, levelObject.y + levelObject.height)
            ];
            
            for(var i = 0; i < lines.length; i++) {
                
                var intersect = Phaser.Line.intersects(laser, lines[i]);
                
                if (intersect) {

                    var distance = this.game.math.distance(laser.start.x, laser.start.y, intersect.x, intersect.y);
                    
                    if (distance < distanceToObject) {
                        distanceToObject = distance;
                        closestIntersection = intersect;
                        closestObject = levelObject;
                    }
                }
                
             }
            
        }, this);
           
        var worldBorderLines = [
                        new Phaser.Line(this.game.physics.arcade.bounds.x, this.game.physics.arcade.bounds.y, this.game.physics.arcade.bounds.width, this.game.physics.arcade.bounds.y),
                        new Phaser.Line(this.game.physics.arcade.bounds.x, this.game.physics.arcade.bounds.y, this.game.physics.arcade.bounds.x, this.game.physics.arcade.bounds.height),
                        new Phaser.Line(this.game.physics.arcade.bounds.width, this.game.physics.arcade.bounds.y, this.game.physics.arcade.bounds.width, this.game.physics.arcade.bounds.height),
                        new Phaser.Line(this.game.physics.arcade.bounds.x, this.game.physics.arcade.bounds.height, this.game.physics.arcade.bounds.width, this.game.physics.arcade.bounds.height)
        ];
        
        for(var i = 0; i < worldBorderLines.length; i++) {

            var intersect = Phaser.Line.intersects(laser, worldBorderLines[i]);

            if (intersect) {

                var distance = this.game.math.distance(laser.start.x, laser.start.y, intersect.x, intersect.y);

                if (distance < distanceToObject) {
                    distanceToObject = distance;
                    closestIntersection = intersect;
                    closestObject = "worldBound";
                }
            }

         }

         return {
                    closestIntersection : closestIntersection,
                    closestObject : closestObject, 
                    mirrorOrientation : mirrorOrientation
         };
         
            
        
    },
    
    update: function() {
        
        if (this.laserVisible) {
            
            this.laserImage.alpha -= 0.01;

            if (this.laserImage.alpha <= 0) {
                
                this.laserBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
                this.laserVisible = false;
                
                if(typeof hud.chosenLanguage["level" + hud.level] !== "undefined") {
                    
                    hud.levelSentence.text = hud.chosenLanguage["level" + hud.level];
                    
                }
                
            }
            
        }
        
        if (player.hasPower && this.game.input.activePointer.isDown && this.game.input.activePointer.x >= 0 && this.game.input.activePointer.y >= 0 && this.game.input.activePointer.x <= this.mapWidth && this.game.input.activePointer.y <= this.mapHeight) {
            
            this.useLaser();
            
        }
        
        if (this.kingXY.length === 2) {
            
            // LAUNCH AVOCADOS

            var distanceBetweenPlayerAndCandy = this.game.physics.arcade.distanceBetween(this.candy.original, player.spritePlayer.original);
            var distanceRatio = Math.ceil((distanceBetweenPlayerAndCandy / this.maximumDistancePossibleInTheMap) * 10) / 10;
            var shotDelay = this.baseShotDelay * distanceRatio;

            if ( (this.game.time.now - this.lastShotAt) >= shotDelay && this.king.original.alive === true) {

                this.soundForAvocado.play();

                this.lastShotAt = this.game.time.now;

                for (var i = 0; i < 4; i++) {

                    if (this.avocadoPool[0] && this.avocadoPool[0].original.alive === false) {

                        var avocado = this.avocadoPool[0];

                        avocado.original.reset(this.king.original.x, this.king.original.y);
                        avocado.original.frame = i;
                        avocado.right0.frame    = avocado.right1.frame
                                                = avocado.left0.frame 
                                                = avocado.left1.frame
                                                = avocado.top0.frame
                                                = avocado.top1.frame
                                                = avocado.bottom0.frame
                                                = avocado.bottom1.frame
                                                = i;
                        var avocadoToPutAtTheEnd = this.avocadoPool.shift();
                        this.avocadoPool.push(avocadoToPutAtTheEnd);

                    }
                    else {
                        
                            var avocado =   {
                                                original : null,
                                                right0 : null,
                                                left0 : null,
                                                top0 : null,
                                                bottom0 : null,
                                                right1 : null,
                                                left1 : null,
                                                top1 : null,
                                                bottom1 : null,
                                                graphicMask : null
                                            };

                            avocado.graphicMask = this.game.add.graphics(0, 0);
                            avocado.original = this.game.add.sprite(this.king.original.x, this.king.original.y, 'avocado', i);
                            this.avocadoPool.push(avocado);
                            this.avocadoPoolPhaserGroup.add(avocado.original);
                            avocado.original.alpha = this.alphaOfObjects;

                            this.game.physics.enable(avocado.original, Phaser.Physics.ARCADE);
                            avocado.original.body.collideWorldBounds = true;

                            createImages([avocado]);

                    }	

                    switch (i) {

                            case 0:

                                    avocado.original.body.velocity.x = 0;
                                    avocado.original.body.velocity.y = - this.avocadoSpeed;
                                    break;

                            case 1:

                                    avocado.original.body.velocity.x = this.avocadoSpeed;
                                    avocado.original.body.velocity.y = 0;
                                    break;

                            case 2:

                                    avocado.original.body.velocity.x = 0;
                                    avocado.original.body.velocity.y = this.avocadoSpeed;
                                    break;

                            case 3:

                                    avocado.original.body.velocity.x = - this.avocadoSpeed;
                                    avocado.original.body.velocity.y = 0;
                                    break;

                    }

                }

            }

            // MANAGE AVOCADOS

            this.game.physics.arcade.collide(this.avocadoPoolPhaserGroup, this.layer, this.destroyAvocado);
            this.avocadoPool.forEach(this.destroyAvocadoIfOnWorldBounds);

        }
        
    },
    
    updateImages: function() {
        
        if (this.kingXY.length === 2) {
        
            for (var i = 0; i < this.avocadoPool.length; i++) {
            
                if (this.avocadoPool[i].original.alive === true) {

                    // POSITION

                    this.nearests = checkMirrorOnXY(this.avocadoPool[i].original.x, this.avocadoPool[i].original.y);
                    var maskMirrors = createMaskMirrors(this.avocadoPool[i].original, this.nearests, this.avocadoPool[i].graphicMask);

                    this.avocadoPool[i].right0.x = this.nearests.right[0]*32;
                    this.avocadoPool[i].right1.x = this.nearests.right[1]*32;

                    this.avocadoPool[i].left0.x = this.nearests.left[0]*32;
                    this.avocadoPool[i].left1.x = this.nearests.left[1]*32;		

                    this.avocadoPool[i].right0.y = this.avocadoPool[i].right1.y = this.avocadoPool[i].left0.y = this.avocadoPool[i].left1.y = this.avocadoPool[i].original.y;

                    this.avocadoPool[i].top0.y = this.nearests.top[0]*32;
                    this.avocadoPool[i].top1.y = this.nearests.top[1]*32;

                    this.avocadoPool[i].bottom0.y = this.nearests.bottom[0]*32;
                    this.avocadoPool[i].bottom1.y = this.nearests.bottom[1]*32;

                    this.avocadoPool[i].top0.x = this.avocadoPool[i].top1.x = this.avocadoPool[i].bottom0.x = this.avocadoPool[i].bottom1.x = this.avocadoPool[i].original.x;

                    // DELETE OUT OF BOUNDS IMAGES

                    this.avocadoPool[i].right0.revive();
                    this.avocadoPool[i].right1.revive();
                    this.avocadoPool[i].left0.revive();
                    this.avocadoPool[i].left1.revive();
                    this.avocadoPool[i].top0.revive();
                    this.avocadoPool[i].top1.revive();
                    this.avocadoPool[i].bottom0.revive();
                    this.avocadoPool[i].bottom1.revive();

                    if (this.nearests.right[0] >= level.map.width && this.avocadoPool[i].right0.alive) {
                            this.avocadoPool[i].right0.kill();
                    }
                    if (this.nearests.right[1] >= level.map.width && this.avocadoPool[i].right1.alive) {
                            this.avocadoPool[i].right1.kill();
                    }
                    if (this.nearests.left[0] <= -1 && this.avocadoPool[i].left0.alive) {
                            this.avocadoPool[i].left0.kill();
                    }
                    if (this.nearests.left[1] <= -1 && this.avocadoPool[i].left1.alive) {
                            this.avocadoPool[i].left1.kill();
                    }
                    if (this.nearests.top[0] <= -1 && this.avocadoPool[i].top0.alive) {
                            this.avocadoPool[i].top0.kill();
                    }
                    if (this.nearests.top[1] <= -1 && this.avocadoPool[i].top1.alive) {
                            this.avocadoPool[i].top1.kill();
                    }
                    if (this.nearests.bottom[0] >= level.map.height && this.avocadoPool[i].bottom0.alive) {
                            this.avocadoPool[i].bottom0.kill();
                    }
                    if (this.nearests.bottom[1] >= level.map.height && this.avocadoPool[i].bottom1.alive) {
                            this.avocadoPool[i].bottom1.kill();
                    }

                } else if (this.avocadoPool[i].original.alive === false) {
            
                    this.avocadoPool[i].right0.kill();
                    this.avocadoPool[i].right1.kill();
                    this.avocadoPool[i].left0.kill();
                    this.avocadoPool[i].left1.kill();
                    this.avocadoPool[i].top0.kill();
                    this.avocadoPool[i].top1.kill();
                    this.avocadoPool[i].bottom0.kill();
                    this.avocadoPool[i].bottom1.kill();
            
                }
                
            }
    
        }
        
    },
	
    destroyAvocado: function(avocadoToDestroy, layer) {

        avocadoToDestroy.kill();

    },
	
    destroyAvocadoIfOnWorldBounds: function(avocadoToCheck) {
	
        if (avocadoToCheck.original.alive === true && avocadoToCheck.original.body.velocity.x === 0 && avocadoToCheck.original.body.velocity.y === 0) {

            avocadoToCheck.original.kill();

        }
    
    },
	
    checkEnd: function() {
	
        if (this.end) {

            if (hud.level < CMN.levels.length) {
                
                    this.changeState(CMN.levels[hud.level], "finishedLevel");
                    
            } else {
                
                    this.changeState("menu", "finishedGame");
                    
            }
            
        }

        if (this.failed) {
            
            this.changeState(CMN.levels[hud.level - 1], this.failed);
            
        }

        if (this.menuKey.isDown) {

                this.game.state.start("menu");

        }

    },
	
    changeState: function(state, cause) {
        
        hud.levelSentence.text = hud.chosenLanguage[cause];
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startState, this, state);
	
    },
    
    startState: function (state) {
        
        this.game.state.start(state);
        
    }
 
};


	// PLAYER

var Player = function(game, playerXY) {
 
    this.game = game;
    this.cursors = null;

    this.spritePlayer =	{
                            original : null,
                            right0 : null,
                            left0 : null,
                            top0 : null,
                            bottom0 : null,
                            right1 : null,
                            left1 : null,
                            top1 : null,
                            bottom1 : null,
                            graphicMask : null
                        };

    this.playerXY = playerXY;

    this.speed = 150;

    this.hasPower = false;

    this.nearests = null;
    
    this.soundForCandy;
    this.soundForPower;
	
};
 
Player.prototype = {
 
    preload: function () {
	
//        this.game.load.spritesheet('ninja', 'cmn_ninja1.png', 32, 32);
//        this.game.load.spritesheet('ninjaPower', 'cmn_ninja_power1.png', 32, 32);
		
    },
 
    create: function () {
	
        this.spritePlayer.original = this.game.add.sprite(this.playerXY[0], this.playerXY[1], 'ninja');
 
        this.spritePlayer.graphicMask = this.game.add.graphics(0, 0);

        this.game.physics.enable(this.spritePlayer.original, Phaser.Physics.ARCADE);
        this.spritePlayer.original.body.collideWorldBounds = true;
		
        this.spritePlayer.original.animations.add('bottom', [0, 1, 2, 3], 10);
        this.spritePlayer.original.animations.add('top', [4, 5, 6, 7], 10);
        this.spritePlayer.original.animations.add('right', [8, 9, 10, 11], 10);
        this.spritePlayer.original.animations.add('left', [12, 13, 14, 15], 10);
 
        this.cursors = this.game.input.keyboard.createCursorKeys();
		
         this.spritePlayer.original.alpha = level.alphaOfObjects;

        createImages([this.spritePlayer]);
        
        level.allObjects.push(this.spritePlayer);
        
        this.soundForCandy = this.game.add.audio("collectCandy", 0.2);
        this.soundForPower = this.game.add.audio("collectPower", 0.2);
        
    },
 
    collectCandy: function(player, candy) {
	
        this.soundForCandy.play();
        
        candy.kill();
		
        level.candy.right0.kill();
        level.candy.left0.kill();
        level.candy.top0.kill();
        level.candy.bottom0.kill();

        level.candy.right1.kill();
        level.candy.left1.kill();
        level.candy.top1.kill();
        level.candy.bottom1.kill();

        for (var i = 0; i < level.allObjects.length; i++) {
        
            if (level.allObjects[i].original === candy) {
                level.allObjects.splice(i, 1);
            }
        
        }

        level.end = true;
 
    },

    collectPower: function(player, power) {
        
        this.soundForPower.play();
        
        power.kill();
		
        level.power.right0.kill();
        level.power.left0.kill();
        level.power.top0.kill();
        level.power.bottom0.kill();

        level.power.right1.kill();
        level.power.left1.kill();
        level.power.top1.kill();
        level.power.bottom1.kill();
        
        for (var i = 0; i < level.allObjects.length; i++) {
        
            if (level.allObjects[i].original === power) {
                
                level.allObjects.splice(i, 1);
                
            }
        
        }
        
        this.hasPower = true;
        
        this.spritePlayer.original.loadTexture("ninjaPower");
        this.spritePlayer.right0.loadTexture("ninjaPower");
        this.spritePlayer.left0.loadTexture("ninjaPower");
        this.spritePlayer.top0.loadTexture("ninjaPower");
        this.spritePlayer.bottom0.loadTexture("ninjaPower");
        this.spritePlayer.right1.loadTexture("ninjaPower");
        this.spritePlayer.left1.loadTexture("ninjaPower");
        this.spritePlayer.top1.loadTexture("ninjaPower");
        this.spritePlayer.bottom1.loadTexture("ninjaPower");
        
        this.spritePlayer.original.animations.add('bottom', [0, 1, 2, 3], 10);
        this.spritePlayer.original.animations.add('top', [4, 5, 6, 7], 10);
        this.spritePlayer.original.animations.add('right', [8, 9, 10, 11], 10);
        this.spritePlayer.original.animations.add('left', [12, 13, 14, 15], 10);
        
    },

    killKing: function(player, king) {
        
        king.kill();
		
        level.king.right0.kill();
        level.king.left0.kill();
        level.king.top0.kill();
        level.king.bottom0.kill();

        level.king.right1.kill();
        level.king.left1.kill();
        level.king.top1.kill();
        level.king.bottom1.kill();
        
        for (var i = 0; i < level.allObjects.length; i++) {
        
            if (level.allObjects[i].original === king) {
                
                level.allObjects.splice(i, 1);
                
            }
        
        }
        
    },
    
    killPlayer: function(playerOriginal, avocado) {
        
        level.soundForDestroyed.play();
        
        level.failed = "hitAvocado";
        
        playerOriginal.kill();
        
        this.spritePlayer.right0.kill();
        this.spritePlayer.right1.kill();
        this.spritePlayer.left0.kill();
        this.spritePlayer.left1.kill();
        this.spritePlayer.top0.kill();
        this.spritePlayer.top1.kill();
        this.spritePlayer.bottom0.kill();
        this.spritePlayer.bottom1.kill();
        
        for (var i = 0; i < level.allObjects.length; i++) {
        
            if (level.allObjects[i].original === playerOriginal) {
                
                level.allObjects.splice(i, 1);
                
            }
        
        }
        
    },

    update: function() {
 
        this.game.physics.arcade.collide(this.spritePlayer.original, level.layer);
 
        this.game.physics.arcade.overlap(this.spritePlayer.original, level.candy.original, this.collectCandy, null, this);
 
        if (level.kingXY.length === 2) {
            
            this.game.physics.arcade.overlap(this.spritePlayer.original, level.king.original, this.killKing, null, this);
            this.game.physics.arcade.overlap(this.spritePlayer.original, level.avocadoPoolPhaserGroup, this.killPlayer, null, this);
            
        }
 
        if (level.powerXY.length === 2) {
            
            this.game.physics.arcade.overlap(this.spritePlayer.original, level.power.original, this.collectPower, null, this);
            
        }
 
        this.spritePlayer.original.body.velocity.x = 0;
        this.spritePlayer.original.body.velocity.y = 0;
 
        if(this.cursors.left.isDown)
        {
            
            this.spritePlayer.original.body.velocity.x = -this.speed;
 
            this.spritePlayer.original.animations.play('left');
            
        }
        else if(this.cursors.right.isDown)
        {
            
            this.spritePlayer.original.body.velocity.x = this.speed;
 
            this.spritePlayer.original.animations.play('right');
            
        }
	else if(this.cursors.up.isDown)
        {
            
            this.spritePlayer.original.body.velocity.y = -this.speed;
 
            this.spritePlayer.original.animations.play('top');
            
        }
	else if(this.cursors.down.isDown)
        {
            
            this.spritePlayer.original.body.velocity.y = this.speed;
 
            this.spritePlayer.original.animations.play('bottom');
            
        }
        else
        {
            
            this.spritePlayer.original.animations.stop();
            
            this.spritePlayer.original.frame = 0;
            
        }
    },
	
    updateImages: function() {

        // POSITION

        this.nearests = checkMirrorOnXY(this.spritePlayer.original.x, this.spritePlayer.original.y);
        var maskMirrors = createMaskMirrors(this.spritePlayer.original, this.nearests, this.spritePlayer.graphicMask);

        this.spritePlayer.right0.x = this.nearests.right[0]*32;
        this.spritePlayer.right1.x = this.nearests.right[1]*32;

        this.spritePlayer.left0.x = this.nearests.left[0]*32;
        this.spritePlayer.left1.x = this.nearests.left[1]*32;		

        this.spritePlayer.right0.y = this.spritePlayer.right1.y = this.spritePlayer.left0.y = this.spritePlayer.left1.y = this.spritePlayer.original.y;

        this.spritePlayer.top0.y = this.nearests.top[0]*32;
        this.spritePlayer.top1.y = this.nearests.top[1]*32;

        this.spritePlayer.bottom0.y = this.nearests.bottom[0]*32;
        this.spritePlayer.bottom1.y = this.nearests.bottom[1]*32;

        this.spritePlayer.top0.x = this.spritePlayer.top1.x = this.spritePlayer.bottom0.x = this.spritePlayer.bottom1.x = this.spritePlayer.original.x;

        // DELETE OUT OF BOUNDS IMAGES
        if (this.spritePlayer.original.alive) {
            this.spritePlayer.right0.revive();
            this.spritePlayer.right1.revive();
            this.spritePlayer.left0.revive();
            this.spritePlayer.left1.revive();
            this.spritePlayer.top0.revive();
            this.spritePlayer.top1.revive();
            this.spritePlayer.bottom0.revive();
            this.spritePlayer.bottom1.revive();
        }

        if (this.nearests.right[0] >= level.map.width && this.spritePlayer.right0.alive) {
                this.spritePlayer.right0.kill();
        }
        if (this.nearests.right[1] >= level.map.width && this.spritePlayer.right1.alive) {
                this.spritePlayer.right1.kill();
        }
        if (this.nearests.left[0] <= -1 && this.spritePlayer.left0.alive) {
                this.spritePlayer.left0.kill();
        }
        if (this.nearests.left[1] <= -1 && this.spritePlayer.left1.alive) {
                this.spritePlayer.left1.kill();
        }
        if (this.nearests.top[0] <= -1 && this.spritePlayer.top0.alive) {
                this.spritePlayer.top0.kill();
        }
        if (this.nearests.top[1] <= -1 && this.spritePlayer.top1.alive) {
                this.spritePlayer.top1.kill();
        }
        if (this.nearests.bottom[0] >= level.map.height && this.spritePlayer.bottom0.alive) {
                this.spritePlayer.bottom0.kill();
        }
        if (this.nearests.bottom[1] >= level.map.height && this.spritePlayer.bottom1.alive) {
                this.spritePlayer.bottom1.kill();
        }

        // ANIMATE

        this.spritePlayer.right0.frame	= this.spritePlayer.right1.frame 
                                        = this.spritePlayer.left0.frame 
                                        = this.spritePlayer.left1.frame
                                        = this.spritePlayer.top0.frame
                                        = this.spritePlayer.top1.frame
                                        = this.spritePlayer.bottom0.frame
                                        = this.spritePlayer.bottom1.frame
                                        = this.spritePlayer.original.animations.currentFrame.index;

        // MAKE REVERSE IMAGES FOR IN FRONT MIRRORS

//        if (this.spritePlayer.original.animations.currentFrame.index < 4) {
//
//                this.spritePlayer.bottom0.frame
//                = this.spritePlayer.bottom1.frame
//                = this.spritePlayer.original.animations.currentFrame.index + 4;
//
//        } else if (this.spritePlayer.original.animations.currentFrame.index > 3 && this.spritePlayer.original.animations.currentFrame.index < 8) {
//
//                this.spritePlayer.top0.frame
//                = this.spritePlayer.top1.frame
//                = this.spritePlayer.original.animations.currentFrame.index - 4;
//
//        } else if (this.spritePlayer.original.animations.currentFrame.index >7 && this.spritePlayer.original.animations.currentFrame.index < 12) {
//
//                this.spritePlayer.right0.frame
//                = this.spritePlayer.right1.frame
//                = this.spritePlayer.original.animations.currentFrame.index + 4;
//
//        } else if (this.spritePlayer.original.animations.currentFrame.index > 11 && this.spritePlayer.original.animations.currentFrame.index < 16) {
//
//                this.spritePlayer.left0.frame
//                = this.spritePlayer.left1.frame
//                = this.spritePlayer.original.animations.currentFrame.index - 4;
//
//        }

        // MAKE Z-INDEX FOR MIRROR IMAGES
        
        for (var i = 0; i < level.allObjects.length; i++) {

            if (this.spritePlayer.original.x >= level.allObjects[i].original.x && level.allObjects[i] !== this.spritePlayer) {

                if (this.game.world.getIndex(this.spritePlayer.right0) < this.game.world.getIndex(level.allObjects[i].right0)) {
                    
                    this.game.world.swap(this.spritePlayer.right0, level.allObjects[i].right0);
                         
                }

                if (this.game.world.getIndex(this.spritePlayer.right1) < this.game.world.getIndex(level.allObjects[i].right1)) {
                    
                    this.game.world.swap(this.spritePlayer.right1, level.allObjects[i].right1);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.left0) > this.game.world.getIndex(level.allObjects[i].left0)) {
                    
                    this.game.world.swap(this.spritePlayer.left0, level.allObjects[i].left0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.left1) > this.game.world.getIndex(level.allObjects[i].left1)) {
                    
                    this.game.world.swap(this.spritePlayer.left1, level.allObjects[i].left1);
                    
                }
                
            } else if (this.spritePlayer.original.x < level.allObjects[i].original.x && level.allObjects[i] !== this.spritePlayer){

                if (this.game.world.getIndex(this.spritePlayer.right0) > this.game.world.getIndex(level.allObjects[i].right0)) {

                    this.game.world.swap(this.spritePlayer.right0, level.allObjects[i].right0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.right1) > this.game.world.getIndex(level.allObjects[i].right1)) {
                    
                    this.game.world.swap(this.spritePlayer.right1, level.allObjects[i].right1);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.left0) < this.game.world.getIndex(level.allObjects[i].left0)) {
                    
                    this.game.world.swap(this.spritePlayer.left0, level.allObjects[i].left0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.left1) < this.game.world.getIndex(level.allObjects[i].left1)) {
                    
                    this.game.world.swap(this.spritePlayer.left1, level.allObjects[i].left1);
                    
                }

            }

            if (this.spritePlayer.original.y >= level.allObjects[i].original.y && level.allObjects[i] !== this.spritePlayer) {

                if (this.game.world.getIndex(this.spritePlayer.bottom0) < this.game.world.getIndex(level.allObjects[i].bottom0)) {
                    
                    this.game.world.swap(this.spritePlayer.bottom0, level.allObjects[i].bottom0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.bottom1) < this.game.world.getIndex(level.allObjects[i].bottom1)) {
                    
                    this.game.world.swap(this.spritePlayer.bottom1, level.allObjects[i].bottom1);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.top0) > this.game.world.getIndex(level.allObjects[i].top0)) {
                    
                    this.game.world.swap(this.spritePlayer.top0, level.allObjects[i].top0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.top1) > this.game.world.getIndex(level.allObjects[i].top1)) {
                    
                    this.game.world.swap(this.spritePlayer.top1, level.allObjects[i].top1);
                    
                }
                
            } else if (this.spritePlayer.original.y < level.allObjects[i].original.y && level.allObjects[i] !== this.spritePlayer){

                if (this.game.world.getIndex(this.spritePlayer.bottom0) > this.game.world.getIndex(level.allObjects[i].bottom0)) {
                    
                    this.game.world.swap(this.spritePlayer.bottom0, level.allObjects[i].bottom0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.bottom1) > this.game.world.getIndex(level.allObjects[i].bottom1)) {
                    
                    this.game.world.swap(this.spritePlayer.bottom1, level.allObjects[i].bottom1);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.top0) < this.game.world.getIndex(level.allObjects[i].top0)) {
                    
                    this.game.world.swap(this.spritePlayer.top0, level.allObjects[i].top0);
                    
                }

                if (this.game.world.getIndex(this.spritePlayer.top1) < this.game.world.getIndex(level.allObjects[i].top1)) {
                    
                    this.game.world.swap(this.spritePlayer.top1, level.allObjects[i].top1);
                    
                }
                
            }

        }

    }
	
};


	// CREATE IMAGES
	
var createImages = function(objectsToCreate) {
	
    for (var i = 0; i < objectsToCreate.length; i++) {
	
        var nearests = checkMirrorOnXY(objectsToCreate[i].original.x, objectsToCreate[i].original.y);
        var maskMirrors = createMaskMirrors(objectsToCreate[i].original, nearests, objectsToCreate[i].graphicMask);

        objectsToCreate[i].right0 = game.add.sprite(nearests.right[0]*32, objectsToCreate[i].original.y, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);
        objectsToCreate[i].right1 = game.add.sprite(nearests.right[1]*32, objectsToCreate[i].original.y, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);

        objectsToCreate[i].left0 = game.add.sprite(nearests.left[0]*32, objectsToCreate[i].original.y, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);
        objectsToCreate[i].left1 = game.add.sprite(nearests.left[1]*32, objectsToCreate[i].original.y, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);

        objectsToCreate[i].top0 = game.add.sprite(objectsToCreate[i].original.x, nearests.top[0]*32, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);
        objectsToCreate[i].top1 = game.add.sprite(objectsToCreate[i].original.x, nearests.top[1]*32, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);

        objectsToCreate[i].bottom0 = game.add.sprite(objectsToCreate[i].original.x, nearests.bottom[0]*32, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);
        objectsToCreate[i].bottom1 = game.add.sprite(objectsToCreate[i].original.x, nearests.bottom[1]*32, objectsToCreate[i].original.key, objectsToCreate[i].original.frame);

        objectsToCreate[i].right0.mask =	
        objectsToCreate[i].right1.mask =
        objectsToCreate[i].left0.mask =
        objectsToCreate[i].left1.mask =
        objectsToCreate[i].top0.mask =
        objectsToCreate[i].top1.mask =
        objectsToCreate[i].bottom0.mask =
        objectsToCreate[i].bottom1.mask =
        maskMirrors;

        if (nearests.right[0] >= level.map.width) {
                objectsToCreate[i].right0.kill();
        }
        if (nearests.right[1] >= level.map.width) {
                objectsToCreate[i].right1.kill();
        }
        if (nearests.left[0] <= -1) {
                objectsToCreate[i].left0.kill();
        }
        if (nearests.left[1] <= -1) {
                objectsToCreate[i].left1.kill();
        }
        if (nearests.top[0] <= -1) {
                objectsToCreate[i].top0.kill();
        }
        if (nearests.top[1] <= -1) {
                objectsToCreate[i].top1.kill();
        }
        if (nearests.bottom[0] >= level.map.height) {
                objectsToCreate[i].bottom0.kill();
        }
        if (nearests.bottom[1] >= level.map.height) {
                objectsToCreate[i].bottom1.kill();
        }
        
    }

};


	// CREATE MASK MIRRORS
	
var createMaskMirrors = function(object, nearests, maskMirrors) {
	
    var xTileObject = Math.floor(object.x/32);
    var yTileObject = Math.floor(object.y/32);

    maskMirrors.clear();
    maskMirrors.beginFill(0x124578, 1);

    maskMirrors.drawRect(xTileObject*32, nearests.top[0]*32, 32, 32);
    maskMirrors.drawRect((xTileObject+1)*32, nearests.top[1]*32, 32, 32);

    maskMirrors.drawRect(xTileObject*32, nearests.bottom[0]*32, 32, 32);
    maskMirrors.drawRect((xTileObject+1)*32, nearests.bottom[1]*32, 32, 32);

    maskMirrors.drawRect(nearests.right[0]*32, yTileObject*32, 32, 32);
    maskMirrors.drawRect(nearests.right[1]*32, (yTileObject+1)*32, 32, 32);

    maskMirrors.drawRect(nearests.left[0]*32, yTileObject*32, 32, 32);
    maskMirrors.drawRect(nearests.left[1]*32, (yTileObject+1)*32, 32, 32);

    return maskMirrors;
    
};

	// CHECK NEAREST(S) MIRRORS FOR OBJECTS

var checkMirrorOnXY = function(x, y) {

    var xTile = Math.floor(x/32);
    var yTile = Math.floor(y/32);
    var overlapXOnNextTile = x%32;
    var overlapYOnNextTile = y%32;
    var nearestXRight = [level.map.width, level.map.width];
    var	nearestXLeft = [-1, -1]; 
    var	nearestYTop = [-1, -1];
    var	nearestYBottom = [level.map.height, level.map.height];
	
    for (var i = 0; i < level.tilesMirrors.length; i++) {
        
        // find nearest(s) mirrors on the X axis
        if (level.tilesMirrors[i].x === xTile) {
            
            // find nearest(s) mirrors on the BOTTOM of the player on the X axis
            if (level.tilesMirrors[i].y > yTile && level.tilesMirrors[i].y < nearestYBottom[0]) {
                    nearestYBottom[0] = level.tilesMirrors[i].y;
            } 
            // find nearest(s) mirrors on the TOP of the player on the X axis
            else if (level.tilesMirrors[i].y < yTile && level.tilesMirrors[i].y > nearestYTop[0]) {
                    nearestYTop[0] = level.tilesMirrors[i].y;
            }
            
        }
		
        // find nearest(s) mirrors on the X+1 axis
        if (overlapXOnNextTile !== 0 && level.tilesMirrors[i].x === xTile+1) {
            
            // find nearest(s) mirrors on the BOTTOM of the player on the X+1 axis
            if (level.tilesMirrors[i].y > yTile && level.tilesMirrors[i].y < nearestYBottom[1]) {
                    nearestYBottom[1] = level.tilesMirrors[i].y;
            } 
            // find nearest(s) mirrors on the TOP of the player on the X+1 axis
            else if (level.tilesMirrors[i].y < yTile && level.tilesMirrors[i].y > nearestYTop[1]) {
                    nearestYTop[1] = level.tilesMirrors[i].y;
            }
                
        }
		
		
        // find nearest(s) mirrors on the Y axis
        if (level.tilesMirrors[i].y === yTile) {
            
            // find nearest(s) mirrors on the RIGHT of the player on the Y axis
            if (level.tilesMirrors[i].x > xTile && level.tilesMirrors[i].x < nearestXRight[0]) {
                    nearestXRight[0] = level.tilesMirrors[i].x;
            }
            // find nearest(s) mirrors on the LEFT of the player on the Y axis
            else if (level.tilesMirrors[i].x < xTile && level.tilesMirrors[i].x > nearestXLeft[0]) {
                    nearestXLeft[0] = level.tilesMirrors[i].x;
            }
            
        }
		
        // find nearest(s) mirrors on the Y+1 axis
        if (overlapYOnNextTile !== 0 && level.tilesMirrors[i].y === yTile+1) {
            
            // find nearest(s) mirrors on the RIGHT of the player on the Y+1 axis
            if (level.tilesMirrors[i].x > xTile && level.tilesMirrors[i].x < nearestXRight[1]) {
                    nearestXRight[1] = level.tilesMirrors[i].x;
            }
            // find nearest(s) mirrors on the LEFT of the player on the Y+1 axis
            else if (level.tilesMirrors[i].x < xTile && level.tilesMirrors[i].x > nearestXLeft[1]) {
                    nearestXLeft[1] = level.tilesMirrors[i].x;
            }
                
        }
        
    }
	
    return {	right 		: nearestXRight,
                left		: nearestXLeft,
                top		: nearestYTop,
                bottom		: nearestYBottom};
				
};