import { Assets, Sprite } from "pixi.js";
import { GameConstants } from "../GameConstants";

export class Enemy extends Sprite {
  direction: number = 1;

  constructor() {
    super(Assets.get("monster"));

    this.width = 70;
    this.height = 60;
    this.anchor.set(0.5);
    // this.scale.set(1);
  }

  processFall(delta: number, speed: number) {
    this.position.y += delta * speed;
  }

  update(delta: number) {
    // enemy movement
    this.position.x +=
      (this.direction * delta * GameConstants.CHAR_MOVE_SPEED) / 1.5;
    if (
      this.position.x <= this.width * this.anchor.x ||
      this.position.x >= GameConstants.WORLD_WIDTH - this.width * this.anchor.x
    ) {
      this.direction *= -1;
    }
  }
}
