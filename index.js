export default function (kibana) {
  return new kibana.Plugin({
    require: ['canvas'],
    name: 'canvas-plugin-boilerplate',
    uiExports: {
      hacks: [
        // register functions and the like things with canvas
        'plugins/canvas-plugin-boilerplate/lib/load_plugin.js',
      ],
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
