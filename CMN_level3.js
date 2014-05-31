/*
	"Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
	"Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
*/

CMN.Level3 = function(game) {

	this.levelNumber = 3;
	this.tilemapSource = "CMN_tilemap3.json";
	this.game = game;
	this.candyXY = [19*32, 12*32];
	this.playerXY = [6*32, 8*32];
	this.kingXY = [];
        this.powerXY = [];

};

CMN.Level3.prototype = {

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