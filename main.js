	var gameSettings = {
	    playerSpeed: 200,
	}

	var config = {
		width: 800,
		height: 800,
		backgroundColor: 0xffffff,
		scene: [Scene1,Scene2],
		pixelArt: true,
		physics: {
			default: "arcade",
			arcade:{
				debug: false
			}
		}
	}
	var game = new Phaser.Game(config);
