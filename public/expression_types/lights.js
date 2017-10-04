import { View } from 'plugins/canvas/expression_types/view';

export default new View('lights', {
  displayName: 'Lights',
  description: 'Show your data on LEDs',
  modelArgs: ['color', 'size'],
  args: [],
});
