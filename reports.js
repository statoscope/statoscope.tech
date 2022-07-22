/* eslint-env node */

const fs = require('fs');
const buildStats = require('./demo-bundle-history');

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
  {
    id: 'report-with-a-chart',
    name: 'Report with a chart',
    data: buildStats,
    view: {
      view: 'box',
      options: { height: '400px' },
      content: {
        view: 'chart',
        data: `{
          type: 'line',
          data: {
            labels: .date,
            datasets: [{
              label: 'Build Time (sec)',
              data: .size,
              borderColor: '#f00',
              backgroundColor: '#f00',
            }, {
                label: 'Bundle Size (mb)',
                data: .time,
                borderColor: '#00f',
                backgroundColor: '#00f',
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Bundle history'
              }
            }
          },
        }`,
      },
    },
  },
  {
    id: 'report-view-can-be-a-script',
    name: 'Report view can be a script',
    view: fs.readFileSync('./custom-report.js', 'utf8'),
  },
];
