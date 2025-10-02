import Phaser from "phaser";

class Nivel2Scene extends Phaser.Scene {
  constructor() {
    super("Nivel2Scene");
    this.hasKey = false;
  }

  preload() {
    // Imágenes
    this.load.image("sky", "/images/background.png");
    this.load.image("ground", "/images/ground.png");
    this.load.image("trap", "/images/spike.png");
    this.load.image("door", "/images/door.png");

    this.load.image("coin", "/images/coin_icon.png");
    this.load.image("grass8", "/images/grass_8x1.png");
    this.load.image("grass4", "/images/grass_4x1.png");
    this.load.image("grass2", "/images/grass_2x1.png");
    this.load.image("grass1", "/images/grass_1x1.png");
    this.load.image("key", "/images/key.png");

    // Sprite del jugador
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
  }

  create() {
    // Fondo
    this.add.image(400, 300, "sky");

    // Registro inicial
    if (!this.game.registry.has("deathCount")) this.game.registry.set("deathCount", 0);
    if (!this.game.registry.has("score")) this.game.registry.set("score", 0);

    // UI
    this.deathText = this.add.text(
      10,
      10,
      `MUERTES: ${this.game.registry.get("deathCount")}`,
      { fontSize: "16px", fill: "#f11" }
    );

    this.scoreText = this.add.text(
      600,
      10,
      `PUNTAJE: ${this.game.registry.get("score")}`,
      { fontSize: "16px", fill: "#0B7" }
    );

    this.add.text(
      600,
      40,
      `NICKNAME: ${this.game.registry.get("nickname") || "Jugador"}`,
      { fontSize: "16px", fill: "#0B7" }
    );

    // Plataformas principales
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(200, 420, "grass4").refreshBody();
    platforms.create(500, 320, "grass2").refreshBody();
    platforms.create(700, 250, "grass4").refreshBody();

    // Puerta
    this.door = this.physics.add.staticImage(750, 460, "door");
    this.door.setSize(24, 48);

    // Jugador
    this.player = this.physics.add.sprite(100, 450, "hero");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Animaciones
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "hero_stopped", frame: 3 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sneaking_left",
      frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "sneaking_right",
      frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });

    // Trampas
    const traps = this.physics.add.staticGroup();
    traps.create(400, 540, "trap").refreshBody();

    // Monedas
    this.coins = this.physics.add.group({
      key: "coin",
      repeat: 10,
      setXY: { x: 100, y: 0, stepX: 60 },
    });
    this.coins.children.iterate((coin) => {
      coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    // Llave
    this.key = this.physics.add.sprite(500, 280, "key");
    this.key.setBounce(0.1);

    // COLISIONES
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.coins, platforms);
    this.physics.add.collider(this.key, platforms);

    // colisión con trampas -> muerte
    this.physics.add.collider(
      this.player,
      traps,
      () => {
        const currentDeath = Number(this.game.registry.get("deathCount"));
        this.game.registry.set("deathCount", currentDeath + 1);
        this.deathText.setText(`MUERTES: ${this.game.registry.get("deathCount")}`);
        this.scene.restart();
      },
      null,
      this
    );

    // recoger monedas
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // recoger llave
    this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);

    // puerta
    this.physics.add.overlap(
      this.player,
      this.door,
      () => {
        if (this.hasKey) {
          const currentScore = Number(this.game.registry.get("score"));
          this.game.registry.set("score", currentScore + 100);
          this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
          this.scene.start("Nivel3Scene");
        } else {
          const noKeyMsg = this.add.text(
            300,
            120,
            "🚪 Necesitas la llave para abrir la puerta",
            { fontSize: "16px", fill: "#ff0" }
          );
          this.time.delayedCall(1200, () => noKeyMsg.destroy());
        }
      },
      null,
      this
    );

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    const currentScore = Number(this.game.registry.get("score"));
    this.game.registry.set("score", currentScore + 10);
    this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
  }

  collectKey(player, key) {
    key.disableBody(true, true);
    this.hasKey = true;
    this.add.text(300, 70, "🔑 Has conseguido la llave!", {
      fontSize: "16px",
      fill: "#0f0",
    });
  }

  update() {
    if (!this.cursors) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}

export { Nivel2Scene };
