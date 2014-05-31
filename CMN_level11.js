/*
 "Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
 */

CMN.Level11 = function(game) {

	this.levelNumber = 11;
	this.tilemapSource = "CMN_tilemap11.json";
	this.game = game;
	this.candyXY = [19*32, 6*32+16];
	this.playerXY = [13*32, 2*32];
	this.kingXY = [5*32, 6*32+16];
        this.powerXY = [];

};

CMN.Level11.prototype = {

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