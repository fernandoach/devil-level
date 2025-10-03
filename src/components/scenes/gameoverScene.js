import Phaser from "phaser";

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  async create() {
    const nickname = this.game.registry.get("nickname");
    const score = this.game.registry.get("score");
    const deaths = this.game.registry.get("deathCount") || 0; // si no existe, lo ponemos en 0
    const _id = this.game.registry.get("_id") || "68dfe41c4a530e04391ffec2"; // ejemplo de id por defecto

    // === POST al backend ===
    try {
      const response = await fetch("http://localhost:3000/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    _id,
    nickname,
    score,
    deaths,
  }),
});

      if (!response.ok) {
        throw new Error(`Error en el POST: ${response.status}`);
      }

      const result = await response.json();
      console.log("Respuesta del servidor:", result);
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }

    // === Textos en pantalla ===
    this.add.text(300, 200, "FIN DEL JUEGO", {
      fontSize: "60px",
      fill: "#fff",
    });

    this.add.text(
      300,
      300,
      `${nickname}: ${score} pts.`,
      { fontSize: "40px", fill: "#bd1414ff" }
    );

    this.add
      .text(350, 400, "REINTENTAR", {
        fontSize: "32px",
        fill: "#0f0",
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.game.destroy(true);
        window.location.reload();
      });
  }
}

export { GameOverScene };
