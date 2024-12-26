const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        Buffer: ['buffer', 'Buffer']
      }
    ]);
    config.module
        .rule('ts')
        .test(/\.tsx?$/)
        .use('ts - loader')
        .loader('ts - loader')
        .end();
    config.resolve.extensions.add('.ts').add('.tsx');
  }
})
