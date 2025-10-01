import Phaser from "phaser";

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    this.add.text(300, 200, "FIN DEL JUEGO", { fontSize: "60px", fill: "#fff" });
    this.add.text(300, 300, `${this.game.registry.get('nickname')}: ${this.game.registry.get('score')} pts.`, { fontSize: "40px", fill: "#bd1414ff" });
    this.add.text(350, 400, "REINTENTAR", { fontSize: "32px", fill: "#0f0" })
      .setInteractive()
      .on("pointerdown", () => {
        this.game.destroy(true)
        window.location.reload()
      })
  }
}

export { GameOverScene }
