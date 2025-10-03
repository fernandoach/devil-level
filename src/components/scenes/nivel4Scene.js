  import Phaser from "phaser";

  /**
   * Nivel 4 — piso plano + MÁS TRAMPAS
   * - Púas estáticas y una púa móvil patrullando.
   * - 3 puertas (A trampa, B con llave → Nivel5, C cerrada).
   * - Monedas y HUD.
   */
  class Nivel4Scene extends Phaser.Scene {
    constructor() {
      super("Nivel4Scene");
      this.hasKey = false;
      this.isRespawning = false;
      this.iframesMs = 800;
    }

    preload() {
      this.load.image("sky", "/images/background.png");
      this.load.image("ground", "/images/ground.png");
      this.load.image("trap", "/images/spike.png");
      this.load.image("door", "/images/door.png");

      this.load.spritesheet("hero", "/images/hero.png", { frameWidth: 36, frameHeight: 42 });
      this.load.spritesheet("hero_stopped", "/images/hero_stopped.png", { frameWidth: 36, frameHeight: 42 });
      this.load.spritesheet("hero_sneaking", "/images/hero_sneaking.png", { frameWidth: 36, frameHeight: 42 });
      this.load.spritesheet("coin", "/images/coin_animated.png", { frameWidth: 22, frameHeight: 22 });
    }

    create() {
      // Fondo
      this.add.image(400, 300, "sky");

      // HUD
      this.deathText = this.add.text(10, 10, `MUERTES: ${this.game.registry.get("deathCount")}`, { fontSize: "16px", fill: "#f11" });
      this.scoreText = this.add.text(600, 10, `PUNTAJE: ${this.game.registry.get("score")}`, { fontSize: "16px", fill: "#0B7" });
      this.keyText   = this.add.text(10, 30, `LLAVE: ✖`, { fontSize: "16px", fill: "#ffb400" });
      this.add.text(600, 30, `NICKNAME: ${this.game.registry.get("nickname")}`, { fontSize: "16px", fill: "#0B7" });

      // Grupos
      this.platforms = this.physics.add.staticGroup();
      this.staticSpikes = this.physics.add.group({ allowGravity: false, immovable: true });
      this.coins = this.physics.add.group({ allowGravity: false, immovable: true });

      // Piso plano
      for (let i = 0; i < 20; i++) {
        this.platforms.create(40 + i * 40, 568, "ground").refreshBody();
      }

      // ==== TRAMPAS ESTÁTICAS ====
      const SPIKE_Y = 520;
      [300, 340, 440, 560, 660, 690, 720].forEach((x) => this._spawnSpike(x, SPIKE_Y));

      // ==== TRAMPA MÓVIL ====
      this.movingSpike = this.physics.add.image(500, SPIKE_Y, "trap");
      this.movingSpike.setImmovable(true);
      this.movingSpike.body.allowGravity = false;
      this.movingSpike.setDepth(11);
      this.movingSpike.body.setSize(22, 18).setOffset(0, 2);
      this.tweens.add({
        targets: this.movingSpike,
        x: { from: 430, to: 610 },
        duration: 1600,
        ease: "Sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // Monedas
      this.anims.create({ key: "spin", frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
      [[250, 500], [520, 485], [740, 500]].forEach(([x, y]) => this.coins.create(x, y, "coin").play("spin"));

      // Llave (textura generada)
      const g = this.add.graphics();
      g.fillStyle(0xffd54a, 1);
      g.fillCircle(0, 0, 6);
      g.fillRect(6, -2, 12, 4);
      g.fillRect(16, -4, 4, 8);
      g.generateTexture("key_tex_lvl4", 24, 16);
      g.destroy();

      this.key = this.physics.add.image(585, 500, "key_tex_lvl4");
      this.key.setDepth(9);
      this.key.body.allowGravity = false;
      this.key.body.setSize(20, 14).setOffset(2, 1);

      // Puertas
      const doorY = 500
      this.doorA = this.add.image(720, doorY, "door").setDepth(5);
      this.doorB = this.add.image(760, doorY, "door").setDepth(5);
      this.doorC = this.add.image(800, doorY, "door").setDepth(5);
      this.add.text(708, doorY - 48, "A", { fontSize: "14px", fill: "#fff" });
      this.add.text(748, doorY - 48, "B", { fontSize: "14px", fill: "#fff" });
      this.add.text(788, doorY - 48, "C", { fontSize: "14px", fill: "#fff" });

      // Sensores (zonas de interacción)
      this.doorSensorA = this.add.zone(720, doorY, 44, 64); this.physics.add.existing(this.doorSensorA, true);
      this.doorSensorB = this.add.zone(760, doorY, 44, 64); this.physics.add.existing(this.doorSensorB, true);
      this.doorSensorC = this.add.zone(800, doorY, 44, 64); this.physics.add.existing(this.doorSensorC, true);

      // Jugador
      this.player = this.physics.add.sprite(100, 500, "hero");
      this.player.setCollideWorldBounds(true);
      // hitbox más “limpia” para pararse arriba del bloque verde
      this.player.body.setSize(18, 30).setOffset(9, 12);
      this.player.setDepth(10);

      // Animaciones (reutilizando y usando flipX)
      this.anims.create({ key: "run", frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
      this.anims.create({ key: "idle", frames: [{ key: "hero_stopped", frame: 3 }], frameRate: 20 });
      this.anims.create({ key: "sneak", frames: this.anims.generateFrameNumbers("hero_sneaking", { start: 0, end: 5 }), frameRate: 6, repeat: -1 });

      // Input
      this.cursors = this.input.keyboard.createCursorKeys();
      this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

      // Física
      this.physics.add.collider(this.player, this.platforms);

      // Overlaps (con i-frames)
      const fatal = () => !this.isRespawning && this.handleDeath();
      this.physics.add.overlap(this.player, this.staticSpikes, fatal, null, this);
      this.physics.add.overlap(this.player, this.movingSpike, fatal, null, this);

      // Monedas y llave
      this.physics.add.overlap(this.player, this.coins, (_, coin) => this.collectCoin(coin), null, this);
      this.physics.add.overlap(this.player, this.key, () => this.collectKey(), null, this);

      // Puertas
      this.physics.add.overlap(this.player, this.doorSensorA, () => this.enterDoorA(), null, this);
      this.physics.add.overlap(this.player, this.doorSensorB, () => this.enterDoorB(), null, this);
      this.physics.add.overlap(this.player, this.doorSensorC, () => this.enterDoorC(), null, this);

      // Respawn
      this.spawnPoint = new Phaser.Math.Vector2(100, 500);

      // Nota útil si no avanza a Nivel5
      if (!this.scene.get("Nivel5Scene")) {
        console.warn("[Nivel4] Falta registrar Nivel5Scene en el GameConfig.scene");
      }
    }

    // ===== Helpers =====
    _spawnSpike(x, y) {
      const s = this.staticSpikes.create(x, y, "trap");
      s.setDepth(11);
      s.body.setSize(22, 18).setOffset(0, 2); // un poco más pequeña para que el “pincho” mate sin cajas fantasmas
      return s;
    }

    collectCoin(coin) {
      const s = Number(this.game.registry.get("score")) + 10;
      this.game.registry.set("score", s);
      this.scoreText?.setText(`PUNTAJE: ${s}`);
      coin.disableBody(true, true);
    }

    collectKey() {
      if (this.hasKey) return;
      this.hasKey = true;
      this.keyText.setText("LLAVE: ✔");
      this.key.disableBody(true, true);
      const s = Number(this.game.registry.get("score")) + 50;
      this.game.registry.set("score", s);
      this.scoreText?.setText(`PUNTAJE: ${s}`);
    }

    // Puerta A: trampa
    enterDoorA() { this.handleDeath(); }

    // Puerta B: requiere llave → Nivel5
    enterDoorB() {
      if (this.hasKey) {
        const s = Number(this.game.registry.get("score")) + 200;
        this.game.registry.set("score", s);
        this.scoreText?.setText(`PUNTAJE: ${s}`);
        this.scene.start("Nivel5Scene");
      } else {
        this._flash(740, 500, "NECESITAS LLAVE", "#ffb400", 1000);
      }
    }

    // Puerta C: cerrada
    enterDoorC() { this._flash(790, 500, "CERRADA", "#ccc", 800); }

    _flash(x, y, text, color, ms) {
      const t = this.add.text(x, y, text, { fontSize: "12px", fill: color }).setDepth(20);
      this.time.delayedCall(ms, () => t.destroy());
    }

    handleDeath() {
      const d = Number(this.game.registry.get("deathCount")) + 1;
      this.game.registry.set("deathCount", d);
      this.deathText?.setText(`MUERTES: ${d}`);

      // i-frames y pequeño destello
      this.isRespawning = true;
      this.player.setVelocity(0, 0);
      this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
      this.player.setAlpha(0.4);
      this.time.delayedCall(this.iframesMs, () => {
        this.isRespawning = false;
        this.player.setAlpha(1);
      });
    }

    update() {
      const onGround = this.player.body.blocked.down || this.player.body.touching.down;

      if (this.cursors.left.isDown) {
        const speed = this.shiftKey.isDown ? -90 : -180;
        this.player.setVelocityX(speed);
        this.player.setFlipX(true);
        this.player.anims.play(this.shiftKey.isDown ? "sneak" : "run", true);
      } else if (this.cursors.right.isDown) {
        const speed = this.shiftKey.isDown ? 90 : 180;
        this.player.setVelocityX(speed);
        this.player.setFlipX(false);
        this.player.anims.play(this.shiftKey.isDown ? "sneak" : "run", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("idle", true);
      }

      if (this.cursors.up.isDown && onGround) this.player.setVelocityY(-330);

      // caída al vacío
      if (this.player.y > 650 && !this.isRespawning) this.handleDeath();
    }
  }

  export { Nivel4Scene };
