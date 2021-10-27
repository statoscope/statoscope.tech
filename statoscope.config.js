/* eslint-env node */

module.exports = {
  validate: {
    plugins: ['@statoscope/webpack'],
    reporters: [
      '@statoscope/console',
      [
        '@statoscope/stats-report',
        { saveOnlyStats: true, saveStatsTo: 'public/demo-stats.json' },
      ],
    ],
    rules: {
      '@statoscope/webpack/build-time-limits': ['error', { global: 10000 }],
      '@statoscope/webpack/restricted-packages': ['error', [/@wdxlab/]],
    },
  },
};
