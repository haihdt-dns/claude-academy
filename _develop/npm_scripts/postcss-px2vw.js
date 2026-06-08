const plugin = (opt) => ({
  postcssPlugin: 'postcss-auto-tablet',
  Once(root) {
    if (!opt) return;
    root.walkAtRules('media', (rule) => {
      if (rule.params.includes('--sp')) {
        rule.walkDecls((decl) => {
          decl.value = decl.value
            .replace(/(-*[\d.]+)px/g, 'vw($1)')
            .replace(/rem\(/g, 'vw(')
            .replace(/max\(vw\((-*[\d.]+)\)/g, 'max($1px')
            .replace(/min\(vw\((-*[\d.]+)\)/g, 'min($1px');
        });
      }
    });
  },
});
plugin.postcss = true;
module.exports = plugin;
