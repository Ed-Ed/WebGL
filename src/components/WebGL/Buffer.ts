import Model from "../../objects/Base/Model";
import Camera from "../Camera";

type ShaderAttribLocation = {
  vertexPosition: number;
  vertexColor: number;
  vertexTexCoord: number;
  vertexNormal: number;
};

type ShaderUniformLocation = {
  model: WebGLUniformLocation;
  view: WebGLUniformLocation;
  proj: WebGLUniformLocation;
  cameraPos: WebGLUniformLocation;
};

type BufferObject = {
  vertex: WebGLBuffer;
  color: WebGLBuffer;
  uv: WebGLBuffer;
  normal: WebGLBuffer;
  element: WebGLBuffer;
};

export default class Buffer {
  private mainVertexAttribLocation: ShaderAttribLocation;
  private mainCameraUniformLocation: ShaderUniformLocation;
  private mainBufferObjects: BufferObject;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
    // vertex
    this.mainVertexAttribLocation = {
      vertexPosition: gl.getAttribLocation(program, "vertPosition"),
      vertexColor: gl.getAttribLocation(program, "vertColor"),
      vertexTexCoord: gl.getAttribLocation(program, "vertTexCoord"),
      vertexNormal: gl.getAttribLocation(program, "vertNormal")
    };

    // camera
    this.mainCameraUniformLocation = {
      model: gl.getUniformLocation(program, "model"),
      view: gl.getUniformLocation(program, "view"),
      proj: gl.getUniformLocation(program, "proj"),
      cameraPos: gl.getUniformLocation(program, "cameraPos")
    };

    // buffers
    this.mainBufferObjects = {
      vertex: gl.createBuffer(),
      color: gl.createBuffer(),
      uv: gl.createBuffer(),
      normal: gl.createBuffer(),
      element: gl.createBuffer()
    };
  }

  public draw(gl: WebGLRenderingContext, camera: Camera, object: Model): void {
    // position
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mainBufferObjects.vertex);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(object.getVertices()),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.mainVertexAttribLocation.vertexPosition,
      3,
      gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.mainVertexAttribLocation.vertexPosition);

    // color
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mainBufferObjects.color);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(object.getColor()),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.mainVertexAttribLocation.vertexColor,
      3,
      gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.mainVertexAttribLocation.vertexColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mainBufferObjects.uv);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(object.getUV()),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.mainVertexAttribLocation.vertexTexCoord,
      2,
      gl.FLOAT,
      false,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.mainVertexAttribLocation.vertexTexCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mainBufferObjects.normal);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(object.getNormals()),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.mainVertexAttribLocation.vertexNormal,
      3,
      gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.mainVertexAttribLocation.vertexNormal);

    // if textured then bind texture
    // if (object.getIsTextured()) {
    //  gl.uniform1i(mainUniformLocations[0], 1); // isTextured?
    //  gl.uniform1i(mainUniformLocations[1], 0); // diffuse
    //  gl.uniform1i(mainUniformLocations[2], 1); // normal
    //  gl.uniform1i(mainUniformLocations[3], 2); // depth

    //  const textures = object.getTexture();
    //  gl.activeTexture(gl.TEXTURE0);
    //  gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    //  gl.activeTexture(gl.TEXTURE1);
    //  gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    // } else {
    // gl.uniform1i(mainUniformLocations[0], 0); // isTextured?
    // }

    // gl.activeTexture(gl.TEXTURE2);
    // gl.bindTexture(gl.TEXTURE_2D, frameTexture);

    // material properties
    // gl.uniform1f(mainUniformLocations[4], object.getMaterialProperties()[0]); // shininess

    // camera
    const cameraPosition = camera.getPosition();
    gl.uniformMatrix4fv(
      this.mainCameraUniformLocation.model,
      false,
      camera.getModelMatrix()
    );
    gl.uniformMatrix4fv(
      this.mainCameraUniformLocation.view,
      false,
      camera.getViewMatrix()
    );
    gl.uniformMatrix4fv(
      this.mainCameraUniformLocation.proj,
      false,
      camera.getProjectionMatrix()
    );
    gl.uniform3f(
      this.mainCameraUniformLocation.cameraPos,
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2]
    );

    // light
    // gl.uniformMatrix4fv(mainLightUniformLocations[0], gl.FALSE, light.getMatrix());

    // draw the object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mainBufferObjects.element);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(object.getIndices()),
      gl.STATIC_DRAW
    );
    gl.drawElements(
      gl.TRIANGLES,
      object.getIndices().length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
