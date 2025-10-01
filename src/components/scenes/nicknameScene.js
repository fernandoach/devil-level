import Phaser from "phaser";

class NickNameScene extends Phaser.Scene {
      constructor() {
        super("NickNameScene");
      }

      preload() {}

      create() {
        this.add.text(400, 100, "Enter your Nickname:", {
          fontSize: "24px",
          color: "#ffffff",
        }).setOrigin(0.5);

        // Input de HTML dentro del canvas
        const input = this.add.dom(400, 200, "input", {
          type: "text",
          name: "nickname",
          fontSize: "20px",
          padding: "5px",
        });

        const button = this.add.dom(400, 260, "button", {
          fontSize: "18px",
          padding: "5px 10px",
        }, "Start");

        button.addListener("click");
        button.on("click", () => {
          const nickname = input.node.value;
          if (nickname.trim() !== "") {
            this.game.registry.set("nickname", nickname)
            this.game.registry.set("deathCount", 0);
            this.game.registry.set("score", 0);
            this.scene.start("Nivel1Scene");
          }
        });
      }
    }


    export { NickNameScene }