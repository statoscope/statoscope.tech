/* eslint-env node */

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/env',
      {
        modules: false,
        exclude: ['@babel/plugin-transform-regenerator'],
      },
    ],
  ];

  return {
    presets,
  };
};
