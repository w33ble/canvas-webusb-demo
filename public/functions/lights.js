import chroma from 'chroma-js';
// TODO: internalize this wrapper
import Fn from '../../../kibana-canvas/common/functions/fn.js';

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

    const colors = palette.gradient
      ? chroma.scale(palette.colors).colors(context.rows.length)
      : palette.colors;

    const maxVal = context.rows.reduce((range, row) => {
      if (!range) return row.size;
      return Math.max(range, row.size);
    }, -Infinity);

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

    const summary = values.map(val => `${val.name}: ${val.color} (${val.brightness * 100}%)`);

    return {
      type: 'render',
      as: 'markdown',
      value: {
        content: `Check your LED strip

- ${summary.join('\n- ')}

\`\`\`
${JSON.stringify(values, null, 2)}
\`\`\``,
      },
    };
  }
});
