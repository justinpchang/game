class ControlsUtil {
  constructor() { }

  static encodeControls(scene) {
    const {
      keyboard,
    } = scene.input;

    if (!keyboard) {
      return;
    }

    const controls = {
      leftDown: keyboard.addKey('A').isDown,
      rightDown: keyboard.addKey('D').isDown,
      upDown: keyboard.addKey('W').isDown,
      downDown: keyboard.addKey('S').isDown,
    };

    return {
      controls,
      timestamp: Date.now() || Date.getTime(),
    };
  }

  static hasPayloadChanged(last, current) {
    return JSON.stringify(last.controls) !== JSON.stringify(current.controls);
  }
}

export default ControlsUtil;