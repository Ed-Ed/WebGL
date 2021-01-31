export default `#version 300 es
  precision mediump float;

  // input from vertex shader
  in vec3 fragPos;
  in vec3 fragNormal;
  in vec2 fragTexCoord;
  in vec3 fragColor;

  // camera attributes
  uniform vec3 cameraPos;

  // output to buffer
  out vec4 fragmentColor;

  void main() {
    fragmentColor = vec4(fragColor, 1.0);
  }
`;
