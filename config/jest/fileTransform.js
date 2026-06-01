'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function toPascalCase(value) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  getCacheKey(src, filename, configString, options) {
    const stableConfig = typeof configString === 'string' ? configString : JSON.stringify(configString || {});
    const stableOptions = JSON.stringify({
      instrument: options?.instrument,
      supportsDynamicImport: options?.supportsDynamicImport,
      supportsStaticESM: options?.supportsStaticESM,
      supportsTopLevelAwait: options?.supportsTopLevelAwait
    });

    return crypto
      .createHash('md5')
      .update(src)
      .update(filename)
      .update(stableConfig)
      .update(fs.readFileSync(__filename))
      .update(stableOptions)
      .digest('hex');
  },
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFilename = toPascalCase(path.parse(filename).name);
      const componentName = `Svg${pascalCaseFilename}`;
      return {
        code: `const React = require('react');
module.exports = {
  __esModule: true,
  default: ${assetFilename},
  ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
    return React.createElement(
      'svg',
      Object.assign({}, props, {
        ref: ref
      }),
      ${assetFilename}
    );
  }),
};`,
      };
    }

    return {
      code: `module.exports = ${assetFilename};`,
    };
  },
};
