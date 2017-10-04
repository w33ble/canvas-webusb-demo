import chroma from 'chroma-js';
// TODO: internalize this wrapper
import Fn from '../../../../kibana-canvas/common/functions/fn.js';
import portController from './port_controller';

export default new Fn({
  name: 'lights',
  type: 'render',
  args: {
    palette: {
      types: ['palette', 'null'],
      help: 'A palette object for describing the colors to use on this plot',
      default: '{palette}',
    },
  },
  fn(context, args) {
    const { palette } = args;

    // calculate the colors to use for each series
    const colors = palette.gradient
      ? chroma.scale(palette.colors).colors(context.rows.length)
      : palette.colors;

    // find the max brightness, to scale all values to a percentage
    const maxVal = context.rows.reduce((range, row) => {
      if (!range) return row.size;
      return Math.max(range, row.size);
    }, -Infinity);

    // turn each row into an object describing how to light up each LED
    const values = context.rows.map((row, i) => {
      // TODO this only supports value count of palette color count * 2
      const count = context.rows.length;
      const colorIndex = (i < count) ? i : i - count;

      return {
        id: i,
        name: row.color,
        color: colors[colorIndex],
        brightness: Math.round(row.size / maxVal * 100) / 100,
      };
    });

    return portController()
    .then((setLights) => {
      const summary = values.map((val, i) => {
        // send color data to LEDs
        setLights(i, chroma(val.color).darken(1 - (val.brightness / 2)).rgb());

        // create LED info string
        return `${val.name}: ${val.color} (${val.brightness * 100}%)`;
      });

//     return {
//       type: 'render',
//       as: 'markdown',
//       value: {
//         content: `Check your LED strip

// - ${summary.join('\n- ')}

// \`\`\`
// ${JSON.stringify(values, null, 2)}
// \`\`\``,
//       },
//     };

      return {
        type: 'render',
        as: 'markdown',
        value: {
          content: `Check your LED strip

- ${summary.join('\n- ')}`,
        }
      };
    })
    .catch((err) => {
      return {
        type: 'render',
        as: 'markdown',
        value: {
          content: `Connection failed :(

${err.message}`,
        }
      };
    });
  }
});
