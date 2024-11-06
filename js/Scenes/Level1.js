import Level2 from './Level2.js';

let powerUp = false;

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({key: "Level1", active: true});
    }
    preload() {
        this.loadImages();
    }
    create() {
        this.createThings();
        this.player.anims.play('jump');
    }
    update() {
        this.movement();
        this.enemyMovement();
        
        if(this.player.y > 1000){
            this.restartGame();
  }
    }

    
    loadImages() {
        
    this.playerSpeed = 400;
    this.playerJump = -500;
    this.enemy1Speed = 150;


    //se cargan las imagenes
    this.load.image('background1', 'img/assets/background1.png');
    this.load.image('ground1', 'img/assets/ground1.png');
    this.load.image('ground2', 'img/assets/ground2.png');
    this.load.image('platform', 'img/assets/platform.png');
    this.load.image('goal', 'img/assets/skull.png');

    this.loadSpritesheets();

    //cargar json
    this.load.json('levelData', './data/levelData.json');
    }

    createThings() {
    this.createAnimations();
    
    //fondo
    let bg = this.add.sprite(0,0, 'background1');
    bg.setOrigin(0,0);

    this.setuplevel();

    this.physics.add.collider([this.player, this.enemies], this.platforms);
  
    this.physics.add.overlap(this.player, this.enemies, this.enemyCollision, null, this);

    this.physics.add.overlap(this.player, this.powerUp, this.getPowerUp, null, this);

    this.physics.add.overlap(this.player, this.goal, this.getGoal, null, this);

    //teclas
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.hit = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    enemyCollision(){
        const scene = this; //esto fue puro copilot, para que te voy a mentir, el resto del método lo generó codeium
        if(this.player.anims.getName() === 'idle-sword'){ //El prompt fue únicamente decirle que el método no servía y que si lo podía arreglar
            this.enemies.children.iterate(function(enemigo) {
              enemigo.setTint(0xff00ff);
              if(enemigo.x < scene.player.x){
                enemigo.x -= 40;
              }
              if(enemigo.x > scene.player.x){
                enemigo.x += 40;
              }
            })
          }
    }

    getPowerUp(){
        this.powerUp.destroy();
        powerUp = true;
    }

    getGoal(){
        this.cameras.main.fade(1000);
        powerUp = false;
        this.scene.add('Level2', new Level2);
        this.scene.start('Level2');
    }

    movement(){
        let onGround = this.player.body.onFloor();
  
  if(this.right.isDown){
    this.player.body.setVelocityX(this.playerSpeed);
    this.player.flipX = false;

    if(this.player.anims.getName() !== 'walk' && onGround && !powerUp){
      this.player.anims.play('walk');
    }

    if(this.player.anims.getName() !== 'walk-sword' && onGround && powerUp){
      this.player.anims.play('walk-sword');
    }
  
  }else if(this.left.isDown){
    this.player.body.setVelocityX(-this.playerSpeed);
    this.player.flipX = true;
  
    if(this.player.anims.getName() !== 'walk' && onGround && !powerUp){
      this.player.anims.play('walk');
    }

    if(this.player.anims.getName() !== 'walk-sword' && onGround && powerUp){
      this.player.anims.play('walk-sword');
    }
  
  }else if(this.up.isDown && onGround){
    this.player.body.setVelocityY(this.playerJump);

    if(this.player.anims.getName() !== 'jump' && !powerUp){
      this.player.anims.play('jump');
    }

    if(this.player.anims.getName() !== 'jump-sword' && powerUp){
      this.player.anims.play('jump-sword');
    }
  
  }else{
    this.player.body.setVelocityX(0);
    
    if(this.player.anims.getName() !== 'idle' && onGround && !powerUp){
        this.player.anims.play('idle');
      }

    if(this.player.anims.getName() !== 'idle-sword' && onGround && powerUp){
      this.player.anims.play('idle-sword');
    }

    
  }

  if(this.hit.isDown){
    this.player.anims.play('jump');
  }
    }

    enemyMovement(){
        const scene = this; // Guardar la referencia al contexto de la escena
  
  this.enemies.children.iterate(function(child) {
      child.body.allowGravity = false;
      if (scene.player.x < child.x) {
          child.flipX = false;
          child.body.setVelocityX(-150);
      } else if (scene.player.x == child.x) {
          child.body.setVelocityX(0);
      } 
      else {
          child.flipX = true;
          child.body.setVelocityX(150);
      }
      if (!child.anims.isPlaying) {
          child.anims.play('enemy1-walk');
      }
  });
    }

    setuplevel(){
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

      //agregar enemigos
      this.enemies.add(enemy);
      
  });

  //powerUp
  this.powerUp = this.add.sprite(this.levelData.powerUp.x, this.levelData.powerUp.y, 'power-up'); //y-550
  this.physics.add.existing(this.powerUp);
  this.powerUp.body.allowGravity = false;
  this.powerUp.anims.play('power-up');

  //goal
  this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
  this.physics.add.existing(this.goal);
  this.goal.body.allowGravity = false;

  //cameras
  this.cameras.main.setBounds(0, 0, 2400, 700);
  this.cameras.main.startFollow(this.player, true, 0.5, 0.5); 
    }

    loadSpritesheets(){
          //se cargan los spritesheets
  this.load.spritesheet('player', './img/assets/walk-principal-spritesheet.png', {
    frameWidth: 70,
    frameHeight: 140,
    margin: 0,
    spacing: 0
  });

  this.load.spritesheet('player-sword', './img/assets/sword-walk-spritesheet.png', {
    frameWidth: 70,
    frameHeight: 140,
    margin: 0,
    spacing: 0
  });

this.load.spritesheet('idle', './img/assets/idle-spritesheet.png', {
  frameWidth: 70,
  frameHeight: 140,
  margin: 0,
  spacing: 1
});

this.load.spritesheet('idle-sword', './img/assets/idle-sword-spritesheet.png', {
  frameWidth: 70,
  frameHeight: 140,
  margin: 0,
  spacing: 1
});

this.load.spritesheet('jump', './img/assets/salto-spritesheet.png', {
  frameWidth: 105,
  frameHeight: 140,
  margin: 0,
  spacing: 1
});

this.load.spritesheet('jump-sword', './img/assets/sword-salto-spritesheet.png', {
  frameWidth: 105,
  frameHeight: 140,
  margin: 0,
  spacing: 1
});

//principal


//enemies

this.load.spritesheet('enemy1', './img/assets/enemy1-spritesheet.png', {
    frameWidth: 58,
    frameHeight: 160,
    margin: 0,
    spacing: 2

  });

  //items

this.load.spritesheet('power-up', './img/assets/power-up-spritesheet.png', {
    frameWidth: 70,
    frameHeight: 84,
    margin: 0,
    spacing: 0
  });
    }

    createAnimations(){
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle', {start: 0, end: 4}),
            frameRate: 8,
            repeat: -1
          });
        
          this.anims.create({
            key: 'idle-sword',
            frames: this.anims.generateFrameNumbers('idle-sword', {start: 0, end: 4}),
            frameRate: 8,
            repeat: -1
          });
        
          this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
        
          this.anims.create({
            key: 'walk-sword',
            frames: this.anims.generateFrameNumbers('player-sword', {start: 0, end: 4}),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
        
          this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump', {start: 0, end: 5}),
            frameRate: 8,
            repeat: 0
        });
        
          this.anims.create({
            key: 'jump-sword',
            frames: this.anims.generateFrameNumbers('jump-sword', {start: 0, end: 5}),
            frameRate: 8,
            repeat: 0
        });
        
          this.anims.create({
            key: 'enemy1-walk',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 4}),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });
        
        this.anims.create({
          key: 'power-up',
          frames: this.anims.generateFrameNumbers('power-up', {start: 0, end: 4}),
          frameRate: 8,
          repeat: -1
        });
    }

    restartGame(){
        this.cameras.main.fade(1000);
        powerUp = false;

        //when fade is completed, restart game
        this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
            //restart game 
            this.scene.restart();
        }, this)
            }

}
