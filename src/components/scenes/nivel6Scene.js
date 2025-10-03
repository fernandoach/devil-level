import Phaser from "phaser";

class Nivel6Scene extends Phaser.Scene {
  constructor() {
    super("Nivel6Scene");
    this.hasKey = false;
  }

  preload() {
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

    this.load.spritesheet("hero", "/images/hero.png", { frameWidth: 36, frameHeight: 42 });
    this.load.spritesheet("hero_sneaking", "/images/hero_sneaking.png", { frameWidth: 36, frameHeight: 42 });
    this.load.spritesheet("hero_stopped", "/images/hero_stopped.png", { frameWidth: 36, frameHeight: 42 });
  }

  create() {
    this.add.image(400, 300, "sky");

    if (!this.game.registry.has("deathCount")) this.game.registry.set("deathCount", 0);
    if (!this.game.registry.has("score")) this.game.registry.set("score", 0);

    this.deathText = this.add.text(10, 10, `MUERTES: ${this.game.registry.get("deathCount")}`, { fontSize: "16px", fill: "#f11" });
    this.scoreText = this.add.text(600, 10, `PUNTAJE: ${this.game.registry.get("score")}`, { fontSize: "16px", fill: "#0B7" });
    this.nicknameText = this.add.text(600, 40, `NICKNAME: ${this.game.registry.get("nickname")}`, { fontSize: "16px", fill: "#0B7" });

    // Evitar parpadeo de textos
    [this.deathText, this.scoreText, this.nicknameText].forEach(txt => {
      txt.setScrollFactor(0).setDepth(1000);
    });

    // Mensajes persistentes ocultos
    this.noKeyMsg = this.add.text(300, 120, "Necesitas la llave para abrir la puerta", { fontSize: "16px", fill: "#f00" }).setVisible(false).setDepth(1000);
    this.keyMsg = this.add.text(300, 65, "Has conseguido la llave", { fontSize: "16px", fill: "#0f0" }).setVisible(false).setDepth(1000);

    // Plataformas
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(100, 320, "grass4").refreshBody();
    platforms.create(100, 150, "grass1").refreshBody();
    platforms.create(600, 260, "grass8").refreshBody();
    platforms.create(340, 360, "grass1").refreshBody();

    // Plataformas falsas
    this.fakePlatforms = this.physics.add.staticGroup();
    this.fakePlatforms.create(580, 150, "grass1").refreshBody();

    // Puerta
    this.door = this.physics.add.staticImage(750, 460, "door");
    this.door.setSize(24, 48);

    // Jugador
    this.player = this.physics.add.sprite(100, 450, "hero");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Animaciones
    this.anims.create({ key: "left", frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "turn", frames: [{ key: "hero_stopped", frame: 3 }], frameRate: 20 });
    this.anims.create({ key: "right", frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "sneaking_left", frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }), frameRate: 5, repeat: -1 });
    this.anims.create({ key: "sneaking_right", frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }), frameRate: 5, repeat: -1 });

    // Trampas móviles
    this.movingTraps = this.physics.add.group();
    let trapV = this.movingTraps.create(400, 400, "trap").setImmovable(true);
    trapV.body.allowGravity = false;
    this.tweens.add({ targets: trapV, y: 250, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    let trapH = this.movingTraps.create(600, 350, "trap").setImmovable(true);
    trapH.body.allowGravity = false;
    this.tweens.add({ targets: trapH, x: 500, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    let trapD = this.movingTraps.create(500, 200, "trap").setImmovable(true);
    trapD.body.allowGravity = false;
    this.tweens.add({ targets: trapD, x: 600, y: 180, duration: 2000, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    // Trampas que caen
    this.fallingTraps = this.physics.add.group();
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        let x = Phaser.Math.Between(300, 700);
        let trap = this.fallingTraps.create(x, 0, "trap");
        trap.setVelocityY(Phaser.Math.Between(250, 450));
        trap.body.allowGravity = true;
      }
    });

    // Monedas
    this.coins = this.physics.add.group();
    const coinPositions = [
      { x: 150, y: 380 }, { x: 430, y: 260 }, { x: 580, y: 150 },
      { x: 620, y: 320 }, { x: 700, y: 250 }, { x: 500, y: 100 }
    ];
    coinPositions.forEach(pos => {
      let coin = this.coins.create(pos.x, pos.y, "coin");
      coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    // Llave
    this.key = this.physics.add.sprite(700, 100, "key");
    this.key.setBounce(0.1);

    // Colisiones
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.coins, platforms);
    this.physics.add.collider(this.key, platforms);

    this.physics.add.overlap(this.player, this.movingTraps, () => this.playerDeath(), null, this);
    this.physics.add.overlap(this.player, this.fallingTraps, () => this.playerDeath(), null, this);

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);

    this.physics.add.overlap(this.player, this.door, () => {
      if (this.hasKey) {
        const currentScore = Number(this.game.registry.get("score"));
        this.game.registry.set("score", currentScore + 200);
        this.scoreText.setText(`PUNTAJE: ${this.game.registry.get("score")}`);
        this.scene.start("GameOverScene");
      } else {
        this.noKeyMsg.setVisible(true);
        this.time.delayedCall(1200, () => this.noKeyMsg.setVisible(false));
      }
    }, null, this);

    // Plataformas falsas se rompen al tocarlas
    this.physics.add.collider(this.player, this.fakePlatforms, (player, fake) => {
      if (fake.getData("destroying")) return;
      fake.setData("destroying", true);
      fake.setTint(0xffcc00);
      this.time.delayedCall(300, () => fake.destroy());
    }, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  playerDeath() {
    const currentDeath = Number(this.game.registry.get("deathCount"));
    this.game.registry.set("deathCount", currentDeath + 1);
    this.deathText.setText(`MUERTES: ${this.game.registry.get("deathCount")}`);
    this.player.setX(100);
    this.player.setY(450);
    this.player.setVelocity(0, 0);
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
    this.keyMsg.setVisible(true);
    this.time.delayedCall(1500, () => this.keyMsg.setVisible(false));
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

export { Nivel6Scene };
