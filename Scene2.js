class Scene2 extends Phaser.Scene {
	constructor() {
		super("playGame");
	}

	create() {
		this.background = this.add.tileSprite(0,0,256,275,"background")
		this.background.setOrigin(0,0);

		var graphics = this.add.graphics()
		graphics.fillStyle(0x000000, 1)
		graphics.beginPath()
		graphics.moveTo(0,0)
		graphics.lineTo(config.width, 0)
		graphics.lineTo(config.width, 30)
		graphics.lineTo(0, 20)
		graphics.lineTo(0, 0)
		graphics.closePath()
		graphics.fillPath()
        this.setupHexGrid()

		this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship")
		this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship2")
		this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3")

        this.enemies = this.physics.add.group()
        this.enemies.add(this.ship1)
        this.enemies.add(this.ship2)
        this.enemies.add(this.ship3)


		this.ship1.play("ship1_anim")
		this.ship2.play("ship2_anim")
		this.ship3.play("ship3_anim")
		console.log(this.ship1)

		this.ship1.setInteractive()
		this.ship2.setInteractive()
		this.ship3.setInteractive()

		this.input.on('gameobjectdown', this.destroyShip, this)

		this.physics.world.setBoundsCollision();
		this.powerUps = this.physics.add.group();

		var maxObjects = 4;
		for (var i=0; i <= maxObjects; i++) {
			var powerUp = this.physics.add.sprite(16,16,"power-up")
			this.powerUps.add(powerUp)
			powerUp.setRandomPosition(0, 0, game.config.width, game.config.height)
			if (Math.random() > 0.5) {
				powerUp.play("red")
			} else {
				powerUp.play("gray")
			}
			powerUp.setVelocity(100, 100)
			powerUp.setCollideWorldBounds(true)
			powerUp.setBounce(1)
		}

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player")
        this.player.play("thrust")
        this.cursorKeys = this.input.keyboard.createCursorKeys()
        this.player.setCollideWorldBounds(true)

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        this.projectiles = this.add.group()

        this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
            projectile.destroy()
        })

        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this)
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this)

        this.score = 0
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16)

        this.beamSound = this.sound.add("audio_beam")
        this.explosionSound = this.sound.add("audio_explosion")
        this.pickupSound = this.sound.add("audio_pickup")

        this.music = this.sound.add("music")

        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        //this.music.play(musicConfig)
	}
    
    setupHexGrid() {
        var gridXPixels = .8 * config.width
        var gridYPixels = .8 * config.height
        
        var size = 30 
        var separationX = 3*size
        var separationY = .86*size
        
        var gridX = Math.round(gridXPixels/separationX) + 1
        var gridY = Math.round(gridYPixels/separationY) + 1
        
        var currentX = config.width/2.0 -gridXPixels/2.0
        var currentY = config.height/2.0 -gridYPixels/2.0
        var fillHex = false
        for (var i=0; i< gridY; i++){
            if(i % 2 ==0) {
                currentX += (1.5*size)
            }
            for (var j = 0; j<gridX; j++) {
                if(i==2 && j==4) {
                    fillHex = true
                }
                if(i==1 && j==5) {
                    fillHex = true
                }
                if(i==2 && j==5) {
                    fillHex = true
                }
                this.drawHexagon(currentX, currentY, size, fillHex)
                fillHex=false
                currentX+=separationX
            }
            fillHex = false
            currentX = config.width/2.0 -gridXPixels/2.0
            currentY += separationY
        }
    }
    
    drawHexagon(x, y, side, fillHex) {
       
       var graphics = this.add.graphics()
       console.log("drawn at x: " + "y: "+y)
       graphics.lineStyle(3, 0x000000, 1.0)
       graphics.moveTo(x + side*Math.sin(Math.PI/2), y+ side*Math.cos(Math.PI/2))
       graphics.lineTo(x + side*Math.sin(Math.PI/6), y+ side*Math.cos(Math.PI/6))
       graphics.lineTo(x + side*Math.sin(11*Math.PI/6), y+ side*Math.cos(11*Math.PI/6))
       graphics.lineTo(x + side*Math.sin(3*Math.PI/2), y+ side*Math.cos(3*Math.PI/2))
       graphics.lineTo(x + side*Math.sin(7*Math.PI/6), y+ side*Math.cos(7*Math.PI/6))
       graphics.lineTo(x + side*Math.sin(5*Math.PI/6), y+ side*Math.cos(5*Math.PI/6))
       graphics.closePath()
       graphics.strokePath()
       if(fillHex) {
           console.log("filled at x: " +x +" y: "+y)
           graphics.fillStyle(0x0022AA,0.5)
           graphics.fillPath()
       }
        
    }

    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true,true)
    }

    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy)

        if(this.player.alpha < 1) {
            return
        }

        var explosion = new Explosion(this, player.x, player.y)
        player.disableBody(true, true)

        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        })
    }

    resetPlayer() {
        var x = config.width / 2 - 8
        var y = config.height
        this.player.enableBody(true, x, y, true, true)

        this.player.alpha = 0.5

        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.player.alpha = 1
            },
            callbackScope: this
        })
    }

    hitEnemy(projectile, enemy) {
        var explosion = new Explosion(this, enemy.x, enemy.y)
        this.explosionSound.play()

        projectile.destroy()
        this.resetShipPos(enemy)
        this.score += 15
        var scoreFormated = this.zeroPad(this.score,6)
        this.scoreLabel.text = "SCORE " + scoreFormated
    }

	moveShip(ship, speed) {
		ship.y += speed
		if(ship.y > config.height) {
			this.resetShipPos(ship)
		}
	}

	resetShipPos(ship) {
		var randomX = Phaser.Math.Between(0, this.background.width);
		ship.x = randomX;
		ship.y = 0
	}

	destroyShip(pointer, gameObject) {
		gameObject.setTexture("explosion")
		gameObject.play("explode")
	}

	movePlayerManager() {
	    if(this.cursorKeys.left.isDown) {
	        this.player.setVelocityX(-gameSettings.playerSpeed)
	    } else if(this.cursorKeys.right.isDown) {
	        this.player.setVelocityX(gameSettings.playerSpeed)
	    } else {
	        this.player.setVelocityX(0)
	    }

	    if(this.cursorKeys.up.isDown) {
	        this.player.setVelocityY(-gameSettings.playerSpeed)
	    } else if(this.cursorKeys.down.isDown) {
	        this.player.setVelocityY(gameSettings.playerSpeed)
	    } else {
	        this.player.setVelocityY(0)
	    }
	}


    shootBeam(){
        var beam = new Beam(this)
        this.beamSound.play()
    }

    zeroPad(number, size) {
        var stringNumber = String(number)
        while(stringNumber.length  < (size || 2)) {
            stringNumber = "0" + stringNumber
        }
        return stringNumber
    }

	update() {
		this.moveShip(this.ship1, 1) 
		this.moveShip(this.ship2, 2)
		this.moveShip(this.ship3, 3)
		this.background.tilePositionY -= 0.5

		this.movePlayerManager()

		if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
		    if(this.player.active) {
		        this.shootBeam()
		    }
		}
		for(var i = 0; i < this.projectiles.getChildren().length; i++) {
		    var beam = this.projectiles.getChildren()[i]
		    beam.update()
		}
	}
}