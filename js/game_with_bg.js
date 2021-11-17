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
}

function createScene ()
{
    this.add.sprite(400, 300, 'fondo');
}

function updateScene ()
{
}