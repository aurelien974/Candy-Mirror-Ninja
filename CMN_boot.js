/*
	"Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
	"Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
*/

CMN.Boot = function (game) {
	
    this.game = game;
	
};

CMN.Boot.prototype = {

	preload: function () {
		
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
		
            this.scale.minWidth = this.game.width/2;
            this.scale.minHeight = this.game.height/2;

            this.scale.maxWidth = this.game.width;
            this.scale.maxHeight = this.game.height;
		
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.game.scale.setScreenSize(true);

            this.game.load.image('loadingBar', 'cmn_loading_candy1.png');
            this.game.stage.backgroundColor = '#d3b05f';
		
	},
	
	create : function () {
	
            game.state.start('preloader');
		
	}
	
};