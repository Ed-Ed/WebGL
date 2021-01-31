import { Position } from "../../types";
import Point from "./Point";

export default class Model extends Point {
  protected vertices: number[];
  protected uv: number[];
  protected color: number[];
  protected normals: number[];
  protected indices: number[];

  constructor(position: Position) {
    super(position);
  }

  public getVertices(): number[] {
    return this.vertices;
  }

  public getUV(): number[] {
    return this.uv;
  }

  public getColor(): number[] {
    return this.color;
  }

  public getNormals(): number[] {
    return this.normals;
  }

  public getIndices(): number[] {
    return this.indices;
  }
}
