import { serial } from './serial';

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

export function getPort() {
  return serial.getPorts()
  .then((ports) => {
    if (ports.length === 0) return null;

    // connect to existing device
    return ports[0];
  });
}

export function getUpdater(port) {
  if (!port) throw new Error('Must give the updated a port');

  return function updatePort(index, rgb) {
    const view = new Uint8Array(4);
    view[0] = parseInt(index);
    view[1] = parseInt(rgb[0]);
    view[2] = parseInt(rgb[1]);
    view[3] = parseInt(rgb[2]);
    console.log('view', view);
    port.send(view);
  };
}

export function requestPort() {
  return serial.requestPort();
}

export function connect() {
  // connect to usb devices
  return getPort()
  .then((port) => {
    if (port === null) return requestPort();
    return port;
  })
  .then(connectDevice)
  .catch((err) => {
    // debugging
    console.error('Serial err', err);

    throw err;
  });
}
