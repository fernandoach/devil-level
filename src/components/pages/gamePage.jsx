import { useEffect } from "react";
import styles from "./gamePage.module.css";
import Phaser from "phaser";
import { MenuScene } from "../scenes/menuScene.js";
import { Nivel1Scene } from "../scenes/nivel1Scene.js";
import { NickNameScene } from "../scenes/nicknameScene.js";
import { GameOverScene } from "../scenes/gameoverScene.js";
import { Nivel2Scene } from "../scenes/nivel2Scene.js";
import { Nivel3Scene } from "../scenes/nivel3Scene.js";
import { Nivel4Scene } from "../scenes/nivel4Scene.js";
import { Nivel5Scene } from "../scenes/nivel5Scene.js";
import { Nivel6Scene } from "../scenes/nivel6Scene.js";

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
      scene: [ MenuScene, NickNameScene, Nivel1Scene, GameOverScene ],
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
      </div>
    </>
  );
}

export { GamePage };
