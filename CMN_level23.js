/*
 "Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
 */

CMN.Level23 = function(game) {

	this.levelNumber = 23;
	this.tilemapSource = "CMN_tilemap23.json";
	this.game = game;
	this.candyXY = [3*32, 3*32];
	this.playerXY = [11*32, 6*32];
	this.kingXY = [3*32, 6*32];
        this.powerXY = [11*32, 9*32];

};

CMN.Level23.prototype = {

	preload: function() {
	
		level = new Level(game, this.tilemapSource, this.candyXY, this.kingXY, this.powerXY);
		level.preload();
 
		player = new Player(game, this.playerXY);

		hud = new HUD(game, this.levelNumber);
		
	},
	
	create: function() {
	
		level.create();
		hud.create();
		player.create();
		
	},
	
	update: function() {

		level.update();
                level.updateImages();
		hud.update();
		player.update();
		player.updateImages();	
		level.checkEnd();
		
	}

};