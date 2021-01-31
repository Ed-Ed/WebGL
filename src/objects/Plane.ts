import Model from "./Base/Model";
import { Position, Size } from "../types";

export default class Plane extends Model {
  constructor(position: Position, size: Size, uv: number) {
    super(position);

    const widthRadius = size.x / 2;
    const depthRadius = size.z / 2;

    this.vertices = [
      // top
      position.x - widthRadius,
      position.y,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y,
      position.z - depthRadius,

      // bottom
      position.x - widthRadius,
      position.y,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y,
      position.z - depthRadius
    ];

    this.uv = [
      // top
      0,
      0,
      0,
      uv,
      uv,
      uv,
      uv,
      0,

      // bottom
      uv,
      uv,
      uv,
      0,
      0,
      0,
      0,
      uv
    ];

    this.color = [];
    for (let i = 0; i < 8; i += 1) {
      this.color.push(155 / 255);
      this.color.push(155 / 255);
      this.color.push(155 / 255);
    }

    this.normals = [
      // top
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,

      // bottom
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0
    ];

    this.indices = [
      // top
      0,
      1,
      2,
      0,
      2,
      3,

      // bottom
      5,
      4,
      6,
      6,
      4,
      7
    ];
  }
}
