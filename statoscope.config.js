/* eslint-env node */

module.exports = {
  validate: {
    plugins: ['@statoscope/webpack'],
    reporters: [
      '@statoscope/console',
      ['@statoscope/stats-report', { saveReportTo: 'report/statoscope/index.html' }],
    ],
    rules: {
      '@statoscope/webpack/no-packages-dups': ['error'],
      '@statoscope/webpack/restricted-packages': ['error', [/wdxlab/]],
    },
  },
};
