export default class Background extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);

        scene.add.sprite(x,y, key);
    }

    create()
    {
        
    }
}