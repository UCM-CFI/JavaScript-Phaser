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
}

function createScene ()
{
}

function updateScene ()
{
}

