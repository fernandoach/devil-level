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
            console.log("Nickname:", nickname);
            this.scene.start("PlayScene", { nickname });
          }
        });
      }
    }

    class PlayScene extends Phaser.Scene {
      constructor() {
        super("PlayScene");
      }

      init(data) {
        this.nickname = data.nickname || "Player";
      }

      create() {
        this.add.text(400, 300, `Welcome ${this.nickname}!`, {
          fontSize: "32px",
          color: "#00ff00",
        }).setOrigin(0.5);
        this.add.text(350, 300, "Start", { fontSize: "32px", fill: "#0f0" })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Nivel1Scene"))
      }
    }


    export { NickNameScene, PlayScene }