class SerialPort {
  constructor(device) {
    this.__device = device;
  }

  connect() {
    const readLoop = () => {
      this.__device.transferIn(5, 64).then((result) => {
        this.onReceive(result.data);
        readLoop();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.__device.open()
    .then(() => {
      if (this.__device.configuration === null) {
        return this.__device.selectConfiguration(1);
      }
    })
    .then(() => this.__device.claimInterface(2))
    .then(() => this.__device.selectAlternateInterface(2, 0))
    .then(() => this.__device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: 0x02
    }))
    .then(() => {
      readLoop();
    });
  }

  disconnect() {
    return this.__device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x00,
      index: 0x02
    })
    .then(() => this.__device.close());
  }

  send(data) {
    return this.__device.transferOut(4, data);
  }
}

// all the arduinos
const filters = [
  { 'vendorId': 0x2341, 'productId': 0x8036 },
  { 'vendorId': 0x2341, 'productId': 0x8037 },
  { 'vendorId': 0x2341, 'productId': 0x804d },
  { 'vendorId': 0x2341, 'productId': 0x804e },
  { 'vendorId': 0x2341, 'productId': 0x804f },
  { 'vendorId': 0x2341, 'productId': 0x8050 },
];

export const serial = {
  getPorts() {
    if (!navigator.usb) return Promise.reject(new Error('navigator.usb is not defined'));

    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new SerialPort(device));
    });
  },

  requestPort() {
    return navigator.usb.requestDevice({ 'filters': filters }).then(dev => new SerialPort(dev));
  },
};
