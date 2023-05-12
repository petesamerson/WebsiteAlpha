class Scene1 extends Phaser.Scene {
	constructor() {
		super("bootGame");
	}	

	create() {
		this.add.text(20, 20, "Loading game ... Mrk2");
		this.scene.start("playGame")
	}
}