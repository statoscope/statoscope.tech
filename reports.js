/* eslint-env node */

const fs = require('fs');
// const buildStats = require('./demo-bundle-history');

const customReport1DemoText = `
### This is a custom report

It allows you to construct any view and pass any data to that view.

Also, you can share the link to your reports with your colleagues.

For example, this report shows you top 20 of biggest modules in your bundle. 

Please, see [docs](https://github.com/statoscope/statoscope/tree/master/packages/webpack-plugin#optionsreports-report) to learn more.
`;

module.exports = [
  {
    id: 'top-20-biggest-modules',
    name: 'Top 20 biggest modules',
    data: { this: { is: ['a custom data', 'that passed', 'to the report'] } }, // or () => fetchAsyncData()
    view: [
      `md:${JSON.stringify(customReport1DemoText)}`,
      'struct',
      {
        data: `#.stats.compilations.(
              $compilation: $;
              modules.({
                module: $,
                hash: $compilation.hash,
                size: getModuleSize($compilation.hash)
              })
            ).sort(size.size desc)[:20]`,
        view: 'list',
        item: 'module-item',
      },
    ],
  },
  // fixme: highcharts was removed from statoscope and will be replaced later
  /*{
    id: 'report-with-a-chart',
    name: 'Report with a chart',
    data: buildStats,
    view: {
      view: 'chart',
      options: `{
        title: {
          text: 'Bundle history',
        },
        chart: {
          type: 'line',
        },
        xAxis: {
          categories: .date,
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: false,
          },
        },
        series: [
          {
            name: 'Build Time (sec)',
            data: .time,
          },
          {
            name: 'Bundle Size (mb)',
            data: .size,
          },
        ],
      }`,
    },
  },*/
  {
    id: 'report-view-can-be-a-script',
    name: 'Report view can be a script',
    view: fs.readFileSync('./custom-report.js', 'utf8'),
  },
];
