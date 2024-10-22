const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {

    this.load.image('background', 'img/assets/fondo-juego.png');
    this.load.image('player', 'img/assets/principal.png');
    this.load.image('ground1', 'img/assets/ground1.png');
    this.load.image('ground2', 'img/assets/ground2.png');
    this.load.image('enemy1', 'img/assets/enemigo1.png');
    this.load.image('power-up', 'img/assets/power-up.png');
}

function create() {

    if(window.innerWidth >= 1600) {
        this.add.image(config.width / 2, config.height / 2, 'background').setScale(1.40);
        this.add.image(150, 500, 'player').depth = 2;
        this.add.image(270, 700, 'ground1').depth = 1;
        this.add.image(1200, 750, 'ground2').depth = 1;
        this.add.image(1200, 510, 'enemy1').depth = 2;
        this.add.image(1080, 670, 'enemy1').depth = 2;
        this.add.image(1300, 550, 'power-up').setScale(0.3).depth = 2;
    }else if(window.innerWidth <= 1000) {
        this.add.image(config.width / 3, config.height / 3, 'background').setScale(.7);
        this.add.image(100, 210, 'player').setScale(0.5).depth = 2;
        this.add.image(120, 300, 'ground1').setScale(0.5).depth = 1;
        this.add.image(600, 300, 'ground2').setScale(0.5).depth = 1;
        this.add.image(600, 190, 'enemy1').setScale(0.5).depth = 2;
        this.add.image(500, 250, 'enemy1').setScale(0.5).depth = 2;
        this.add.image(670, 195, 'power-up').setScale(0.2).depth = 2;
    }
}

function update() {

}