import { Application, Assets, EventEmitter, Ticker } from "pixi.js";
import { useRef, useEffect, useState } from "react";
import { GameConstants } from "./GameConstants";
// import { GamePlayScreen } from './GamePlayScreen';
import { BaseScreen } from "./components/BaseScreen";
import { DoodleGameplayScreen } from "./GameplayScreen";
import { GameOverScreen } from "./components/GameOver";

export const emitter = new EventEmitter();

const GameWindow = () => {
  // prevent reactjs from re-render the canvas tag
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("hidden");
  // onMount
  useEffect(() => {
    // bypass React's renderer to use PixiJS's renderer instead
    if (!canvasRef.current) return; // null check

    // options for the game screen(the canvas tag)
    const appOpts = {
      width: GameConstants.WORLD_WIDTH,
      height: GameConstants.WORLD_HEIGHT,
      background: "black",
      view: canvasRef.current,
    };

    const app = new Application();
    // make game app
    const initializeGameApp = async () => {
      // load assets into cache before create the game window
      Assets.add([
        {
          alias: "character",
          src: "/doodler.png",
        },
        {
          alias: "star",
          src: "/star_icon.png",
        },
        {
          alias: "bg",
          src: "/background.png",
        },
        {
          alias: "safe_platform",
          src: "/safe_platform.png",
        },
        {
          alias: "broken_platform",
          src: "/broken_platform.png",
        },
        {
          alias: "moving_platform",
          src: "/moving_platform.png",
        },
        {
          alias: "monster",
          src: "/monster.png",
        },
        {
          alias: "booster",
          src: "/spring_coil.png",
        },
        {
          alias: "character_hop",
          src: "/doodler_hop.png",
        },
        {
          alias: "jump",
          src: "/audio/jump.mp3",
        },
        {
          alias: "gameover",
          src: "/audio/gameover.mp3",
        },
        {
          alias: "superjump",
          src: "/audio/super_jump.mp3",
        },
        {
          alias: "jetpack",
          src: "/jetpack.png",
        },
      ]);

      await Assets.load([
        "character",
        "star",
        "bg",
        "safe_platform",
        "broken_platform",
        "moving_platform",
        "monster",
        "booster",
        "character_hop",
        "jump",
        "gameover",
        "superjump",
        "jetpack",
      ]);

      // create and initialize game application
      await app.init(appOpts);

      const gameScreen = new DoodleGameplayScreen();
      app.stage.addChild(gameScreen);

      // update loop
      app.ticker.add((ticker: Ticker) => {
        for (const child of app.stage.children) {
          if (child instanceof BaseScreen) {
            (child as BaseScreen).update(ticker.deltaMS / 1000);
          }
        }
      });
    };

    initializeGameApp();

    // handle gameOverEvent
    const showGameOverScreen = (score: number) => {
      // console.log("message from Game, ", score);

      setScore(score);
      setStatus("");
    };

    // handle retryEvent
    const onRetry = () => {
      setStatus("hidden");
      setScore(0);
      app.stage.removeChildren();
      const gameScreen = new DoodleGameplayScreen();
      app.stage.addChild(gameScreen);
    };

    // const onExit = () => {
    //   app.destroy();
    //   setStatus("hidden");
    //   emitter.removeListener("gameover", showGameOverScreen);
    //   emitter.removeListener("retry", onRetry);
    //   emitter.removeListener("exit", onExit);
    // };

    // add event listener
    emitter.on("gameover", showGameOverScreen);
    emitter.on("retry", onRetry);
    // emitter.on("exit", onExit);

    // unmount
    return () => {
      app.destroy();
      emitter.removeListener("gameover", showGameOverScreen);
      emitter.removeListener("retry", onRetry);
      // emitter.removeListener("exit", onExit);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="h-full m-auto z-0" />
      <GameOverScreen
        score={score}
        className={status + " fixed top-0"}
      ></GameOverScreen>
    </>
  );
};

export default GameWindow;
