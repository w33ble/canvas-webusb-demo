import { Arg } from 'plugins/canvas/expression_types/arg';
import { View } from 'plugins/canvas/expression_types/view';

export default new View('lights', {
  displayName: 'Lights',
  description: 'Show your data on LEDs',
  modelArgs: ['color', 'size'],
  args: [
    new Arg('palette', {
      displayName: 'Color palette',
      argType: 'palette',
    }),
  ],
});
