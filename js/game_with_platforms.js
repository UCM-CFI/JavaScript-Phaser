let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preloadScene,
        create: createScene,
        update: updateScene
    }
};

let game = new Phaser.Game(config);

function preloadScene ()
{
    this.load.image('fondo', 'assets/images/backgrounds/bg.gif');

    this.load.image('suelo', 'assets/images/backgrounds/suelo.gif');
    this.load.image('plataforma', 'assets/images/backgrounds/plataforma.gif'); 
}

function createScene ()
{
    this.add.image(400, 300, 'fondo');

    this.plataformas = this.physics.add.staticGroup();

    let suelo = this.plataformas.create(400, 600 - 32, 'suelo');
    let plataforma1 = this.plataformas.create(350, 450, 'plataforma');
    let plataforma2 = this.plataformas.create(650, 350, 'plataforma');
}

function updateScene ()
{
}
