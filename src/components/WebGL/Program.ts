import Shader from "./Shader";

export default class Program {
  private program: WebGLProgram;
  private shader: WebGLShader;

  constructor(
    gl: WebGLRenderingContext,
    vertexShader: string,
    fragmentShader: string
  ) {
    this.program = gl.createProgram();
    this.shader = new Shader(gl, this.program, vertexShader, fragmentShader);
  }

  public getProgram(): WebGLProgram {
    return this.program;
  }

  public getShader(): WebGLShader {
    return this.shader;
  }
}
