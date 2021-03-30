import React, { forwardRef } from 'react';

import Icon from 'sly/common/system/Icon';

// eslint-disable-next-line import/no-webpack-loader-syntax
const svg = require('!raw-loader!./svg/garage.svg').default;

const Garage = forwardRef((props, ref) => <Icon ref={ref} name="garage" svg={svg} {...props} />);

Garage.displayName = 'GarageIcon';

export default Garage;
