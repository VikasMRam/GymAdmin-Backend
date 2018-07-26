/* eslint-disable no-console */
// https://github.com/diegohaz/arc/wiki/Webpack
const path = require('path');
const fs = require('fs');
const UglifyJs = require('uglify-es');
const cssmin = require('cssmin');
const devServer = require('@webpack-blocks/dev-server2');
// const splitVendor = require('webpack-blocks-split-vendor');
const happypack = require('webpack-blocks-happypack');
const serverSourceMap = require('webpack-blocks-server-source-map');
const nodeExternals = require('webpack-node-externals');
const AssetsByTypePlugin = require('webpack-assets-by-type-plugin');
const ChildConfigPlugin = require('webpack-child-config-plugin');
const SpawnPlugin = require('webpack-spawn-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

const {
  addPlugins,
  createConfig,
  entryPoint,
  env,
  setOutput,
  sourceMaps,
  defineConstants,
  webpack,
  group,
} = require('@webpack-blocks/webpack2');

// defaults to dev env, otherwise specify with env vars
const { STORYBOOK_GIT_BRANCH } = process.env;
const NODE_ENV = process.env.NODE_ENV || 'development';
const SLY_ENV = process.env.SLY_ENV || 'development';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/react-assets';
const HOST = process.env.HOST || 'http://www.lvh.me';
const PORT = process.env.PORT || 8000;
const DEV_PORT = process.env.DEV_PORT || (+PORT + 1) || 8001;
const BASENAME = process.env.BASENAME || '';
const API_URL = process.env.API_URL || 'http://www.lvh.me/v0';
const AUTH_URL = process.env.AUTH_URL || 'http://www.lvh.me/users/auth_token';
const DOMAIN = process.env.DOMAIN || 'lvh.me';
const VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', 'utf8').trim() : '';
const EXTERNAL_WIZARDS_PATH = process.env.EXTERNAL_WIZARDS_PATH || '/external/wizards';
const SOURCE = process.env.SOURCE || 'src';
const devDomain = `${HOST}:${DEV_PORT}/`;
const isDev = NODE_ENV === 'development';
const isStaging = SLY_ENV === 'staging';
// replacements for widgets.js
const EXTERNAL_ASSET_URL = (isDev ? `${devDomain}external` : HOST + path.join(PUBLIC_PATH, 'external'));
const EXTERNAL_WIZARDS_ROOT_URL = HOST + EXTERNAL_WIZARDS_PATH;

console.info('Using config', JSON.stringify({
  STORYBOOK_GIT_BRANCH,
  NODE_ENV,
  SLY_ENV,
  PUBLIC_PATH,
  HOST,
  PORT,
  DEV_PORT,
  BASENAME,
  API_URL,
  AUTH_URL,
  DOMAIN,
  SOURCE,
  EXTERNAL_ASSET_URL,
  EXTERNAL_WIZARDS_ROOT_URL,
}, null, 2));

const webpackPublicPath = `${PUBLIC_PATH}/`.replace(/\/\/$/gi, '/');
const sourcePath = path.join(process.cwd(), SOURCE);
const outputPath = path.join(process.cwd(), 'dist', 'public');
const assetsPath = path.join(process.cwd(), 'dist', 'assets.json');
const clientEntryPath = path.join(sourcePath, 'client.js');
const serverEntryPath = path.join(sourcePath, 'server.js');
// external scripts and assets
const externalSourcePath = path.join(sourcePath, 'external');
const externalWidgetSourcePath = path.join(externalSourcePath, 'widget');
const externalWidgetEntryPath = path.join(externalWidgetSourcePath, 'widget.js');
const externalWidgetCssEntryPath = path.join(externalWidgetSourcePath, 'widget.css');
// todo: need better approach than hardcoding assets
const closeIconSvg = fs.existsSync(`${externalWidgetSourcePath}/close-regular.svg`) ? fs.readFileSync(`${externalWidgetSourcePath}/close-regular.svg`, 'utf8') : '';
const externalWizardsEntryPath = path.join(externalSourcePath, 'wizards', 'index.js');
const externalAssetsPath = path.join(process.cwd(), 'dist', 'external-assets.json');

const when = (condition, setters) =>
  condition ? group(setters) : () => _ => _;

const babel = () => () => ({
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
});

const assets = () => () => ({
  module: {
    rules: [
      {
        test: /\.(ico|png|jpe?g|svg|woff2?|ttf|eot)$/,
        loader: 'url-loader?limit=8000',
      },
    ],
  },
});

const resolveModules = modules => () => ({
  resolve: {
    alias: {
      sly: modules,
    },
    modules: [].concat(modules, 'node_modules'),
  },
});

function ModifyAssetsPlugin() {}
ModifyAssetsPlugin.prototype.apply = (compiler) => {
  compiler.plugin('done', () => {
    // always get latest file from disk; require has caching and hence it won't fetch latest file content
    const assets = JSON.parse(fs.readFileSync(assetsPath));
    const externalAssets = {};
    const newAssets = Object.keys(assets).reduce((previous, type) => {
      externalAssets[type] = externalAssets[type] || [];
      externalAssets[type] = assets[type].filter(asset => asset.match('external/'));
      const newPrevious = previous;
      newPrevious[type] = previous[type].filter(asset => !asset.match('external/'));
      return newPrevious;
    }, assets);
    fs.writeFileSync(assetsPath, JSON.stringify(newAssets));
    fs.writeFileSync(externalAssetsPath, JSON.stringify(externalAssets));
  });
};

const base = () =>
  group([
    setOutput({
      filename: '[name].[hash].js',
      path: outputPath,
      publicPath: webpackPublicPath,
    }),
    defineConstants({
      'process.env.STORYBOOK_GIT_BRANCH': STORYBOOK_GIT_BRANCH,
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.SLY_ENV': SLY_ENV,
      'process.env.PUBLIC_PATH': PUBLIC_PATH,
      'process.env.HOST': HOST,
      'process.env.PORT': PORT,
      'process.env.BASENAME': BASENAME,
      'process.env.API_URL': API_URL,
      'process.env.AUTH_URL': AUTH_URL,
      'process.env.DOMAIN': DOMAIN,
      'process.env.VERSION': VERSION,
      'process.env.EXTERNAL_WIZARDS_PATH': EXTERNAL_WIZARDS_PATH,
    }),
    addPlugins([new webpack.ProgressPlugin()]),
    happypack([babel()]),
    resolveModules(sourcePath),

    env('development', [
      setOutput({
        publicPath: devDomain,
      }),
    ]),
  ]);
const devCORS = () =>
  group([
    env('development', [
      devServer({
        contentBase: 'public',
        stats: 'errors-only',
        historyApiFallback: { index: webpackPublicPath },
        headers: { 'Access-Control-Allow-Origin': '*' },
        disableHostCheck: true,
        host: '0.0.0.0',
        port: DEV_PORT,
        compress: true,
      }),
      addPlugins([new webpack.NamedModulesPlugin()]),
    ]),
  ]);
const uglifyJs = () =>
  group([
    env('production', [
      addPlugins([
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: isStaging,
          compress: { warnings: false },
        }),
      ]),
    ]),
  ]);

const server = createConfig([
  base(),
  entryPoint({ server: serverEntryPath }),
  setOutput({
    filename: '../[name].js',
    libraryTarget: 'commonjs2',
  }),
  addPlugins([
    new webpack.BannerPlugin({
      banner: `global.assets = require("${assetsPath}");global.externalAssets = require("${externalAssetsPath}");`,
      raw: true,
    }),
  ]),
  () => ({
    target: 'node',
    externals: [nodeExternals()],
    stats: 'errors-only',
  }),
  assets(),

  env('development', [
    serverSourceMap(),
    addPlugins([new SpawnPlugin('node', ['--inspect', '.'])]),
    () => ({
      watch: true,
    }),
  ]),
]);

if (isDev || isStaging) {
  console.log('Will do sourcemaps');
}

const replaceExternalConstants = (text) => {
  const replacements = {
    'process.env.EXTERNAL_ASSET_URL': EXTERNAL_ASSET_URL,
    'process.env.EXTERNAL_WIZARDS_ROOT_URL': EXTERNAL_WIZARDS_ROOT_URL,
    'process.env.CLOSE_ICON_SVG': closeIconSvg,
    'process.env.SLY_ENV': SLY_ENV,
    'process.env.VERSION': VERSION,
  };
  const replacedText = Object.keys(replacements).reduce((previous, match) => {
    return previous.replace(new RegExp(match, 'g'), JSON.stringify(replacements[match]));
  }, text);
  return replacedText;
};
const externalWidget = () =>
  group([
    env('development', [
      addPlugins([
        new MergeIntoSingleFilePlugin({
          files: {
            'external/widget.js': [externalWidgetEntryPath],
            'external/widget.css': [externalWidgetCssEntryPath],
          },
          transform: {
            'external/widget.js': text => replaceExternalConstants(text),
          },
        }),
      ]),
    ]),
    env('production', [
      addPlugins([
        new MergeIntoSingleFilePlugin({
          files: {
            'external/widget.js': [externalWidgetEntryPath],
            'external/widget.css': [externalWidgetCssEntryPath],
          },
          transform: {
            'external/widget.js': (text) => {
              const { error, code } = UglifyJs.minify(replaceExternalConstants(text));
              if (error) {
                console.error(error);
              }
              return code;
            },
            'external/widget.css': (text) => {
              return cssmin(text);
            },
          },
        }),
      ]),
    ]),
  ]);

const client = createConfig([
  base(),

  entryPoint({
    client: clientEntryPath,
    'external/wizards': externalWizardsEntryPath,
  }),

  externalWidget(),

  addPlugins([
    new AssetsByTypePlugin({ path: assetsPath }),
    new ModifyAssetsPlugin(),
    new ChildConfigPlugin(server),
  ]),

  when(isDev || isStaging, [sourceMaps()]),

  assets(),

  devCORS(),

  uglifyJs(),

  /* env('production', [
    splitVendor(),
  ]), */
]);

module.exports = client;
