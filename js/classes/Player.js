let powerUp = false;

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.player = this;
  }

  update(keys) {
    this.movement(keys);
  }

  getPowerUp(getPowerUp) {
    if(getPowerUp) {
      powerUp = true;
    }else{
      powerUp = false;
    }
  }

  movement(keys) {

    let onGround = this.player.body.onFloor();

    this.playerSpeed = 400;
    this.playerJump = -500;

    if (keys.D.isDown) {
      this.player.body.setVelocityX(this.playerSpeed);
      this.player.flipX = false;

      if (this.player.anims.getName() !== 'walk' && onGround && !powerUp) {
        this.player.anims.play('walk');
      }

      if (this.player.anims.getName() !== 'walk-sword' && onGround && powerUp) {
        this.player.anims.play('walk-sword');
      }

    } else if (keys.A.isDown) {
      this.player.body.setVelocityX(-this.playerSpeed);
      this.player.flipX = true;

      if (this.player.anims.getName() !== 'walk' && onGround && !powerUp) {
        this.player.anims.play('walk');
      }

      if (this.player.anims.getName() !== 'walk-sword' && onGround && powerUp) {
        this.player.anims.play('walk-sword');
      }

    } else if (keys.W.isDown && onGround) {
      this.player.body.setVelocityY(this.playerJump);

      if (this.player.anims.getName() !== 'jump' && !powerUp) {
        this.player.anims.play('jump');
      }

      if (this.player.anims.getName() !== 'jump-sword' && powerUp) {
        this.player.anims.play('jump-sword');
      }

    } else {

      this.player.body.setVelocityX(0);

      if (this.player.anims.getName() !== 'idle' && onGround && !powerUp) {
        this.player.anims.play('idle');
      }

      if (this.player.anims.getName() !== 'idle-sword' && onGround && powerUp) {
        this.player.anims.play('idle-sword');
      }


    }

    if (keys.SPACE.isDown) {
      this.player.anims.play('jump');
    }
  }
}