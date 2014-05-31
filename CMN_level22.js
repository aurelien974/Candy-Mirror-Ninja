/*
 "Candy Mirror Ninja" est un jeu cr�� en mai 2014 par Aur�lien Picolet.
 "Candy Mirror Ninja" is a game created in May 2014 by Aur�lien Picolet.
 */

CMN.Level22 = function(game) {

	this.levelNumber = 22;
	this.tilemapSource = "CMN_tilemap22.json";
	this.game = game;
	this.candyXY = [22*32, 7*32];
	this.playerXY = [16*32, 3*32];
	this.kingXY = [];
        this.powerXY = [16*32, 3*32];

};

CMN.Level22.prototype = {

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