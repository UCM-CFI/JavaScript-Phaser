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


/**
 * Función preload() que usamos para la carga de recursos
*/
function preloadScene ()
{
    // Fondo
    this.load.image('fondo', 'assets/images/backgrounds/bg.gif');

    // Suelo y plataformas
    this.load.image('suelo', 'assets/images/backgrounds/suelo.gif');
    this.load.image('plataforma', 'assets/images/backgrounds/plataforma.gif'); 

    // Mario
    this.load.spritesheet('mario', 'assets/images/character/mario_small.gif', { frameWidth: 32, frameHeight: 32 });

    // Moneda
    this.load.image('moneda', 'assets/images/tiles/basement/coin.gif');

    // Sonidos
    this.load.audio('snd_game', ['assets/music/music_main.mp3', 'assets/music/music_main.ogg']);
    this.load.audio('snd_moneda', ['assets/audio/coin.mp3', 'assets/audio/coin.ogg']);

    // Luigi
    this.load.spritesheet('luigi', 'assets/images/character/luigi_small.png', { frameWidth: 32, frameHeight: 32 });

    // Estrella
    this.load.image('star', 'assets/images/tiles/basement/star.gif');
    this.load.audio('snd_estrella', ['assets/audio/star.mp3', 'assets/audio/star.ogg']);

} // preload

/**
 * Función create() que usamos para colocar los objetos en el mundo y 
 * crear elementos para poder usarlos posteriormente.
*/
function createScene ()
{
    // Añade imagen de fondo en el centro de la ventana
    this.add.image(400, 300, 'fondo');

    // Crea el suelo y las plataformas añadiendolas al sistema de físicas
    this.plataformas = this.physics.add.staticGroup();
    let suelo = this.plataformas.create(400, 600 - 32, 'suelo');
    let plataforma1 = this.plataformas.create(350, 450, 'plataforma');
    let plataforma2 = this.plataformas.create(650, 350, 'plataforma');

    // Crea el player usando físicas
    this.playerMario = this.physics.add.sprite(32, 32, 'mario');
    this.playerMario.setBounce(0.2);
    this.playerMario.setCollideWorldBounds(true); 

    // Colision entre el player y las plataformas
    this.physics.add.collider(this.playerMario, this.plataformas);

    // Animaciones de derecha e izquierda del personaje
    this.anims.create({
        key: 'rightMario',
        frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'leftMario',
        frames: this.anims.generateFrameNumbers('mario', { start: 14, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    // Crea la variable para los cursores que moveran al personaje
    this.cursors = this.input.keyboard.createCursorKeys();

    // Dirección a la que mirará por defecto el personaje
    this.direccionMario = 'right';

    // Creamos 12 monedas repartidas aleatoriamente en el nivel
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

    // Colision entre monedas y plataformas
    this.physics.add.collider(this.monedas, this.plataformas);

    // Colision entre monedas y player
    this.physics.add.overlap(this.playerMario, this.monedas, getmoneda, null, this);

    // Crear sonidos
    this.snd_moneda = this.sound.add('snd_moneda');
    this.snd_main = this.sound.add('snd_game', 1, true);

    // Activar la música de fondo
    this.snd_main.play();





    // Crea a Luigi usando físicas
    this.playerLuigi = this.physics.add.sprite(768, 32, 'luigi');
    this.playerLuigi.setBounce(0.2);
    this.playerLuigi.setCollideWorldBounds(true); 

    // Colision entre a Luigi y las plataformas
    this.physics.add.collider(this.playerLuigi, this.plataformas);

    // Animaciones de derecha e izquierda del personaje
    this.anims.create({
        key: 'rightLuigi',
        frames: this.anims.generateFrameNumbers('luigi', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'leftLuigi',
        frames: this.anims.generateFrameNumbers('luigi', { start: 14, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    // Teclas para mover a Luigi
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.direccionLuigi = 'left';

    // Creamos 6 estrellas repartidas aleatoriamente en el nivel
    this.estrellas = this.physics.add.group();
    for (let i = 0; i < 6; i++)
    {
        let star = this.estrellas.create(i * 70, 0, 'star');
        //Gravedad 'y' entre [800-1200]
        star.setGravityY(1000-(Math.random()*400-200));
        //Gravedad 'x' entre [-50 y 50]
        star.setGravityX(Math.random()*100-50);
        star.setCollideWorldBounds(true);

        // Rebote y entre [0.7-0.9]
        star.setBounceY(0.7 + Math.random() * 0.2);
        star.setBounceX(1); //rebote total a los lados
    }

    // Colision entre monedas y plataformas
    this.physics.add.collider(this.estrellas, this.plataformas);

    // Colision entre monedas y player
    this.physics.add.overlap(this.playerMario, this.estrellas, getestrella, null, this);
    this.physics.add.overlap(this.playerLuigi, this.estrellas, getestrella, null, this);

    // Crear estrella
    this.snd_estrella = this.sound.add('snd_estrella');

} // create



/**
 * Función update() que usamos actualizar el estado de los elementos del juego
*/
function updateScene ()
{
 
    // ---- MARIO
    //Parado por defecto
    this.playerMario.setVelocityX(0);

    //Movimiento
    if (this.cursors.left.isDown) { //izquierda
        this.direccionMario = 'left';
        this.playerMario.setVelocityX(-150);
        this.playerMario.play('leftMario', true);
    }
    else if (this.cursors.right.isDown) { //derecha
        this.direccionMario = 'right';
        this.playerMario.setVelocityX(150);
        this.playerMario.play('rightMario', true);
    }
    else { // parado
        this.playerMario.stop();
        if(this.direccionMario == 'right') //parado hacia la derecha
            this.playerMario.setFrame(0);
        else //parado hacia la izquierda
            this.playerMario.setFrame(14);
    }

    //Saltando
    if (!this.playerMario.body.touching.down) {
        if(this.direccionMario == 'right')
            this.playerMario.setFrame(4); // saltando derecha
        else
            this.playerMario.setFrame(18); // saltando izquierda
    }

    //Saltar (velocidad negativa) cuando toca suelo
    if (this.cursors.up.isDown && this.playerMario.body.touching.down){
        this.playerMario.setVelocityY(-350);
    }


    // ---- LUIGI
    //Parado por defecto
    this.playerLuigi.setVelocityX(0);

    //Movimiento
    if (this.keyA.isDown) { //izquierda
        this.direccionLuigi = 'left';
        this.playerLuigi.setVelocityX(-150);
        this.playerLuigi.play('leftLuigi', true);
    }
    else if (this.keyD.isDown) { //derecha
        this.direccionLuigi = 'right';
        this.playerLuigi.setVelocityX(150);
        this.playerLuigi.play('rightLuigi', true);
    }
    else { // parado
        this.playerLuigi.stop();
        if(this.direccionLuigi == 'right') //parado hacia la derecha
            this.playerLuigi.setFrame(0);
        else //parado hacia la izquierda
            this.playerLuigi.setFrame(14);
    }

    //Saltando
    if (!this.playerLuigi.body.touching.down) {
        if(this.direccionLuigi == 'right')
            this.playerLuigi.setFrame(4); // saltando derecha
        else
            this.playerLuigi.setFrame(18); // saltando izquierda
    }

    //Saltar (velocidad negativa) cuando toca suelo
    if (this.keyW.isDown && this.playerLuigi.body.touching.down){
        this.playerLuigi.setVelocityY(-350);
    }

} // update

/**
 * Callback getmoneda() que se llama cada vez que se recoge una moneda.
 * Se encarga de desactivar dicha moneda y de instanciar un sonido.
*/
function getmoneda(player, moneda){

    moneda.disableBody(true, true);
    this.snd_moneda.play();

} // getmoneda


/**
 * Callback getestrella() que se llama cada vez que se recoge una estrella.
 * Se encarga de desactivar dicha estrella y de instanciar un sonido.
*/
function getestrella(player, estrella){

    estrella.disableBody(true, true);
    this.snd_estrella.play();

} // getestrella
