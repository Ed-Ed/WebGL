import { Position, Size } from "../types";
import Model from "./Base/Model";

export default class Box extends Model {
  constructor(position: Position, size: Size, uv: number) {
    super(position);

    const widthRadius = size.x / 2;
    const heightRadius = size.y / 2;
    const depthRadius = size.z / 2;

    this.vertices = [
      // top
      position.x - widthRadius,
      position.y + heightRadius,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y + heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y + heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y + heightRadius,
      position.z - depthRadius,

      // left
      position.x - widthRadius,
      position.y + heightRadius,
      position.z + depthRadius,
      position.x - widthRadius,
      position.y - heightRadius,
      position.z + depthRadius,
      position.x - widthRadius,
      position.y - heightRadius,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y + heightRadius,
      position.z - depthRadius,

      // right
      position.x + widthRadius,
      position.y + heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y - heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y - heightRadius,
      position.z - depthRadius,
      position.x + widthRadius,
      position.y + heightRadius,
      position.z - depthRadius,

      // front
      position.x + widthRadius,
      position.y + heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y - heightRadius,
      position.z + depthRadius,
      position.x - widthRadius,
      position.y - heightRadius,
      position.z + depthRadius,
      position.x - widthRadius,
      position.y + heightRadius,
      position.z + depthRadius,

      // back
      position.x + widthRadius,
      position.y + heightRadius,
      position.z - depthRadius,
      position.x + widthRadius,
      position.y - heightRadius,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y - heightRadius,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y + heightRadius,
      position.z - depthRadius,

      // bottom
      position.x - widthRadius,
      position.y - heightRadius,
      position.z - depthRadius,
      position.x - widthRadius,
      position.y - heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y - heightRadius,
      position.z + depthRadius,
      position.x + widthRadius,
      position.y - heightRadius,
      position.z - depthRadius
    ];

    this.color = [];
    for (let i = 0; i < 24; i += 1) {
      this.color.push(100 / 255);
      this.color.push(50 / 255);
      this.color.push(100 / 255);
    }

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

      // left
      0,
      0,
      uv,
      0,
      uv,
      uv,
      0,
      uv,

      // right
      uv,
      uv,
      0,
      uv,
      0,
      0,
      uv,
      0,

      // front
      uv,
      uv,
      uv,
      0,
      0,
      0,
      0,
      uv,

      // back
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

      // left
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
      0,
      0,

      // right
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
      0,

      // front
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
      0,
      1,

      // back
      0,
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

      // left
      5,
      4,
      6,
      6,
      4,
      7,

      // right
      8,
      9,
      10,
      8,
      10,
      11,

      // front
      13,
      12,
      14,
      15,
      14,
      12,

      // back
      16,
      17,
      18,
      16,
      18,
      19,

      // bottom
      21,
      20,
      22,
      22,
      20,
      23
    ];
  }
}
