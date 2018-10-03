import React from 'react';
import { oneOf, node, func, bool } from 'prop-types';
import styled, { css } from 'styled-components';
import { ifProp, switchProp } from 'styled-tools';
import { palette, key } from 'styled-theme';

import { size } from 'sly/components/themes';
import IconButton from 'sly/components/molecules/IconButton';

const Wrapper = styled.div`
  z-index: ${key('zIndexes.toastNotifications')};
  display: ${ifProp('isOpen', 'flex', 'none')};
  align-items: center;
  justify-content: space-between;
  position: fixed;
  white-space: nowrap;
  bottom: ${size('spacing.large')};
  right: ${size('spacing.large')};
  padding: ${size('spacing.small')} ${size('spacing.large')};
  border-radius: ${size('spacing.small')};
  ${switchProp('status', {
    default: css`background-color: ${palette('slate', 0)};`,
    error: css`background-color: ${palette('danger', 0)};`,
  })};
  color: ${palette('white', 0)}
`;

const ToastNotification = ({
  status, isOpen, closeable, closeButtonPalette, onClose, children,
}) => (
  <Wrapper status={status} isOpen={isOpen}>
    {children}
    {closeable &&
      <IconButton
        icon="close"
        iconSize="small"
        iconOnly
        onClick={onClose}
        palette={closeButtonPalette}
      />
    }
  </Wrapper>
);

ToastNotification.propTypes = {
  status: oneOf(['default', 'error']).isRequired,
  children: node.isRequired,
  onClose: func.isRequired,
  closeable: bool,
  isOpen: bool,
  closeButtonPalette: oneOf(['white', 'slate']),
};

ToastNotification.defaultProps = {
  status: 'default',
  closeable: true,
  closeButtonPalette: 'white',
};

export default ToastNotification;