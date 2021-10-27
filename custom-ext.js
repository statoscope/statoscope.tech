/* eslint-env node */

module.exports = class WebpackContextExtension {
  constructor() {
    this.context = '';
  }

  handleCompiler(compiler) {
    this.context = compiler.context;
  }

  getExtension() {
    return {
      descriptor: { name: 'custom-webpack-extension-context', version: '1.0.0' },
      payload: { context: this.context },
    };
  }
};
