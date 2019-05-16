const { join, dirname } = require('path');
const { writeFileSync, existsSync, mkdirSync } = require('fs');

const sortChunks = require('webpack-sort-chunks').default;
const flatten = require('lodash/flatten');
const flatMap = require('lodash/flatMap');
const cloneDeep = require('lodash/cloneDeep');

const getAssetsByType = (
  assets,
  type,
  prependPath = ''
) => [].concat(assets)
  .filter(p => (new RegExp(`${type}$`).test(p)))
  .map(p => prependPath + p);

const defaultPath = join(process.cwd(), 'assets.json');

const ensureDir = (filePath) => {
  const name = dirname(filePath);
  if (!existsSync(name)) {
    mkdirSync(name, { recursive: true });
  }
};

/**
 * Save assets by type (js, css)
 */
module.exports = class AssetsByTypeAndBundlePlugin {
  constructor({ path = defaultPath, clientConfigs = [] } = {}) {
    if (!Array.isArray(clientConfigs)) {
      throw new Error('clientConfigs should be array');
    }
    this.options = { path, clientConfigs };
  }

  apply(compiler) {
    const plugin = { name: 'AssetsByTypeAndBundlePlugin' };
    compiler.hooks.done.tap(plugin, (rawStats) => {
      const { output } = compiler.options;
      const stats = rawStats.toJson({ modules: false });
      const chunks = flatten(sortChunks(stats.chunks).map(chunk => chunk.files));
      let assetsByBundle = cloneDeep(this.options.clientConfigs);
      writeFileSync('stats.json', JSON.stringify(stats, null, 2));
      Object.entries(stats.assetsByChunkName).forEach(([key, files]) => {
        const assets = flatMap([files]).sort((a, b) => chunks.indexOf(b) - chunks.indexOf(a));
        const clientConfig = assetsByBundle.find(({ bundle }) => bundle === key);
        if (!clientConfig) {
          return;
        }
        if (typeof clientConfig.assets !== 'undefined') {
          throw new Error(`clientConfig.assets already exist for key: ${key}`);
        }
        clientConfig.assets = {
          js: getAssetsByType(assets, 'js', output.publicPath),
          css: getAssetsByType(assets, 'css', output.publicPath),
        };
      });
      // add common chunks
      Object.entries(stats.assetsByChunkName).forEach(([key, files]) => {
        const assets = flatMap([files]).sort((a, b) => chunks.indexOf(b) - chunks.indexOf(a));
        const clientConfig = assetsByBundle.find(({ bundle }) => bundle === key);
        if (!clientConfig) {
          return;
        }
        if (clientConfig.isCommon) {
          assetsByBundle.forEach((bundle) => {
            const nassets = {
              js: [],
              css: [],
            };
            // order matters: vendor files should be served first
            nassets.js = [...getAssetsByType(assets, 'js', output.publicPath), ...bundle.assets.js];
            nassets.css = [...getAssetsByType(assets, 'css', output.publicPath), ...bundle.assets.css];
            bundle.assets = nassets;
          });
        }
      });
      assetsByBundle = assetsByBundle.filter(b => !b.isCommon);

      ensureDir(this.options.path);
      writeFileSync(this.options.path, JSON.stringify(assetsByBundle, null, 2));
    });
  }
};
