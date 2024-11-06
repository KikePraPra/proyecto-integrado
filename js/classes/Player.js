export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);
        scene.add.existing(this);

        this.speed = 2;
    }

    update()
    {
        console.log(this.x);
        this.x += this.speed;
    }
}