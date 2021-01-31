import { Position } from "../../types";

export default class Point {
  private position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getXPosition(): number {
    return this.position.x;
  }

  public getYPosition(): number {
    return this.position.y;
  }

  public getZPosition(): number {
    return this.position.z;
  }
}
