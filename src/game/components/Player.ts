import { Sprite, Texture, SpriteOptions, Assets } from "pixi.js";
import { GameConstants } from "../GameConstants";

export class Player extends Sprite {
  moveDirection: number;
  currentJumpSpeed: number;
  currentFallSpeed: number;
  isSuperJump: boolean;
  isJumping: boolean;

  constructor(options: SpriteOptions | Texture) {
    super(options);

    this.height = GameConstants.CHAR_HEIGHT;
    this.width = GameConstants.CHAR_WIDTH;
    this.tint = "#FFFF00";
    this.anchor.set(0.5, 1);

    this.isSuperJump = false;

    this.moveDirection = 1;
    this.currentFallSpeed = 0;
    this.currentJumpSpeed = GameConstants.JUMP_SPEED;
  }

  // process
  processMove(delta: number) {
    this.position.x +=
      delta * GameConstants.CHAR_MOVE_SPEED * this.moveDirection;

    // ensure player stay in view
    if (this.position.x < 0) this.position.x = GameConstants.WORLD_WIDTH;
    if (this.position.x > GameConstants.WORLD_WIDTH) this.position.x = 0;
  }

  processFall(delta: number) {
    if (this.isJumping) return;

    this.position.y += delta * this.currentFallSpeed;
    this.currentFallSpeed +=
      delta * GameConstants.FALL_SPEED * GameConstants.ACCELERATOR;
    // console.log("current fall speed: ", this.currentFallSpeed);
  }

  processJump(delta: number) {
    if (!this.isJumping) return;

    this.position.y -= delta * this.currentJumpSpeed;
    this.currentJumpSpeed -=
      delta * GameConstants.JUMP_SPEED * GameConstants.DECELERATOR;

    if (this.position.y <= GameConstants.WORLD_HEIGHT / 2)
      this.position.y = GameConstants.WORLD_HEIGHT / 2;

    // finish a jump
    if (this.currentJumpSpeed <= 0) {
      this.isSuperJump = false;
      this.isJumping = false;
      this.currentFallSpeed = 0;
      this.currentJumpSpeed = GameConstants.JUMP_SPEED;
      this.texture = Assets.get("character_hop");
    }
  }

  update(delta: number) {
    // this.processMove(delta);
    this.processFall(delta);
    this.processJump(delta);
    // this.processFly(delta);
  }
}
