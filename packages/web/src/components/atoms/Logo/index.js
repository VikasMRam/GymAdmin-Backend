// https://github.com/diegohaz/arc/wiki/Example-components#icon
import React from 'react';

import Block from 'sly/web/components/atoms/Block';

// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
const svg = require('!raw-loader!./svg/seniorlyLogo-regular.svg').default;

const Logo = props => (
  <Block
    dangerouslySetInnerHTML={{ __html: svg }}
    {...props}
  />
);

export default Logo;
