import { Container } from "pixi.js";

export abstract class BaseScreen extends Container {
  constructor() {
    super();
  }

  abstract update(delta: number): void;

  dispose() {
    this.removeFromParent();
  }
}
