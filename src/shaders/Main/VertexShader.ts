export default `#version 300 es
  precision mediump float;

  // input from the buffers
  in vec3 vertPosition;
  in vec3 vertColor;
  in vec3 vertNormal;
  in vec2 vertTexCoord;

  // camera attributes
  uniform mat4 model;
  uniform mat4 view;
  uniform mat4 proj;

  // ouput to fragment shader
  out vec3 fragPos;
  out vec3 fragNormal;
  out vec2 fragTexCoord;
  out vec3 fragColor;

  void main() {
    fragPos = vec3(model * vec4(vertPosition, 1.0f));
    fragNormal =  vec3(model * vec4(vertNormal, 1.0f));
    fragTexCoord = vertTexCoord;
    fragColor = vertColor;

    gl_Position = proj * view * model * vec4(vertPosition, 1.0f);
  }
`;
