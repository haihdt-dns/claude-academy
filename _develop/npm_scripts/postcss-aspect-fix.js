// const postcss = require('postcss');

const plugin = () => ({
  postcssPlugin: 'postcss-aspect-ratio-fix',
  Declaration(decl) {
    if (decl.prop === 'aspect-ratio') {
      const parent = decl.parent;
      const hasMinWidth = parent.some((node) => node.prop === 'min-width');
      if (!hasMinWidth) {
        parent.append({ prop: 'min-width', value: '0' });
      }
    }
  },
});

plugin.postcss = true;
module.exports = plugin;
