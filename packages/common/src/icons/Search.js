import React, { forwardRef } from 'react';

import Icon from 'sly/common/system/Icon';

const svg = require('!raw-loader!./svg/search.svg').default
// import SearchSvg from './svg/search.svg';

const Search = forwardRef((props, ref) => <Icon ref={ref} name="search" svg={svg} {...props} />);

Search.displayName = 'SearchIcon';

export default Search;