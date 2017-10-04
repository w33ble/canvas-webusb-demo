import { h, app } from 'hyperapp';
import { Element } from 'plugins/canvas/elements/element';
import header from './usb_connect.png';
import { requestPort } from '../lib/port_controller';

export default new Element('usbConnect', {
  displayName: 'Connect USB Device',
  description: 'Connect a USB device for use with WebUSB',
  image: header,
  expression: 'render as="usbConnect"',
  render(domNode, config, handlers) {
    app({
      root: domNode,
      state: {
        connected: false,
      },
      actions: {
        connectUsb: () => (update) => {
          requestPort().then(() => update({ connected: true }));
        },
      },
      view: (state, actions) => (
        h('button', {
          onclick: actions.connectUsb,
        }, state.connected ? 'USB Connected!' : 'Connect USB')
      ),
    });

    handlers.done();
  },
});
