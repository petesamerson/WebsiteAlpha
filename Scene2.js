class Scene2 extends Phaser.Scene {
	constructor() {
		super("playGame");
	}

	create() {
		this.background = this.add.image(0,0,"background");
		this.background.setOrigin(0,0);

		this.ship1 = this.add.image(this.background.width/2 - 50, this.background.height/2, "ship")
		this.ship2 = this.add.image(this.background.width/2, this.background.height/2, "ship2")
		this.ship3 = this.add.image(this.background.width/2 + 50, this.background.height/2, "ship3")

		this.add.text(20, 20, "Playing Game", {font: "25px Arial", fill: "yellow"});
	}

	moveShip(ship, speed) {
		ship.y += speed
		if(ship.y > this.background.height) {
			this.resetShipPos(ship)
		}
	}

	resetShipPos(ship) {
		var randomX = Phaser.Math.Between(0, this.background.width);
		ship.x = randomX;
		ship.y = 0
	}

	update() {
		this.moveShip(this.ship1, 1) 
		this.moveShip(this.ship2, 2)
		this.moveShip(this.ship3, 3)
	}
}