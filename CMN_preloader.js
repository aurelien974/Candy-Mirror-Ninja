/*
	"Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
	"Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
*/

CMN.Preloader = function (game) {

    this.loadingBar;
    this.game = game;

};

CMN.Preloader.prototype = {

	preload: function () {
		
            this.game.stage.backgroundColor = '#d3b05f';
            
            this.loadingBar = this.game.add.sprite(this.game.world.centerX-200, this.game.world.centerY-16, 'loadingBar');
            this.game.load.setPreloadSprite(this.loadingBar);

            this.game.load.json("languages", "cmn_languages.json");

            this.game.load.bitmapFont("cmn_font", "cmn_font.png", "cmn_font.fnt");

            this.game.load.spritesheet("soundButton", "cmn_soundbutton1.png", 32, 32);
                
                // GAME

            // AUDIO
            this.game.load.audio("avocadoLaunched", ["cmn_avocadoLaunched.mp3", "cmn_avocadoLaunched.ogg", "cmn_avocadoLaunched.wav"]);
            this.game.load.audio("buttonHit", ["cmn_buttonHit.mp3", "cmn_buttonHit.ogg", "cmn_buttonHit.wav"]);
            this.game.load.audio("collectCandy", ["cmn_collectCandy.mp3", "cmn_collectCandy.ogg", "cmn_collectCandy.wav"]);
            this.game.load.audio("collectPower", ["cmn_collectPower.mp3", "cmn_collectPower.ogg", "cmn_collectPower.wav"]);
            this.game.load.audio("laserShot", ["cmn_laserShot.mp3", "cmn_laserShot.ogg", "cmn_laserShot.wav"]);
            this.game.load.audio("objectDestroyed", ["cmn_objectDestroyed.mp3", "cmn_objectDestroyed.ogg", "cmn_objectDestroyed.wav"]);

            // HUD
            this.game.load.image('hud_background', 'cmn_hud_bg1.png');
            this.game.load.image('reloadButton', 'cmn_reload1.png');
            this.game.load.image('quitButton', 'cmn_quit1.png');

            // LEVEL
            this.game.load.image('candy', 'cmn_candy1.png');
            this.game.load.image('king', 'cmn_king1.png');
            this.game.load.image('power', 'cmn_power1.png');
            this.game.load.spritesheet('avocado', 'cmn_avocados1.png', 32, 32);
            this.game.load.image('tileBg', 'cmn_tile_bg.png');
            this.game.load.image('tileMirror', 'mirror_temp.png');
            
            // PLAYER    
            this.game.load.spritesheet('ninja', 'cmn_ninja1.png', 32, 32);
            this.game.load.spritesheet('ninjaPower', 'cmn_ninja_power1.png', 32, 32);
		
	},
	
	create: function () {
	
            this.game.state.start('menu');
		
	},
	
	update: function() {
	
            // if (this.cache.isSoundDecoded('titleMusic'))
            // {
                    // this.game.state.start('MainMenu');
            // }

	}
	
};