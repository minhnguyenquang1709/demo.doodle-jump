import { Sprite, SpriteOptions, Texture } from "pixi.js";
import { GameConstants } from "../GameConstants";

export class Booster extends Sprite {
  type: string;

  constructor(options?: SpriteOptions | Texture) {
    super(options);

    this.type = "none";
    this.height = GameConstants.BOOSTER_HEIGHT;
    this.width = GameConstants.BOOSTER_WIDTH;
  }
}
