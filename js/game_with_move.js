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

    this.load.spritesheet('mario', 'assets/images/character/mario_small.gif', { frameWidth: 32, frameHeight: 32 });
}

function createScene ()
{
    this.add.image(400, 300, 'fondo');

    this.plataformas = this.physics.add.staticGroup();

    let suelo = this.plataformas.create(400, 600 - 32, 'suelo');
    let plataforma1 = this.plataformas.create(350, 450, 'plataforma');
    let plataforma2 = this.plataformas.create(650, 350, 'plataforma');

    this.player = this.physics.add.sprite(32, 32, 'mario');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true); 

    this.physics.add.collider(this.player, this.plataformas);

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mario', { start: 14, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.direccion = 'right';
}

function updateScene ()
{
    //Parado por defecto
    this.player.setVelocityX(0);

    //Movimiento
    if (this.cursors.left.isDown) { //izquierda
        this.direccion = 'left';
        this.player.setVelocityX(-150);
        this.player.play('left', true);
    }
    else if (this.cursors.right.isDown) { //derecha
        this.direccion = 'right';
        this.player.setVelocityX(150);
        this.player.play('right', true);
    }
    else {// parado
        this.player.stop();
        if(this.direccion == 'right') //parado hacia la derecha
            this.player.setFrame(0);
        else //parado hacia la izquierda
            this.player.setFrame(14);
    }

    //Saltando
    if(!this.player.body.touching.down) {
        if(this.direccion == 'right')
            this.player.setFrame(4); // saltando derecha
        else
            this.player.setFrame(18); // saltando izquierda
    }

    //Saltar (velocidad y negativa) cuando tocando suelo
    if (this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(-350);
    }
}
