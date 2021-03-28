import React, { forwardRef } from 'react';

import Icon from 'sly/common/system/Icon';

const svg = require('!raw-loader!./svg/arrow-drop.svg').default
// import ArrowDropSvg from './svg/arrow-drop.svg';

const ArrowDrop = forwardRef((props, ref) => <Icon ref={ref} name="arrow-drop" svg={svg} {...props} />);

ArrowDrop.displayName = 'ArrowDropIcon';

export default ArrowDrop;