import { 
  TilingSprite,
  Assets
} from "pixi.js";

export class Background extends TilingSprite{
  constructor(){
    const backgroundTexture = Assets.get('bg_tile');
    super(backgroundTexture);
  }

  onMove(delta: number, currentJumpSpeed: number): void{
    this.tilePosition.y += delta*currentJumpSpeed;
  }
}