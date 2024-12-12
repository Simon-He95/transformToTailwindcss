// @ts-check
const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    ignores: [
      // eslint ignore globs here
      'test/**/*',
    ],
  },
  {
    rules: {
      // overrides
      'unused-imports/no-unused-vars': 'off',
      'ts/no-empty-object-type': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
    },
  },
)
