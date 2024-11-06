export default class Level3 extends Phaser.Scene {
    constructor() {
        super({key: "Level3", active: true});
    }
    preload() {
        
    }
    create() {
        let graphics = this.add.graphics();
        graphics.fillStyle(0xff3300, 1);

        graphics.fillRect(200, 110, 1000, 1000);
        console.log("level 1");
    }
    update() {
        
    }
}