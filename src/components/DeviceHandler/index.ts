import { log } from "../../services/logger";
import Camera from "../Camera";

enum Device {
  MOBILE = "Mobile",
  TABLET = "Tablet",
  DESKTOP = "Desktop"
}

enum CameraEvent {
  MOVE_FORWARD = "move_forward",
  MOVE_BACKWARD = "move_backward",
  MOVE_LEFT = "move_left",
  MOVE_RIGHT = "move_right"
}

type HandleEventProps = {
  camera: Camera;
};

type KeyUpAssignments = {
  pause?: string;
  devRendering?: string;
};

type KeyDownAssignments = {
  [key: string]: (props: HandleEventProps) => void;
};

export default class DeviceHandler {
  private maxWidth = 1920;
  private maxHeight = 1080;
  private mobileWidth = 414;
  private tabletWidth = 768;

  private keyStates: Record<string, boolean> = {};
  private keyUpAssignments: KeyUpAssignments = {};
  private keyUpKeys: string[];
  private keyDownAssignments: KeyDownAssignments = {};

  private device = Device.DESKTOP;

  private isPointerLockEnabled = false;
  private isPaused = true;
  private isDevRequestingFrameRender = false;

  constructor(
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    camera: Camera
  ) {
    this.init(gl, canvas, camera);

    this.keyUpAssignments = {
      pause: "p",
      devRendering: " "
    };

    this.keyUpKeys = Object.values(this.keyUpAssignments);

    this.keyDownAssignments = {
      w: this.cameraEventHandler(CameraEvent.MOVE_FORWARD),
      a: this.cameraEventHandler(CameraEvent.MOVE_LEFT),
      s: this.cameraEventHandler(CameraEvent.MOVE_BACKWARD),
      d: this.cameraEventHandler(CameraEvent.MOVE_RIGHT)
    };

    window.addEventListener("resize", () => {
      this.initScreen(gl, canvas, camera);
    });
  }

  //
  // Event Handlers
  //
  private pauseEventHandler = () => {
    this.isPaused = !this.isPaused;
  };

  private devRenderEventHandler = () => {
    this.isDevRequestingFrameRender = !this.isDevRequestingFrameRender;
  };

  private cameraEventHandler = (cameraEvent: CameraEvent) => ({
    camera
  }: HandleEventProps) => {
    switch (cameraEvent) {
      case CameraEvent.MOVE_FORWARD:
        camera.moveForward();
        break;
      case CameraEvent.MOVE_BACKWARD:
        camera.moveBack();
        break;
      case CameraEvent.MOVE_LEFT:
        camera.moveLeft();
        break;
      case CameraEvent.MOVE_RIGHT:
        camera.moveRight();
        break;
      default:
        break;
    }
  };

  //
  // Device Initialisation
  //
  private calculateCanvasSize = (canvas: HTMLCanvasElement) => {
    canvas.width =
      window.innerWidth < this.maxWidth ? window.innerWidth : this.maxWidth;
    canvas.height =
      window.innerHeight < this.maxHeight ? window.innerHeight : this.maxHeight;

    if (canvas.width % 2 !== 0) {
      canvas.width -= 1;
    }

    if (canvas.height % 2 !== 0) {
      canvas.height -= 1;
    }
  };

  private calculateDevice = (canvas: HTMLCanvasElement, camera: Camera) => {
    if (canvas.width <= this.mobileWidth) {
      this.device = Device.MOBILE;

      this.initMobileTablet();
    } else if (canvas.width <= this.tabletWidth) {
      this.device = Device.TABLET;

      this.initMobileTablet();
    } else {
      this.device = Device.DESKTOP;

      this.initDesktop(canvas, camera);
    }
  };

  private initScreen = (
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    camera: Camera
  ) => {
    camera.updateAspectRatio(canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  };

  private init = (
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    camera: Camera
  ) => {
    this.calculateCanvasSize(canvas);

    this.initScreen(gl, canvas, camera);

    this.calculateDevice(canvas, camera);
  };

  private initMobileTablet = () => {
    log.info("Mobile / Tablet device was detected");
  };

  private initDesktop = (canvas: HTMLCanvasElement, camera: Camera) => {
    log.info("Desktop device was detected");

    this.initKeyEventHandlers();

    this.initPointerLock(canvas, camera);
  };

  private initKeyEventHandlers = () => {
    window.addEventListener(
      "keydown",
      keyboardEvent => {
        if (!this.keyUpKeys.includes(keyboardEvent.key)) {
          this.keyStates[keyboardEvent.key] = true;
        }
      },
      true
    );

    window.addEventListener(
      "keyup",
      keyboardEvent => {
        if (!this.keyUpKeys.includes(keyboardEvent.key)) {
          this.keyStates[keyboardEvent.key] = false;
        } else {
          if (keyboardEvent.key === this.keyUpAssignments.pause) {
            this.pauseEventHandler();
          } else if (keyboardEvent.key === this.keyUpAssignments.devRendering) {
            this.devRenderEventHandler();
          }
        }
      },
      true
    );
  };

  private initPointerLock = (canvas: HTMLCanvasElement, camera: Camera) => {
    canvas.requestPointerLock = canvas.requestPointerLock;
    document.exitPointerLock = document.exitPointerLock;

    const mouseMoveListener = (camera: Camera) => (mouseEvent: MouseEvent) => {
      if (this.isPointerLockEnabled && !this.isPaused) {
        camera.updateDirection(mouseEvent.movementX, mouseEvent.movementY);
      }
    };

    window.addEventListener("mousemove", mouseMoveListener(camera));

    document.addEventListener("click", () => {
      canvas.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === canvas) {
        this.isPointerLockEnabled = true;
      } else {
        this.isPointerLockEnabled = false;
      }
    });
  };

  //
  // Public Functions
  //
  public handleEvents = (props: HandleEventProps) => {
    Object.entries(this.keyStates).forEach(([key, isKeyPressed]) => {
      if (!this.isPaused && isKeyPressed) {
        if (this.keyDownAssignments[key]) {
          log.info(key, "is pressed");

          this.keyDownAssignments[key](props);
        }
      } else {
        log.info(key, "is no longer being pressed");

        delete this.keyStates[key];
      }
    });
  };

  public getDevice = (): Device => this.device;

  public getIsPaused = (): boolean => this.isPaused;

  public getIsDevRequestingFrameRender = (): boolean =>
    this.isDevRequestingFrameRender;
}
