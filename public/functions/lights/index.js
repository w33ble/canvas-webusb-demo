import chroma from 'chroma-js';
// TODO: internalize this wrapper
import Fn from '../../../../kibana-canvas/common/functions/fn.js';
import { connect, getUpdater } from '../../lib/port_controller';

export default new Fn({
  name: 'lights',
  type: 'render',
  fn(context) {
    const ledCount = 8;

    // get the colors from the plot context
    const { data, options } = context.value;
    const records = data.map(rec => ({
      name: rec.label,
      color: rec.color,
      size: rec.data[0][2].size,
    }));

    // find the max brightness, to scale all values to a percentage
    const maxVal = records.reduce((range, rec) => {
      if (!range) return rec.size;
      return Math.max(range, rec.size);
    }, -Infinity);

    // turn each row into an object describing how to light up each LED
    const values = records.map((rec, i) => {
      const color = rec.color || options.colors[i];

      if (!color || i >= ledCount) return null;

      return {
        id: i,
        name: rec.name,
        brightness: Math.round(rec.size / maxVal * 100) / 100,
        color,
      };
    }).filter(Boolean);

    return connect()
    .then(port => getUpdater(port))
    .then((setLights) => {
      values.forEach((val, i) => {
        // send color data to LEDs
        setLights(i, chroma(val.color).darken(2 - (val.brightness / 2)).rgb());
      });

      return context;
    })
    .catch((err) => {
      console.error(err);
      return context;
    });
  }
});
