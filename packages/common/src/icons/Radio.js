import React, { forwardRef } from 'react';

import Icon from 'sly/common/system/Icon';

// eslint-disable-next-line import/no-webpack-loader-syntax
const svg = require('!raw-loader!./svg/radio.svg').default;

const Radio = forwardRef((props, ref) => <Icon ref={ref} name="radio" svg={svg} {...props} />);

Radio.displayName = 'RadioIcon';

export default Radio;