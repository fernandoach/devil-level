import { useEffect } from "react";
import styles from "./gamePage.module.css";
import Phaser from "phaser";
import { MenuScene } from "../scenes/menuScene.js";
import { Nivel1Scene } from "../scenes/nivel1Scene.js";
import { NickNameScene, PlayScene } from "../scenes/nicknameScene.js";

function GamePage() {
  const gameTitle = "APOCALYPSE-le";

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#1d1d1d",
      dom: {
        createContainer: true,
      },
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 300 }, debug: false },
      },
      scene: [ Nivel1Scene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <>
      <div className={styles.gameContent}>
        <h2 className="game__title">{gameTitle}</h2>
        <div id="game-container"></div>
      </div>{" "}
    </>
  );
}

export { GamePage };
