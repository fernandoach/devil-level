import Phaser from "phaser";

class Nivel5Scene extends Phaser.Scene {
  constructor() {
    super("Nivel5Scene");
    
    this.handleDeath = () => {
      const currentDeath = Number(this.game.registry.get("deathCount"))
      this.game.registry.set('deathCount', (currentDeath + 1)); 
      this.deathText.setText(`MUERTES: ${this.game.registry.get('deathCount')}`);
      this.scene.restart();
    }
    
    this.handleSuccess = () => {
        const currentScore = Number(this.game.registry.get("score"))
        this.game.registry.set('score', (currentScore + 100));
        this.scoreText.setText(`PUNTAJE: ${this.game.registry.get('score')}`);
        this.scene.start('Nivel6Scene');
    }
    
    // ⬇️ Handler para moneda original
    this.handleCoin = () => {
        const currentScore = Number(this.game.registry.get("score"))
        this.game.registry.set("score", (currentScore + 5))
        this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
        this.coin.destroy()
    }
    
    // ⬇️ NUEVO: Handler para monedas normales (1 y 2)
    this.handleCoinNormal = (player, coin) => {
        const currentScore = Number(this.game.registry.get("score"))
        this.game.registry.set("score", (currentScore + 5))
        this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
        coin.destroy()
    }
    
    // ⬇️ NUEVO: Handler para moneda EXPLOSIVA (la 3)
    this.handleCoinExplosion = (player, coin) => {
        // La moneda desaparece
        coin.destroy()
        
        // ¡EXPLOSIÓN! → MUERTE instantánea
        this.handleDeath();
    }
  }

  preload() {
    this.load.image("sky", "/images/background.png");
    this.load.image("ground", "/images/ground.png");
    this.load.image("grass1", "/images/grass_1x1.png");
    this.load.image("grass2", "/images/grass_2x1.png");
    this.load.image("grass3", "/images/grass_4x1.png");
    this.load.image("grass4", "/images/grass_6x1.png");
    this.load.image("grass5", "/images/grass_8x1.png");
    this.load.image("trap", "/images/spike.png");
    this.load.image("door", "/images/door.png");
    
    this.load.spritesheet("hero", "/images/hero.png", {
      frameWidth: 36,
      frameHeight: 42,
    });

    this.load.spritesheet("hero_sneaking", "/images/hero_sneaking.png", {
      frameWidth: 36,
      frameHeight: 42,
    });

    this.load.spritesheet("hero_stopped", "/images/hero_stopped.png", {
      frameWidth: 36,
      frameHeight: 42,
    });

    this.load.spritesheet("coin", "/images/coin_animated.png", {
      frameWidth: 22,
      frameHeight: 22,
    });
  }

  create() {
    // Fondo
    this.add.image(400, 300, "sky");

    // Textos UI
    this.deathText = this.add.text(10, 10, `MUERTES: ${this.game.registry.get('deathCount')}`, { fontSize: '16px', fill: '#f11' });
    this.scoreText = this.add.text(600, 10, `PUNTAJE: ${this.game.registry.get('score')}`, { fontSize: '16px', fill: '#0B7' });
    this.add.text(600, 100, `NICKNAME: ${this.game.registry.get("nickname")}`, { fontSize: '16px', fill: '#0B7' });
    
    // Plataformas
    const platforms = this.physics.add.staticGroup();
    
    // Suelo base
    platforms.create(130, 578, "ground").setScale(0.5).refreshBody();

    // Pincho del suelo (invisible, aparece cuando avanzas)
    this.groundSpike = this.physics.add.staticImage(170, 540, "trap");
    this.groundSpike.setSize(20, 10);
    this.groundSpike.setVisible(false);
    this.groundSpike.body.enable = false;
    
    // Plataforma 1 (normal)
    platforms.create(280, 500, "grass1").refreshBody();

    // Plataforma 2 (TRAMPA - desaparece después de pisarla)
    this.platform2 = this.physics.add.image(400, 430, "grass1");
    this.platform2.setImmovable(true);
    this.platform2.body.allowGravity = false;

    // Plataforma 3 (normal)
    platforms.create(520, 360, "grass1").refreshBody();

    // PLATAFORMA GRANDE SUPERIOR
    platforms.create(710, 290, "grass4").refreshBody();

    // PINCHO TRAMPA (invisible al inicio)
    this.trapSpike = this.physics.add.staticImage(650, 245, "trap");
    this.trapSpike.setSize(20, 10);
    this.trapSpike.setVisible(false);
    this.trapSpike.body.enable = false;

    // PUERTA
    this.door = this.physics.add.staticImage(750, 240, "door");
    this.door.setSize(24, 48).setOffset(0, 0);

    // MONEDAS
    if (!this.anims.exists("spin")) {
      this.anims.create({
        key: "spin",
        frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
    }

    this.coin1 = this.physics.add.staticSprite(280, 400, "coin");
    this.coin1.setSize(20, 20);
    this.coin1.play("spin");

    this.coin2 = this.physics.add.staticSprite(400, 330, "coin");
    this.coin2.setSize(20, 20);
    this.coin2.play("spin");

    this.coin3 = this.physics.add.staticSprite(520, 260, "coin");
    this.coin3.setSize(20, 20);
    this.coin3.play("spin");

    // JUGADOR
    this.player = this.physics.add.sprite(80, 450, "hero");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(false);
    
    // Animaciones
    if (!this.anims.exists("left")) {
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("turn")) {
      this.anims.create({
        key: "turn",
        frames: [{ key: "hero_stopped", frame: 3 }],
        frameRate: 20,
      });
    }

    if (!this.anims.exists("right")) {
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("sneaking_left")) {
      this.anims.create({
        key: "sneaking_left",
        frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    if (!this.anims.exists("sneaking_right")) {
      this.anims.create({
        key: "sneaking_right",
        frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    // Colisiones
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.platform2);
    this.physics.add.collider(this.player, this.trapSpike, this.handleDeath, null, this);
    this.physics.add.collider(this.player, this.groundSpike, this.handleDeath, null, this);
    this.physics.add.overlap(this.player, this.door, this.handleSuccess, null, this);
    this.physics.add.overlap(this.player, this.coin1, this.handleCoinNormal, null, this);
    this.physics.add.overlap(this.player, this.coin2, this.handleCoinNormal, null, this);
    this.physics.add.overlap(this.player, this.coin3, this.handleCoinExplosion, null, this);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Variables
    this.platforms = platforms;
    this.trapActivated = false;
    this.reachedTopPlatform = false;
    this.platform2Touched = false;
    this.groundSpikeActivated = false;
  }

  update() {
    // Detectar si cayó al vacío (muerte)
    if (this.player.y > 620) {
      this.handleDeath();
      return;
    }

    // Pincho aparece cuando estás DETRÁS de él (antes de llegar)
    if (!this.groundSpikeActivated && this.player.x > 120 && this.player.x < 170) {
      this.groundSpikeActivated = true;
      this.groundSpike.setVisible(true);
      this.groundSpike.body.enable = true;
    }

    // Detectar si llegó a los bloques superiores
    if (!this.reachedTopPlatform && this.player.x > 600 && this.player.y < 310) {
      this.reachedTopPlatform = true;
    }

    // Si llegó arriba Y empieza a moverse → APARECE EL PINCHO
    if (this.reachedTopPlatform && !this.trapActivated) {
      if (this.cursors.left.isDown || this.cursors.right.isDown) {
        this.trapActivated = true;
        this.trapSpike.setVisible(true);
        this.trapSpike.body.enable = true;
      }
    }

    // Movimiento del jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-350);
    }
  }
}

export { Nivel5Scene };