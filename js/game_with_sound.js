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

    this.load.image('moneda', 'assets/images/tiles/basement/coin.gif');


    this.load.audio('snd_game', ['assets/music/music_main.mp3', 'assets/music/music_main.ogg']);
    this.load.audio('snd_moneda', ['assets/audio/coin.mp3', 'assets/audio/coin.ogg']);
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

    this.monedas = this.physics.add.group();
    for (let i = 0; i < 12; i++)
    {
        let coin = this.monedas.create(i * 70, 0, 'moneda');
        //Gravedad 'y' entre [800-1200]
        coin.setGravityY(1000-(Math.random()*400-200));
        //Gravedad 'x' entre [-50 y 50]
        coin.setGravityX(Math.random()*100-50);
        coin.setCollideWorldBounds(true);

        // Rebote y entre [0.7-0.9]
        coin.setBounceY(0.7 + Math.random() * 0.2);
        coin.setBounceX(1); //rebote total a los lados
    }

    this.physics.add.collider(this.monedas, this.plataformas);
    this.physics.add.overlap(this.player, this.monedas, getmoneda, null, this);


    this.snd_moneda = this.sound.add('snd_moneda');
    this.snd_main = this.sound.add('snd_game', 1, true);

    this.snd_main.play();
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

function getmoneda(player, moneda){
    moneda.disableBody(true, true);
    this.snd_moneda.play();
}
