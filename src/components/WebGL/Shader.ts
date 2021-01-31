export default class Shader {
  constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    vertexShaderString: string,
    fragmentShaderString: string
  ) {
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    // create shaders
    const vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);

    // provide shaders with a source
    gl.shaderSource(vertexShader, vertexShaderString);
    gl.shaderSource(fragmentShader, fragmentShaderString);

    // compile shaders and throw any errors
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Shader - Vertex shader failed to compile\n${gl.getShaderInfoLog(
          vertexShader
        )}`
      );
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Shader - Fragment shader failed to compile\n${gl.getShaderInfoLog(
          fragmentShader
        )}`
      );
    }

    // attach shaders to program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link and validate program and throw any errors
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        `Shader -Failed to link programs\n${gl.getProgramInfoLog(program)}`
      );
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      throw new Error(
        `Shader - Failed to validate programs\n${gl.getProgramInfoLog(program)}`
      );
    }

    gl.useProgram(program);
  }
}
