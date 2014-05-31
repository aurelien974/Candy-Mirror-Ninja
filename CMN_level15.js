/*
 "Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
 */

CMN.Level15 = function(game) {

	this.levelNumber = 15;
	this.tilemapSource = "CMN_tilemap15.json";
	this.game = game;
	this.candyXY = [22*32, 4*32+26];
	this.playerXY = [18*32+16, 10*32+16];
	this.kingXY = [0*32, 0*32];
        this.powerXY = [];

};

CMN.Level15.prototype = {

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