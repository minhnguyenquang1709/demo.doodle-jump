import {
  Sprite,
  Texture,
  Text,
  FederatedPointerEvent,
  Point,
  Assets,
} from "pixi.js";
import { BaseScreen } from "./components/BaseScreen";
import { GameConstants } from "./GameConstants";
import { Player } from "./components/Player";
import { Platform } from "./components/Platform";
import { Enemy } from "./components/Enemy";
import { emitter } from "./Game";
import { sound } from "@pixi/sound";
import { castRay, checkIntersectHorizontalEdge } from "./utils/Ray";

export class DoodleGameplayScreen extends BaseScreen {
  // manage resources
  player: Player;
  gameObjects: Sprite[];
  touching: boolean;
  isPaused: boolean;
  touchLocation: Point;
  score: number;
  prerenderMapMidPoint: number; // increase when screen rolls, reset if >= currentMapMidPoint and trigger generate new map
  scoreCounter: Text;
  temperature: number;

  constructor() {
    super();

    this.gameObjects = [];
    this.touching = false;
    this.isPaused = false;
    this.touchLocation = new Point();
    this.score = 0;
    this.prerenderMapMidPoint = -GameConstants.WORLD_HEIGHT / 2;

    this.initUI();
    this.initCharacter();
    this.initEvents();
    this.initMap();
  }

  // init
  initUI() {
    // background
    const bg = new Sprite(Assets.get("bg"));
    bg.width = GameConstants.WORLD_WIDTH;
    bg.height = GameConstants.WORLD_HEIGHT;
    this.addChild(bg);

    // touch area
    const leftTouchArea = new Sprite(Texture.WHITE);
    leftTouchArea.width = GameConstants.WORLD_WIDTH / 2;
    leftTouchArea.height = GameConstants.WORLD_HEIGHT;
    leftTouchArea.tint = "#000000";
    leftTouchArea.position.x = 0;
    leftTouchArea.position.y = 0;
    leftTouchArea.alpha = 0;
    this.addChild(leftTouchArea);

    const rightTouchArea = new Sprite(Texture.WHITE);
    rightTouchArea.width = GameConstants.WORLD_WIDTH / 2;
    rightTouchArea.height = GameConstants.WORLD_HEIGHT;
    rightTouchArea.tint = "#FFFFFF";
    rightTouchArea.position.x = GameConstants.WORLD_WIDTH / 2;
    rightTouchArea.position.y = 0;
    rightTouchArea.alpha = 0;
    this.addChild(rightTouchArea);

    this.scoreCounter = new Text({
      text: `Score: ${this.score}`,
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "#DA6600",
        align: "center",
      },
    });
    this.scoreCounter.zIndex = 1;
    this.addChild(this.scoreCounter);
  }

  initCharacter() {
    const player = new Player(Assets.get("character"));
    player.position.x = GameConstants.WORLD_WIDTH / 2;
    player.position.y = GameConstants.WORLD_HEIGHT / 2;
    this.player = player;
    this.player.zIndex = 1;

    this.addChild(this.player);
  }

  initEvents() {
    this.eventMode = "static";

    this.on("pointerdown", this.onTouchDown.bind(this));
    this.on("pointerup", this.onTouchUp.bind(this));

    document.addEventListener("keydown", (e) => {
      this.onKeydown(e);
    });
    document.addEventListener("keyup", () => {
      this.touching = false;
    });
  }

  initMap() {
    this.generateMap(GameConstants.WORLD_HEIGHT, 0);
    this.generateMap(
      -GameConstants.PLATFORM_DISTANCE_MIN,
      -GameConstants.WORLD_HEIGHT
    );
  }

  // event
  onTouchDown(event: FederatedPointerEvent) {
    // console.log("touched down");
    this.touching = true;

    // get touch location
    this.touchLocation.set(event.global.x, event.global.y);
  }

  onTouchUp() {
    this.touching = false;
  }

  onKeydown(e: globalThis.KeyboardEvent) {
    if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
      // console.log("going left");
      this.touching = true;

      // get touch location
      this.touchLocation.set(GameConstants.WORLD_WIDTH / 2 - 5, 0);
      // if(event.key == 'A' || event.key == 'a' || event.key = '')
    } else if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
      // console.log("going right");
      this.touching = true;

      // get touch location
      this.touchLocation.set(GameConstants.WORLD_WIDTH / 2 + 5, 0);
      // if(event.key == 'A' || event.key == 'a' || event.key = '')
    }
  }

  // factory
  async generateMap(start: number, end: number) {
    let y: number = start;
    let level: number =
      this.score == 0 ? 0 : this.score < 9000 ? 1 : this.score < 15000 ? 2 : 3;
    let safe: number = 0;
    let moving: number = 0;
    let broken: number = 0;
    let threshold: number;

    let safeCheck: number = 0;
    let enemyCheck: number = 0;

    switch (level) {
      case 0:
        safe = 0.5;
        broken = 0.5;
        break;
      case 2:
        safe = 0.7;
        moving = 0.15;
        broken = 0.15;
        break;
      case 3:
        safe = 0.6;
        moving = 0.1;
        broken = 0.25;
        break;
      default: // level 1
        safe = 0.85;
        moving = 0.1;
        broken = 0.05;
        break;
    }
    while (y > end) {
      threshold = Math.random();
      // safe - moving - broken - enemy
      let obj: Enemy | Platform;
      if (threshold <= safe) {
        // safe platform
        obj = this.generatePlatform("safe");
      } else if (threshold > safe && threshold <= safe + moving) {
        // moving platform
        obj = this.generatePlatform("moving");
      } else if (
        threshold > safe + moving &&
        threshold <= safe + moving + broken
      ) {
        // broken platform
        if (safeCheck >= 2) {
          obj =
            Math.random() < 0.5
              ? this.generatePlatform("safe")
              : this.generatePlatform("moving");
          safeCheck = 0;
        } else {
          obj = this.generatePlatform("broken");
        }
      } else {
        // enemy
        if (enemyCheck >= 1) {
          console.log("safeCheck = ", safeCheck);
          obj =
            Math.random() < 0.4
              ? this.generatePlatform("safe")
              : this.generatePlatform("moving");
          enemyCheck = 0;
        } else {
          if (!this.player.isSuperJump) obj = this.generateEnemy();
        }
      }

      // if 3 broken platform || 2 enemy objects in a row -> make the next one safe
      if (obj instanceof Platform && obj.isBroken) safeCheck++;
      if (obj instanceof Enemy) enemyCheck++;

      // null check
      if (!obj) continue;

      obj.position.y = y;
      this.gameObjects.push(obj);
      this.addChild(obj);

      y -=
        GameConstants.PLATFORM_HEIGHT +
        GameConstants.PLATFORM_DISTANCE_MIN +
        Math.random() * GameConstants.PLATFORM_DISTANCE_MAX;
    }
  }

  generatePlatform(type: string): Platform {
    let newPlatform: Platform;
    switch (type) {
      case "moving":
        newPlatform = new Platform(Assets.get("moving_platform"));
        newPlatform.isMoving = true;
        break;
      case "broken":
        newPlatform = new Platform(Assets.get("broken_platform"), true);
        // newPlatform.isBroken = true;
        break;
      default:
        newPlatform = new Platform(Assets.get("safe_platform"));
        break;
    }
    const x =
      newPlatform.width * newPlatform.anchor.x +
      (GameConstants.WORLD_WIDTH - newPlatform.width) * Math.random();
    newPlatform.position.x = x;

    return newPlatform;
  }

  generateEnemy(): Enemy {
    const enemy = new Enemy();
    const x =
      enemy.width * enemy.anchor.x +
      (GameConstants.WORLD_WIDTH - enemy.width) * Math.random();
    enemy.position.x = x;

    return enemy;
  }

  // process
  processPlayerMove(delta: number) {
    if (!this.touching) return;
    if (this.touchLocation.x >= GameConstants.WORLD_WIDTH / 2) {
      this.player.moveDirection = 1;
      this.player.scale.x = Math.abs(this.player.scale.x);
    } else {
      this.player.moveDirection = -1;
      this.player.scale.x = -Math.abs(this.player.scale.x);
    }
    this.player.processMove(delta);
  }

  processCheckCollision(delta: number, player: Player, object: Sprite) {
    let bounds1 = player.getBounds();
    let bounds2 = object.getBounds();

    const ray = castRay(
      bounds1.x + bounds1.width * this.player.anchor.x,
      bounds1.y + (bounds1.height * 9) / 10,
      delta * this.player.currentFallSpeed
    );
    // console.log("ray ", ray, ' | speed ', delta*this.player.currentFallSpeed);

    let point1 = bounds1.y + bounds1.height;
    // let point2 = bounds1.y + (bounds1.height * 9) / 10;

    if (!this.player.isJumping) {
      // if platform
      if (object instanceof Platform) {
        // if platform has a booster
        if (object.booster != null) {
          // check collision with the booster
          let bounds3 = object.booster.getBounds();
          // if collide with the booster
          const landOnPlatform: boolean = checkIntersectHorizontalEdge(
            ray,
            bounds2.y
          );
          if (
            bounds1.x <= bounds3.x + bounds3.width &&
            bounds1.x + bounds1.width >= bounds3.x &&
            landOnPlatform
            // point1 >= bounds3.y &&
            // point1 <= bounds3.y + bounds3.height
          ) {
            console.log('booster');
            this.player.isSuperJump = true;
            sound.play("superjump");
            this.player.isJumping = true;
            if (object.boosterType == "big") {
              this.player.isSuperJump = true;
              this.player.currentJumpSpeed = GameConstants.JUMP_SPEED * 2;
            }
            if (object.boosterType == "super") {
              this.player.isSuperJump = true;
              this.player.currentJumpSpeed = GameConstants.JUMP_SPEED * 3;
            }
          } else {
            // if not collide with the booster -> collide with platform
            const landOnPlatform: boolean = checkIntersectHorizontalEdge(
              ray,
              bounds2.y + bounds3.height
            );
            if (
              bounds1.x <= bounds2.x + bounds2.width &&
              bounds1.x + bounds1.width >= bounds2.x &&
              landOnPlatform
            ) {
              this.player.texture = Assets.get("character");
              this.player.isJumping = true;
              this.player.currentJumpSpeed = GameConstants.JUMP_SPEED;
            }
          }
        } else {
          // if platform does not have a booster
          // if broken platform
          if (object.isBroken) {
            if (
              bounds1.x <= bounds2.x + bounds2.width &&
              bounds1.x + bounds1.width >= bounds2.x &&
              point1 >= bounds2.y &&
              point1 <= bounds2.y + bounds2.height
            ) {
              this.gameObjects.splice(this.gameObjects.indexOf(object), 1);
              this.removeChild(object);

              return;
            }
          } else {
            // if not broken
            const landOnPlatform: boolean = checkIntersectHorizontalEdge(
              ray,
              bounds2.y
            );
            if (
              bounds1.x <= bounds2.x + bounds2.width &&
              bounds1.x + bounds1.width >= bounds2.x &&
              landOnPlatform
            ) {
              sound.play("jump", { speed: 1.6 });
              this.player.texture = Assets.get("character");
              this.player.isJumping = true;
              this.player.currentJumpSpeed = GameConstants.JUMP_SPEED;
            }
          }
        }
        return;
      }
    }

    // if enemy
    if (object instanceof Enemy) {
      if (
        bounds1.x <= bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width >= bounds2.x &&
        bounds1.y + bounds1.height >= bounds2.y &&
        bounds1.y <= bounds2.y + bounds2.height
      ) {
        sound.play("gameover");
        this.isPaused = true;
        emitter.emit("gameover", this.score);
      }
    }
  }

  processScreenScrollDown(delta: number) {
    if (!this.player.isJumping) return;
    for (const obj of this.gameObjects) {
      // move all current platforms down based on current player speed
      if (obj instanceof Enemy || obj instanceof Platform)
        obj.processFall(delta, this.player.currentJumpSpeed);

      // remove off-screen platforms
      if (
        obj.position.y >
        GameConstants.WORLD_HEIGHT + obj.height * obj.anchor.y
      ) {
        this.removeChild(obj);
        this.gameObjects.splice(this.gameObjects.indexOf(obj), 1);
      }
    }

    // increase score
    let scoreIncrease = 1000;
    this.score += Math.floor(delta * scoreIncrease);
    this.scoreCounter.text = `Score: ${this.score}`;

    // move midpoint down
    this.prerenderMapMidPoint += delta * this.player.currentJumpSpeed;

    // trigger generate new map
    if (this.prerenderMapMidPoint >= GameConstants.WORLD_HEIGHT / 2) {
      this.generateMap(
        -GameConstants.PLATFORM_DISTANCE_MIN,
        -GameConstants.WORLD_HEIGHT
      );

      // reset trigger
      this.prerenderMapMidPoint = -GameConstants.WORLD_HEIGHT / 2;
    }
  }

  update(delta: number) {
    if (this.isPaused) return;
    this.processPlayerMove(delta);

    this.player.update(delta);

    if (this.player.position.y <= GameConstants.WORLD_HEIGHT / 2) {
      this.processScreenScrollDown(delta);
    }

    for (const obj of this.gameObjects) {
      this.processCheckCollision(delta, this.player, obj);
      if (obj instanceof Enemy || obj instanceof Platform) {
        obj.update(delta);
      }
    }

    // remove if fall out of view
    if (
      this.player.position.y >
      GameConstants.WORLD_HEIGHT + this.player.height * this.player.anchor.y
    ) {
      sound.play("gameover");
      emitter.emit("gameover", this.score);
      this.isPaused = true;
      // console.log("removed player");
    }
  }
}
