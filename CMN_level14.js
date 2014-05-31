/*
 "Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
 */

CMN.Level14 = function(game) {

	this.levelNumber = 14;
	this.tilemapSource = "CMN_tilemap14.json";
	this.game = game;
	this.candyXY = [3*32, 9*32];
	this.playerXY = [23*32, 1*32];
	this.kingXY = [20*32, 6*32];
        this.powerXY = [];

};

CMN.Level14.prototype = {

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