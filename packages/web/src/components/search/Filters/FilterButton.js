import React, { forwardRef } from 'react';
import { node } from 'prop-types';

import Block from 'sly/common/components/atoms/Block';

const FilterButton = forwardRef(({ children, ...props }, ref) => {
  return (
    <Block
      ref={ref}
      display="flex"
      alignItems="center"
      border="regular"
      borderRadius="large"
      elementSize="small"
      padding="0 large"
      {...props}
    >
      {children}
    </Block>
  );
});

FilterButton.propTypes = {
  children: node,
};

export default FilterButton;
