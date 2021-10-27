(() => {
  const customReportDemoText = `
### This is a custom report with a view as a script

Sometimes we need to make a report with more complex view (e.g. with event handling).

JSON can't handle functions, but you can pass any script source into \`view\`-property instead of JSON.
 
This source will be \`eval\`ed on client and should return any DiscoveryJS view.

Please, see [docs](https://github.com/statoscope/statoscope/tree/master/packages/webpack-plugin#optionsreports-report) to learn more.
`;

  return [
    `md:${JSON.stringify(customReportDemoText)}`,
    {
      view: 'button',
      data: {
        text: 'Click me',
      },
      onClick() {
        alert('It works!');
      },
    },
  ];
})();
