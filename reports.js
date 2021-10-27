/* eslint-env node */

const fs = require('fs');

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
    view: {
      view: 'chart',
      options: {
        chart: {
          type: 'line',
        },
        xAxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
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
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
          },
          {
            name: 'Bundle Size (mb)',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
          },
        ],
      },
    },
  },
  {
    id: 'report-view-can-be-a-script',
    name: 'Report view can be a script',
    view: fs.readFileSync('./custom-report.js', 'utf8'),
  },
];
