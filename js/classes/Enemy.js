let enemyLives = 3;
export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
      super(scene, x, y, key);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      
      this.enemy = this;
      this.scene = scene;
      this.enemyVelocity = 150;
      this.isDestroying = false;
    }
  
    update() {
      this.enemy.body.allowGravity = false;
      this.enemyMovement();
    }



    collision() { 
      if(this.enemy.x > this.scene.player.x){
        this.enemy.x += 150;
      }else{
        this.enemy.x -= 150;
      }
      this.enemy.setTint(0xff0000);
      enemyLives -= 1;
      console.log("enemy lives: "+enemyLives);
      
      if(enemyLives<=0){
        this.enemyVelocity = 0;
        setTimeout(() => {
            super.destroy();
            enemyLives = 3;
          
        }, 3000);}
    }

    enemyMovement() {
      if (this.scene.player.x < this.enemy.x) {
        this.enemy.flipX = false;
        this.enemy.body.setVelocityX(-this.enemyVelocity);
      } else if (this.scene.player.x == this.enemy.x) {
        this.enemy.body.setVelocityX(0);
      }
      else {
        this.enemy.flipX = true;
        this.enemy.body.setVelocityX(this.enemyVelocity);
      }
      if (!this.enemy.anims.isPlaying) {
        this.enemy.anims.play('enemy1-walk');
      }
      }
}