import Phaser from "phaser";

class Nivel3Scene extends Phaser.Scene {
  constructor() {
    super("Nivel3Scene");

    this.handleDeath = () => {
      const currentDeath = Number(this.game.registry.get("deathCount"));
      this.game.registry.set("deathCount", currentDeath + 1);
      this.deathText.setText(`MUERTES: ${this.game.registry.get("deathCount")}`);
      this.scene.restart();
    };

    this.handleSuccess = () => {
      const currentScore = Number(this.game.registry.get("score"));
      this.game.registry.set("score", currentScore + 100);
      this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
      this.scene.start("Nivel4Scene");
    };

    this.handleCoin = (player, coin) => {
      coin.destroy();
      const currentScore = Number(this.game.registry.get("score"));
      this.game.registry.set("score", currentScore + 10);
      this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
    };
  }

  create() {
    // Fondo
    this.add.image(400, 300, "sky");

    // --- Texto UI ---
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

    // --- Plataformas ---
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 584, "ground").setScale(1).refreshBody();
    this.platforms.create(200, 450, "ground").setScale(0.5).refreshBody();
    this.platforms.create(400, 350, "ground").setScale(0.5).refreshBody();
    this.platforms.create(600, 250, "ground").setScale(0.5).refreshBody();
    this.platforms.create(950, 430, "ground").setScale(0.5).refreshBody();

    // --- Jugador ---
    this.player = this.physics.add.sprite(100, 500, "hero");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setOrigin(0.5, 1);

    this.physics.add.collider(this.player, this.platforms);

    // --- Trampas (invisibles al inicio) ---
    this.traps = this.physics.add.staticGroup();

    const trap1 = this.traps.create(510, 525, "trap").setVisible(false);
    trap1.active = false; trap1.body.enable = false;

    const trap5 = this.traps.create(80, 410, "trap").setVisible(false);
    trap5.active = false; trap5.body.enable = false;

    const trap2 = this.traps.create(480, 310, "trap").setVisible(false);
    trap2.active = false; trap2.body.enable = false;

    const trap3 = this.traps.create(250, 310, "trap");
    trap3.active = false; trap3.body.enable = false;

    const trap4 = this.traps.create(600, 210, "trap").setVisible(false);
    trap4.active = false; trap4.body.enable = false;

    this.physics.add.collider(this.player, this.traps, this.handleDeath, null, this);

    // --- Monedas ---
    this.coins = this.physics.add.staticGroup();
    this.coins.create(130, 400, "coin");
    this.coins.create(300, 300, "coin");
    this.coins.create(450, 200, "coin");
    this.coins.create(600, 130, "coin");
    this.coins.create(750, 350, "coin");

    this.anims.create({
      key: "spin",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.coins.children.iterate((coin) => {
      coin.play("spin");
    });

    this.physics.add.overlap(this.player, this.coins, this.handleCoin, null, this);

    // --- Puerta ---
    const door = this.physics.add.staticImage(750, 200, "door");
    this.physics.add.overlap(this.player, door, this.handleSuccess, null, this);

    // --- Animaciones del jugador ---
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

    // --- Controles ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  update() {
    // --- Movimiento del jugador ---
    if (this.cursors.left.isDown) {
      if (this.shiftKey.isDown) {
        this.player.setVelocityX(-80);
        this.player.anims.play("sneaking_left", true);
      } else {
        this.player.setVelocityX(-160);
        this.player.anims.play("left", true);
      }
    } else if (this.cursors.right.isDown) {
      if (this.shiftKey.isDown) {
        this.player.setVelocityX(80);
        this.player.anims.play("sneaking_right", true);
      } else {
        this.player.setVelocityX(160);
        this.player.anims.play("right", true);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    // --- Aparición de trampas al acercarse ---
    this.traps.children.iterate((trap) => {
      if (!trap.active) {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          trap.x,
          trap.y
        );
        if (dist < 60) { // distancia de activación
          trap.setVisible(true);
          trap.body.enable = true;
          trap.active = true;
        }
      }
    });
  }
}

export { Nivel3Scene };
