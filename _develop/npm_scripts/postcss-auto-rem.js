const postcss = require('postcss');

const plugin = () => ({
  postcssPlugin: 'postcss-auto-rem',
  Once(root) {
    const textRelatedProps = new Set(['font-size', 'letter-spacing', 'line-height', 'word-spacing', 'text-indent', 'text-shadow']);

    root.walkAtRules('media', (rule) => {
      if (rule.params.includes('--pc')) {
        rule.walkDecls((decl) => {
          if (textRelatedProps.has(decl.prop)) {
            decl.value = decl.value.replace(/(-*[\d.]+)px/g, 'rem($1)');
          }
        });
      }
    });
  },
});

plugin.postcss = true;
module.exports = plugin;
