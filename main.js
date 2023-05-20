	var gameSettings = {
	    playerSpeed: 200,
	}

	var config = {
		width: 780,
		height: 780,
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
