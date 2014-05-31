/*
 "Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
 */

CMN.Level12 = function(game) {

	this.levelNumber = 12;
	this.tilemapSource = "CMN_tilemap12.json";
	this.game = game;
	this.candyXY = [0*32, 12*32];
	this.playerXY = [12*32, 6*32];
	this.kingXY = [2*32, 2*32];
        this.powerXY = [];

};

CMN.Level12.prototype = {

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