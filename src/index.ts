import { vec3 } from "gl-matrix";

import Camera from "./components/Camera";
import DeviceHandler from "./components/DeviceHandler";
import WebGL from "./components/WebGL";
import Buffer from "./components/WebGL/Buffer";
import Program from "./components/WebGL/Program";
import Display from "./components/Display";

import Model from "./objects/Base/Model";
import Box from "./objects/Box";
import Plane from "./objects/Plane";

import MAIN_FRAGMENT_SHADER from "./shaders/Main/FragmentShader";
import MAIN_VERTEX_SHADER from "./shaders/Main/VertexShader";

const main = () => {
  try {
    const webGl = new WebGL();
    const canvas = webGl.getCanvas();
    const gl = webGl.getContext();
    const mainDisplay = new Display(document.getElementById("mainDisplay"));
    const devDisplay = new Display(document.getElementById("devDisplay"));

    // TODO move this somewhere better and more accessible
    const programs: Program[] = [
      new Program(gl, MAIN_VERTEX_SHADER, MAIN_FRAGMENT_SHADER)
    ];
    const objects: Model[] = [
      new Plane({ x: 0, y: -5, z: 0 }, { x: 100, y: 0, z: 100 }, 1),
      new Box({ x: 0, y: 0, z: -20 }, { x: 10, y: 10, z: 10 }, 1)
    ];
    const buffers: Buffer[] = [new Buffer(gl, programs[0].getProgram())];
    const cameras: Camera[] = [new Camera(canvas, vec3.fromValues(0, 0, 0))];
    const deviceHandler = new DeviceHandler(gl, canvas, cameras[0]);

    // TODO move this to another function - we need setup and run
    const interval = 1000 / 120;
    let startTime = 0;

    const loop = (timestamp: number) => {
      const elapsedTime = timestamp - startTime; // compute time since last frame
      // const fps = 1 / (elapsedTime * 0.001); // compute frames per second

      if (elapsedTime > interval) {
        deviceHandler.handleEvents({ camera: cameras[0] });

        startTime = timestamp;

        if (
          !deviceHandler.getIsPaused() &&
          // remove ! for dev rendering
          !deviceHandler.getIsDevRequestingFrameRender()
        ) {
          gl.clearColor(0.75, 0.85, 0.8, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

          objects.forEach(o => {
            buffers[0].draw(gl, cameras[0], o);
          });

          devDisplay.renderText(`
            <p>Camera X: ${cameras[0].getPosition()[0]}</p>
            <p>Camera Y: ${cameras[0].getPosition()[1]}</p>
            <p>Camera Z: ${cameras[0].getPosition()[2]}</p>
          `);

          mainDisplay.clearText();
        }
      }

      requestAnimationFrame(loop);
    };

    loop(0);
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", main);
