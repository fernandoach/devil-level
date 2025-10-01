import Phaser from "phaser";

class Nivel2Scene extends Phaser.Scene {
  constructor() {
    super("Nivel2Scene");
    this.handleDeath = () => {
      const currentDeath = Number(this.game.registry.get("deathCount"))
      this.game.registry.set('deathCount', (currentDeath + 1)); 
      this.deathText.update()
      this.scene.restart();
    }
    this.handleSuccess = () => {
        const currentScore = Number(this.game.registry.get("score"))
        this.game.registry.set('score', (currentScore + 100));
        this.scoreText.update()
        this.scene.start('Nivel3Scene');
    }
  }

  preload() {
    this.load.image("sky", "/images/background.png");
    this.load.image("ground", "/images/ground.png");
  
    this.load.image("trap", "/images/spike.png");

    this.load.image("door", "/images/door.png");
    
    this.load.spritesheet("hero", "/images/hero.png", {
      frameWidth: 36, // 👈 ancho de cada frame en tu sprite
      frameHeight: 42, // 👈 alto de cada frame en tu sprite
    });

    this.load.spritesheet("hero_sneaking", "/images/hero_sneaking.png", {
      frameWidth: 36, // 👈 ancho de cada frame en tu sprite
      frameHeight: 42, // 👈 alto de cada frame en tu sprite
    });

    this.load.spritesheet("hero_stopped", "/images/hero_stopped.png", {
      frameWidth: 36, // 👈 ancho de cada frame en tu sprite
      frameHeight: 42, // 👈 alto de cada frame en tu sprite
    });
  }

  create() {
    
    this.add.image(400, 300, "sky");

    this.deathText = this.add.text(10, 10, `MUERTES: ${this.game.registry.get('deathCount')}`, { fontSize: '16px', fill: '#f11' });
    
    this.scoreText = this.add.text(600, 10, `PUNTAJE: ${this.game.registry.get('score')}`, { fontSize: '16px', fill: '#0B7' });
    
    this.add.text(600, 100, `NICKNAME: ${this.game.registry.get("nickname")}`, { fontSize: '16px', fill: '#0B7' });
    
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    const door = this.physics.add.staticImage(700, 460, "door");
    door.setSize(24, 48).setOffset(0, 0);


    this.player = this.physics.add.sprite(100, 450, "hero");

    // Animaciones
    // Animaciones para hero (movimiento original)
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

    // Animaciones para herostop (estado parado)
    this.anims.create({
      key: "stop",
      frames: this.anims.generateFrameNumbers("herostop", { start: 0, end: 1 }), // Ajusta según frames
      frameRate: 5,
      repeat: -1,
    });

    // Animaciones para hero_sneaking (movimiento sigiloso)
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
    
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    const trap = this.physics.add.staticImage(300, 470, "trap");
    trap.setSize(20, 10); 

    this.physics.add.collider(this.player, trap, this.handleDeath, null, this);

    this.physics.add.overlap(this.player, door, this.handleSuccess, null, this);
    
    this.physics.add.collider(this.player, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      if (this.shiftKey) {
        this.player.setVelocityX(-80);
        this.player.anims.play("sneaking_left", true);
      } else{
        this.player.setVelocityX(-160);
        this.player.anims.play("left", true);
      }
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      if (this.shiftKey) {
        this.player.setVelocityX(80); // Movimiento más lento para sigilo
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
  }
}

export { Nivel2Scene };
