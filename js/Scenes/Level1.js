import Enemy from '../classes/Enemy.js';
import Player from '../classes/Player.js';
import Level2 from './Level2.js';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1", active: true });
  }
  preload() {
    this.loadImages();
  }

  create() {
    this.levelData = this.cache.json.get('levelData');
    this.player = new Player(this, this.levelData.player.x, this.levelData.player.y, 'player');
    this.player.depth = 2;

    this.enemies = this.physics.add.group();
    this.levelData.enemies.forEach((item) => {
      let enemy;
      enemy = new Enemy(this, item.x, item.y, item.key);
      enemy.depth = 2;
      this.enemies.add(enemy);
    });
    this.createThings();
  }

  update() {
    // let onGround = this.player.body.onFloor();
    this.player.update(this.keys);
    
    // this.enemyMovement();

    if (this.player.y > 1000) {
      this.restartGame();
    }

    this.enemies.children.iterate(function (enemy) {
      if(enemy){
        enemy.update();
      }
    });
  }


  loadImages() {
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
    
    this.keys = this.input.keyboard.addKeys({ 
      W: Phaser.Input.Keyboard.KeyCodes.W, 
      A: Phaser.Input.Keyboard.KeyCodes.A, 
      D: Phaser.Input.Keyboard.KeyCodes.D, 
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE });

    this.createAnimations();

    this.physics.world.setBoundsCollision(true, false, false, false);

    //fondo
    let bg = this.add.sprite(0, 0, 'background1');
    bg.setOrigin(0, 0);

    this.setuplevel();

    this.physics.add.collider([this.player, this.enemies], this.platforms);

    this.physics.add.collider(this.player, this.enemies, this.enemyCollision, null, this);

    this.physics.add.overlap(this.player, this.powerUp, this.getPowerUp, null, this);

    this.physics.add.overlap(this.player, this.goal, this.getGoal, null, this);
  }

  enemyCollision(player, enemy) {
        if (player.anims.getName() === 'jump'){
            enemy.collision();
          }else{
          if (enemy.x < player.x){
            player.x -= 150;
          }
          if (enemy.x > player.x){
            player.x += 150;
          }
        }
      }

  getPowerUp() {
    this.powerUp.destroy();
    this.player.getPowerUp(true);
  }

  getGoal() {
    this.cameras.main.fade(1000);
    this.player.getPowerUp(false);
    this.scene.add('Level2', new Level2);
    this.scene.start('Level2');
  }

  setuplevel() {

    //crear plataformas
    this.platforms = this.physics.add.staticGroup();
    this.levelData.platforms.forEach((item) => {
      let platform;
      platform = this.add.sprite(item.x, item.y, item.key).setOrigin(0, 0);

      //habilitar fisicas
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);
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

  loadSpritesheets() {
    //se cargan los spritesheets
    //player
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

    //player

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

  createAnimations() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'idle-sword',
      frames: this.anims.generateFrameNumbers('idle-sword', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-sword',
      frames: this.anims.generateFrameNumbers('player-sword', { start: 0, end: 4 }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'jump-sword',
      frames: this.anims.generateFrameNumbers('jump-sword', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'enemy1-walk',
      frames: this.anims.generateFrameNumbers('enemy1', { start: 0, end: 4 }),
      frameRate: 5,
      yoyo: true,
      repeat: -1
    });

    this.anims.create({
      key: 'power-up',
      frames: this.anims.generateFrameNumbers('power-up', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    });
  }

  restartGame() {
    this.player.getPowerUp(false);
    this.cameras.main.fade(1000);

    //when fade is completed, restart game
    this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
      //restart game 
      this.scene.restart();
    }, this)
  }

}
