import React, { forwardRef } from 'react';

import Icon from 'sly/common/system/Icon';

const svg = require('!raw-loader!./svg/close.svg').default
// import CloseSvg from './svg/close.svg';

const Close = forwardRef((props, ref) => <Icon ref={ref} name="close" svg={svg} {...props} />);

Close.displayName = 'CloseIcon';

export default Close;