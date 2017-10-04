import { serial } from '../../lib/serial';

function connectDevice(port) {
  return port.connect()
  .then(() => {
    // debugging
    port.onReceive = (data) => {
      if (!TextDecoder) return;
      const textDecoder = new TextDecoder();
      console.log(textDecoder.decode(data));
    };

    // debugging
    port.onReceiveError = err => console.error('onReceiveError', err);

    return port;
  }, err => console.error('connect err', err));
}

export default function connect() {
  // connect to usb devices
  return serial.getPorts()
  .then((ports) => {
    if (ports.length === 0) {
      // no existing devices, request a device port
      return serial.requestPort();
    }

    // connect to existing device
    return ports[0];
  })
  .then(connectDevice)
  .then((port) => {
    return function updatePort(index, rgb) {
      if (!port) return;

      const view = new Uint8Array(4);
      view[0] = parseInt(index);
      view[1] = parseInt(rgb[0]);
      view[2] = parseInt(rgb[1]);
      view[3] = parseInt(rgb[2]);
      console.log('view', view);
      port.send(view);
    };
  })
  .catch((err) => {
    // debugging
    console.error('Serial err', err);

    throw err;
  });
}
