import { Assets, Sprite, SpriteOptions, Texture } from "pixi.js";
import { GameConstants } from "../GameConstants";
import { Booster } from "./Booster";

export class Platform extends Sprite {
  isBroken: boolean = false;
  isMoving: boolean = false;
  direction: number = 1;
  booster: Booster = null;
  boosterType: string;

  constructor(options?: SpriteOptions | Texture, checkBroken: boolean = false) {
    super(options);
    this.sortableChildren = true;

    this.anchor.set(0.5);
    // this.scale.set(1);
    this.height = GameConstants.PLATFORM_HEIGHT;
    this.width = GameConstants.PLATFORM_WIDTH;

    const thresholdBooster = Math.random();

    if (checkBroken) {
      this.isBroken = true;
    } else {
      this.boosterType =
        thresholdBooster <= 0.01
          ? "super" // fly
          : thresholdBooster <= 0.5
          ? "big" // high jump
          : "none";

      if (this.boosterType != "none") {
        this.generateBooster(this.boosterType);
      }
    }
  }

  // initiation
  initBooster(color: string): Booster {
    const booster = new Booster(Assets.get("booster"));
    // booster.width = 50;
    // booster.height = 50;
    booster.anchor.set(0.5);
    booster.tint = color;
    booster.zIndex = 1;

    return booster;
  }

  processFall(delta: number, speed: number) {
    this.position.y += delta * speed;
  }

  generateBooster(boosterType: string) {
    if (this.isBroken) return;
    if (boosterType == "super") {
      const booster = this.initBooster("#0000FF");
      booster.texture = Assets.get("jetpack");
      booster.type = boosterType;
      const x =
        this.width * this.anchor.x +
        (Math.random() * this.width - 2 * this.width * this.anchor.x);
      const y =
        -this.height * this.anchor.y - booster.height * booster.anchor.y;

      booster.x = x;
      booster.y = y;
      this.addChild(booster);
      this.booster = booster;
    } else if (boosterType == "big") {
      const booster = this.initBooster("#00FF00");
      booster.type = boosterType;
      const x =
        this.width * this.anchor.x +
        (Math.random() * this.width - 2 * this.width * this.anchor.x);
      const y =
        -this.height * this.anchor.y - booster.height * booster.anchor.y;

      booster.x = x;
      booster.y = y;
      this.addChild(booster);
      this.booster = booster;
    }
  }

  processTurnMovingPlatform() {
    if (
      this.position.x < this.width * this.anchor.x ||
      this.position.x > GameConstants.WORLD_WIDTH - this.width * this.anchor.x
    ) {
      this.direction *= -1;
    }
  }

  processMovingPlatformMove(delta: number) {
    this.x += this.direction * delta * GameConstants.PLATFORM_MOVE_SPEED;
  }

  update(delta: number) {
    if (!this.isMoving) return;

    this.processTurnMovingPlatform();

    this.processMovingPlatformMove(delta);
  }
}
