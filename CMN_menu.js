/*
	"Candy Mirror Ninja" est un jeu créé en mai 2014 par Aurélien Picolet.
	"Candy Mirror Ninja" is a game created in May 2014 by Aurélien Picolet.
*/

CMN.Menu = function (game) {

	this.startButton;
	this.game = game;
        
        this.chosenLanguage;
        
        this.title;
        
        this.introduction;
        this.instructions;
        
        this.spaceBetweenLanguages = 80;
        
        this.play;
        
        this.soundButton;
        
        this.soundForButton;
        
        this.levelSelected;
        this.levelSelectedText;
        this.chooseNextLevel;
        this.choosePreviousLevel;
        this.levelSelection;
        
        this.color1Dark = "#4b1b09";        // rose AE1580  bleu    08384a
        this.color1Bright = "#941431";      // rose E32DDD  bleu    147294
        this.color2Dark = "#4a0817";        // bleu 4315AC  marron  4b1b09
        this.color2Bright = "#943614";      // bleu 2F2CE2  marron  943614
        this.colorBackground = "#d3b05f";   // rose ffdbdb  beige   d3b05f

};

CMN.Menu.prototype = {

	create: function () {
            
            this.levelSelected = CMN.currentLevel;
        
            this.game.stage.backgroundColor = this.colorBackground;
            
            this.soundForButton = this.game.add.audio("buttonHit", 0.2);
            
                // LANGUAGES
            
            var translations = this.game.cache.getJSON("languages");
            this.chosenLanguage = translations[CMN.language];
            
            var languagesArray = Object.keys(translations);
            
            for (var i = 0; i < languagesArray.length; i++) {
                
                var languageButton = this.game.add.text(i * 80, 140, languagesArray[i], {font : "32px cmn_webfont", align : "center", fill : this.color1Bright});
                languageButton.x = this.game.world.centerX - ((this.spaceBetweenLanguages) * languagesArray.length / 2) + (i * (this.spaceBetweenLanguages)) + (this.spaceBetweenLanguages) / 2;
                languageButton.anchor.setTo(0.5, 0); 
                
                languageButton.inputEnabled = true;
                languageButton.events.onInputDown.add(this.changeLanguage, this);
                
                if (languageButton.text === CMN.language) {
                    
                    languageButton.fill = this.color2Bright;
                    
                }
                
            }
            
                // TITLE
             
            this.title = this.game.add.text(this.game.world.centerX, 40, "CANDY MIRROR NINJA", {font : "64px cmn_webfont", stroke : this.color2Dark, strokeThickness : 3});
            this.title.anchor.setTo(0.5, 0,5);
//            this.title.lineSpacing = 10; // For FF bug
            
            this.title.setShadow(0, 0, 'rgba(0,0,0,0.5)', 15);

            var grdTitle = this.title.context.createLinearGradient(0, 0, 0, this.title.y + this.title.fontSize);
            grdTitle.addColorStop(0, this.color1Dark); 
            grdTitle.addColorStop(1, this.color1Bright);
            this.title.fill = grdTitle;
            
                // INTRODUCTION
            
            var styleTextMenu = {
                
                font    :           "22px cmn_webfont",
                align   :           "center",
                wordWrap   :        true,
                wordWrapWidth   :   "750",
                fill    :           this.color2Dark
                
            };
            
            this.introduction = this.game.add.text(this.game.world.centerX, 200, this.chosenLanguage["introduction"], styleTextMenu);
            this.introduction.anchor.setTo(0.5, 0);
                  
                // INSTRUCTIONS
            
            this.instructions = this.game.add.text(this.game.world.centerX, 280, this.chosenLanguage["instructions"], styleTextMenu);
            this.instructions.anchor.setTo(0.5, 0);
                     
                // PLAY
                      
            this.play = this.game.add.text(this.game.world.centerX, 405, this.chosenLanguage["play"], {font : "40px cmn_webfont", fill : this.color1Bright});
            this.play.anchor.setTo(0.5, 0);
                     
            this.play.inputEnabled = true;
            this.play.events.onInputDown.add(this.startGame, this);
            
                // SOUND
            
            this.soundButton = this.game.add.button(768, 448, "soundButton", this.muteSound, this, 0, 0, 0, 0);
            this.soundButton.anchor.setTo(0.5, 0.5);

            if (this.game.sound.mute) {
                
                this.soundButton.frame = 1;
                this.soundButton.setFrames(1, 1, 1, 1);
            
            } else if(!this.game.sound.mute) {
                
                this.soundButton.frame = 0;
                this.soundButton.setFrames(0, 0, 0, 0);
            
            }

                // LEVEL SELECTION
                
            this.levelSelection = this.game.add.text(this.game.world.centerX, 355, this.chosenLanguage["level"] + " :", {font : "34px cmn_webfont", fill : this.color2Bright});
            this.levelSelection.anchor.setTo(0, 0);
            this.levelSelection.x = this.game.world.centerX - this.levelSelection.width;
            
            
            this.choosePreviousLevel = this.game.add.text(this.game.world.centerX + 20, 355, "-", {font : "34px cmn_webfont", fill : this.color1Bright});
            this.choosePreviousLevel.anchor.setTo(0.5, 0);
            this.choosePreviousLevel.inputEnabled = true;
            this.choosePreviousLevel.events.onInputDown.add(this.chooseLevel, this);
            
            this.chooseNextLevel = this.game.add.text(this.game.world.centerX + 80, 355, "+", {font : "34px cmn_webfont", fill : this.color1Bright});
            this.chooseNextLevel.anchor.setTo(0.5, 0);
            this.chooseNextLevel.inputEnabled = true;
            this.chooseNextLevel.events.onInputDown.add(this.chooseLevel, this);
            
            this.levelSelectedText = this.game.add.text(this.game.world.centerX + 50, 355, this.levelSelected, {font : "34px cmn_webfont", fill : this.color2Bright});
            this.levelSelectedText.anchor.setTo(0.5, 0);
            
	},
	
        chooseLevel: function(button) {

            this.soundForButton.play();

            if (button.text === "-") {

                if (this.levelSelected > 1) {
                    
                    this.levelSelected--;
                    
                } else {
                    
                    this.levelSelected = CMN.levels.length;
                    
                }
                
            } else if (button.text === "+") {

                if (this.levelSelected < CMN.levels.length) {
                    
                    this.levelSelected++;
                    
                } else {
                    
                    this.levelSelected = 1;
                    
                }
                
            }

            CMN.currentLevel = this.levelSelected;
            this.levelSelectedText.text = this.levelSelected;
            
        },
        
	update: function() {

		
	
	},
	
	startGame: function() {
	
                this.soundForButton.play();
		this.game.state.start(CMN.levels[this.levelSelected - 1]);
	
	},
        
        changeLanguage: function(languageButton, pointer) {
            
            this.soundForButton.play();
            CMN.language = languageButton.text;
            this.game.state.start('menu');
            
        },
        
        muteSound: function() {

            this.soundButton.frame = (this.soundButton.frame + 1) % 2;
            this.soundButton.setFrames(this.soundButton.frame, this.soundButton.frame, this.soundButton.frame);

            if (this.game.sound.mute) {
                
                    this.game.sound.mute = false;
                    
            } else if(!this.game.sound.mute) {
                
                    this.game.sound.mute = true;
                    
            }

	}
	
};