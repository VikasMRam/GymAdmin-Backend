const fs = require('fs');
const path = require('path');

const iconsDir = path.resolve('./src/icons');
const svgDir = path.resolve(iconsDir, 'svg');

const files = fs.readdirSync(svgDir);
const icons = files.filter(f => f.match('\.svg$'));

const ucfirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const names = icons.map(fullname => {
  const [filename, ext] = fullname.split('.');
  const chunks = filename.split('-');
  const iconName = chunks.map(c => ucfirst(c)).join('');
  return [iconName, chunks.join('-')];
});

const jsx = ({ iconName, fileName }) => {
  return `import React, { forwardRef } from 'react';

import Icon from 'sly/common/system/Icon';

const svg = require('!raw-loader!./svg/${fileName}.svg').default
// import ${iconName}Svg from './svg/${fileName}.svg';

const ${iconName} = forwardRef((props, ref) => <Icon ref={ref} name="${fileName}" svg={svg} {...props} />);

${iconName}.displayName = '${iconName}Icon';

export default ${iconName};`;
}


names.forEach(([iconName, fileName]) => {
  const code = jsx({fileName, iconName});
  const dest = `${iconsDir}/${iconName}.js`;
  console.log({ dest, code });
  fs.writeFileSync(dest, code);
});

fs.writeFileSync(`${iconsDir}/constants.js`, `export const ICONS = ${JSON.stringify(names, null, 2)}\n`)
