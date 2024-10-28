let gameScene = new Phaser.Scene("Game");

  

gameScene.preload = function() {

  this.playerSpeed = 400;
  this.playerJump = -500;
    //se cargan las imagenes
    this.load.image('background', 'img/assets/fondo-juego.png');
    this.load.image('ground1', 'img/assets/ground1.png');
    this.load.image('ground2', 'img/assets/ground2.png');
    this.load.image('platform', 'img/assets/platform.png');
    this.load.image('enemy1', 'img/assets/enemigo1.png');
    this.load.image('power-up', 'img/assets/power-up.png');

    //se cargan los spritesheets
    this.load.spritesheet('player', './img/assets/principal-spritesheet.png', {
        frameWidth: 90,
        frameHeight: 156,
        margin: 4,
        spacing: -18.5
      });

    //cargar json
    this.load.json('levelData', './data/levelData.json');
}

gameScene.create = function() {

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
    frameRate: 8,
    yoyo: true,
    repeat: -1
});
    
    //fondo
    let bg = this.add.sprite(0,0, 'background');
    bg.setOrigin(0,0);

    this.setuplevel();

    this.physics.add.collider([this.player, this.enemies], this.platforms);
  
    this.physics.add.overlap(this.player, this.enemies, this.restartGame, null, this);

    //teclas
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.hit = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

gameScene.setuplevel = function() {

    //fondo
    this.levelData = this.cache.json.get('levelData');
    //crear plataformas
    this.platforms = this.physics.add.staticGroup();
    this.levelData.platforms.forEach((item) => {
        let platform;
            platform = this.add.sprite(item.x, item.y, item.key).setOrigin(0, 0);

        //habilitar fisicas
        this.physics.add.existing(platform, true);
        this.platforms.add(platform);
    });

    //jugador

    this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);

    this.physics.world.setBoundsCollision(true, false, false, false);
    
    //enemigos
    this.enemies = this.physics.add.group();
    this.levelData.enemies.forEach((item) => {
        let enemy;
            enemy = this.add.sprite(item.x, item.y, item.key).setOrigin(0, 0);

        //habilitar fisicas
        this.enemies.add(enemy);
        
    });
    
}

gameScene.update = function(){
  this.movement();
  
  if(this.player.y > 1000){
    this.scene.restart();
  }
}


gameScene.movement = function(){
  let onGround = this.player.body.onFloor();

  if(this.right.isDown){
    this.player.body.setVelocityX(this.playerSpeed);
    this.player.flipX = false;

    if(!this.player.anims.isPlaying){
      this.player.anims.play('walk');
    }
  
  }else if(this.left.isDown){
    this.player.body.setVelocityX(-this.playerSpeed);
    this.player.flipX = true;
  
    if(!this.player.anims.isPlaying){
      this.player.anims.play('walk');
  
    }
  
  }else if(this.up.isDown && onGround){
    this.player.body.setVelocityY(this.playerJump);
  
  }else{
    this.player.body.setVelocityX(0);
    this.player.setFrame(2);
  }
};

gameScene.restartGame = function(){
  this.scene.restart();
}

gameScene.enemyMovement = function(){}

//configuración de la escena
let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: gameScene,
    title: "Gehenna",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 900 },
        debug: true,
      },
    },
  };

  let game = new Phaser.Game(config);