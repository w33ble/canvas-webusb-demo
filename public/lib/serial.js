class SerialPort {
  constuctor(device) {
    this.device_ = device;
  }

  connect() {
    const readLoop = () => {
      this.device_.transferIn(5, 64).then((result) => {
        this.onReceive(result.data);
        readLoop();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.device_.open()
    .then(() => {
      if (this.device_.configuration === null) {
        return this.device_.selectConfiguration(1);
      }
    })
    .then(() => this.device_.claimInterface(2))
    .then(() => this.device_.selectAlternateInterface(2, 0))
    .then(() => this.device_.controlTransferOut({
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
    return this.device_.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x00,
      index: 0x02
    })
    .then(() => this.device_.close());
  }

  send(data) {
    return this.device_.transferOut(4, data);
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
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new SerialPort(device));
    });
  },

  requestPort() {
    return navigator.usb.requestDevice({ 'filters': filters }).then(dev => new SerialPort(dev));
  },
};
