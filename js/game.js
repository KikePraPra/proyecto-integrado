import Level1 from './Scenes/Level1.js';
import Level2 from './Scenes/Level2.js';
import Level3 from './Scenes/Level3.js';


const config = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: Level1,
  title: "Gehenna",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: true,
    },
  },
};

new Phaser.Game(config);