export default class WebGL {
  protected canvas: HTMLCanvasElement;
  protected gl: WebGLRenderingContext;

  constructor() {
    this.canvas = document.getElementById("game") as HTMLCanvasElement;

    if (!this.canvas) {
      throw new Error("WebGL - Failed to get canvas");
    }

    this.gl = this.canvas.getContext("webgl2");

    if (!this.gl) {
      throw new Error("WebGL - Failed to load WebGL2");
    }

    console.log("WebGL - Running WebGL2 with GLSL 3.0");
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getContext(): WebGLRenderingContext {
    return this.gl;
  }
}
