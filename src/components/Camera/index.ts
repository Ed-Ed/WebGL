import { glMatrix, mat4, vec3 } from "gl-matrix";

export default class Camera {
  private cameraPosition: vec3;
  private cameraAspectRatio = 0;
  private cameraFOV = glMatrix.toRadian(45);
  private cameraTarget: vec3;
  private cameraFront = vec3.fromValues(0, 0, -1);
  private cameraUp = vec3.fromValues(0, 1, 0);
  private cameraPitch = 0;
  private cameraYaw = -90;
  private cameraCursorSpeed = 0.03;
  private cameraKeySpeed = vec3.fromValues(0.3, 0.3, 0.3);
  private cameraWS = vec3.create();
  private cameraAD = vec3.create();

  private modelMatrix = mat4.create();
  private viewMatrix = mat4.create();
  private projectionMatrix = mat4.create();

  private isNoClip = false;

  constructor(canvas: HTMLCanvasElement, position: vec3) {
    // set the default camera position
    this.cameraPosition = position;

    // set the aspect ratio based on the canvas
    this.cameraAspectRatio = canvas.clientWidth / canvas.clientHeight;

    // set target based on position
    this.cameraTarget = vec3.fromValues(
      position[0],
      position[1],
      position[2] - 1
    );

    // set default W S position
    vec3.multiply(this.cameraWS, this.cameraFront, this.cameraKeySpeed);

    // set default A D position
    vec3.cross(this.cameraAD, this.cameraFront, this.cameraUp);
    vec3.normalize(this.cameraAD, this.cameraAD);
    vec3.multiply(this.cameraAD, this.cameraAD, this.cameraKeySpeed);

    // set default matrixes
    mat4.identity(this.modelMatrix);
    mat4.lookAt(
      this.viewMatrix,
      this.cameraPosition,
      this.cameraTarget,
      this.cameraUp
    );
    mat4.perspective(
      this.projectionMatrix,
      this.cameraFOV,
      this.cameraAspectRatio,
      0.1,
      1000.0
    );
  }

  private update() {
    // stop movement past 89 degrees
    if (this.cameraPitch > 89.0) {
      this.cameraPitch = 89.0;
    } else if (this.cameraPitch < -89.0) {
      this.cameraPitch = -89.0;
    }

    // TODO optimise
    // update direction
    if (this.isNoClip === true) {
      vec3.normalize(this.cameraFront, [
        Math.cos(glMatrix.toRadian(this.cameraPitch)) *
          Math.cos(glMatrix.toRadian(this.cameraYaw)),
        Math.sin(glMatrix.toRadian(this.cameraPitch)),
        Math.cos(glMatrix.toRadian(this.cameraPitch)) *
          Math.sin(glMatrix.toRadian(this.cameraYaw))
      ]);
    } else {
      const cameraFront1 = vec3.fromValues(0, 0, -1);
      const cameraFront2 = vec3.fromValues(0, 0, -1);

      vec3.normalize(cameraFront1, [
        Math.cos(glMatrix.toRadian(this.cameraPitch)) *
          Math.cos(glMatrix.toRadian(this.cameraYaw)),
        Math.sin(glMatrix.toRadian(this.cameraPitch)),
        Math.cos(glMatrix.toRadian(this.cameraPitch)) *
          Math.sin(glMatrix.toRadian(this.cameraYaw))
      ]);
      vec3.normalize(cameraFront2, [
        Math.cos(glMatrix.toRadian(this.cameraYaw)),
        Math.sin(glMatrix.toRadian(this.cameraPitch)),
        Math.sin(glMatrix.toRadian(this.cameraYaw))
      ]);

      this.cameraFront = [cameraFront2[0], cameraFront1[1], cameraFront2[2]];
    }

    // update WS
    if (this.isNoClip === true) {
      vec3.multiply(this.cameraWS, this.cameraFront, this.cameraKeySpeed);
    } else {
      vec3.multiply(
        this.cameraWS,
        vec3.fromValues(this.cameraFront[0], 0, this.cameraFront[2]),
        this.cameraKeySpeed
      );
    }

    // update AD
    vec3.cross(this.cameraAD, this.cameraFront, this.cameraUp);
    vec3.normalize(this.cameraAD, this.cameraAD);
    vec3.multiply(this.cameraAD, this.cameraAD, this.cameraKeySpeed);

    // caculate camera target
    vec3.add(this.cameraTarget, this.cameraPosition, this.cameraFront);

    // update mvp
    // mat4.identity(this.modelMatrix); TODO pretty sure this isn't needed but check
    mat4.lookAt(
      this.viewMatrix,
      this.cameraPosition,
      this.cameraTarget,
      this.cameraUp
    );
    mat4.perspective(
      this.projectionMatrix,
      this.cameraFOV,
      this.cameraAspectRatio,
      0.1,
      1000.0
    );
  }

  public getModelMatrix() {
    return this.modelMatrix;
  }

  public getViewMatrix() {
    return this.viewMatrix;
  }

  public getProjectionMatrix() {
    return this.projectionMatrix;
  }

  public getPosition() {
    return this.cameraPosition;
  }

  public moveForward() {
    vec3.add(this.cameraPosition, this.cameraPosition, this.cameraWS);
    this.update();
  }

  public moveBack() {
    vec3.subtract(this.cameraPosition, this.cameraPosition, this.cameraWS);
    this.update();
  }

  public moveLeft() {
    vec3.subtract(this.cameraPosition, this.cameraPosition, this.cameraAD);
    this.update();
  }

  public moveRight() {
    vec3.add(this.cameraPosition, this.cameraPosition, this.cameraAD);
    this.update();
  }

  public updateDirection(yaw: number, pitch: number) {
    this.cameraYaw += yaw * this.cameraCursorSpeed;
    this.cameraPitch -= pitch * this.cameraCursorSpeed;
    this.update();
  }

  public updateAspectRatio(canvas: HTMLCanvasElement) {
    this.cameraAspectRatio = canvas.width / canvas.height;
    this.update();
  }
}
