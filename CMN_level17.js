/*
 "Candy Mirror Ninja" est un jeu cr�� en mai 2014 par Aur�lien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aur�lien Picolet.
 */

CMN.Level17 = function(game) {

	this.levelNumber = 17;
	this.tilemapSource = "CMN_tilemap17.json";
	this.game = game;
	this.candyXY = [23*32, 11*32];
	this.playerXY = [1*32, 1*32];
	this.kingXY = [22*32, 10*32];
        this.powerXY = [12*32, 6*32];

};

CMN.Level17.prototype = {

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