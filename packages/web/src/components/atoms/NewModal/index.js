import React, { Component, createContext, useContext, forwardRef, createRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { ifProp, prop } from 'styled-tools';
import { any, func, bool, element, string } from 'prop-types';
import ScrollLock from 'react-scrolllock';

import { size, palette, key } from 'sly/common/components/themes';
import { withSpacing } from 'sly/common/components/helpers';
import IconButton from 'sly/common/components/molecules/IconButton';
import Block from 'sly/common/components/atoms/Block';
import Icon from 'sly/common/components/atoms/Icon';

const ActiveModalContext = createContext(false);

const Overlay = styled.div`
  display: ${ifProp('isOpen', 'flex', 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${ifProp('transparent', 'transparent', css`${palette('slate', 'base')}e5`)};
  overflow: auto;
  z-index: calc(${key('zIndexes.modal.overlay')} - ${prop('instanceNumber')});
`;

const Modal = styled.div`
  ${withSpacing};

  border-radius: 6px;
  background-color: ${palette('white', 'base')};
  display: ${ifProp('isOpen', 'flex', 'none')};
  flex-direction: column;
  overflow-y: auto;

  width: 100%;
  max-height: calc(100vh - 1rem);
  margin-top: 1rem;

  @media screen and (min-width: 552px) {
    max-height: calc(100vh - 48px);
    margin-top: unset;
    max-width: ${size('layout.col6')};
  }
`;

export const PaddedHeaderWithCloseBody = styled.div`
  padding: ${size('spacing.xxLarge')};
  padding-top: 0;
`;

export const HeaderWithClose = forwardRef(({ children, icon, onClose, ...props }, ref) => (
  <Block
    ref={ref}
    display="flex"
    alignItems="center"
    flexShrink="0"
    padding="0 xLarge"
    height="76px"
    borderBottom="regular"
    {...props}
  >
    {icon && (
      <Icon
        icon={icon}
        size="caption"
        padding="6px"
        palette="primary"
        background="primary.lighter-90"
        marginRight="medium"
        borderRadius="large"
      />
    )}

    <Block
      as="h3"
      size="subtitle"
      fontWeight="medium"
      flexGrow="1"
      marginRight="xLarge"
      clamped
    >
      {children}
    </Block>

    <IconButton
      icon="close"
      palette="slate"
      iconSize="body"
      onClick={onClose}
      padding="0"
      flexGrow="0"
      transparent
    />
  </Block>
));

HeaderWithClose.propTypes = {
  children: element,
  icon: string,
  onClose: func,
};

export const ModalBody = forwardRef((props, ref) => {
  const isActive = useContext(ActiveModalContext);
  return (
    <ScrollLock isActive={isActive}>
      <Block
        ref={ref}
        {...props}
        css={{
          overflowY: 'auto',
        }}
      />
    </ScrollLock>
  );
});


ModalBody.defaultProps = {
  padding: 'xLarge',
};

export const ModalActions = forwardRef((props, ref) => (
  <Block
    ref={ref}
    display="flex"
    flexShrink="0"
    padding="large xLarge"
    borderTop="regular"
    {...props}
  />
));

ModalActions.displayName = 'ModalActions';

const PORTAL_ELEMENT_CLASS = 'modal-portal';

// TODO: @fonz todo a proper modal from this hack; animate entry and leave;
export default class NewModal extends Component {
  static typeHydrationId = 'NewModal';
  static el = null;
  static instanceNumber = 0;

  overlayRef = createRef();
  modalRef = createRef();
  state = { mounted: false };

  componentDidMount() {
    NewModal.instanceNumber++;
    if (!NewModal.el) {
      NewModal.el = document.createElement('div');
      NewModal.el.setAttribute('class', PORTAL_ELEMENT_CLASS);
      document.body.appendChild(NewModal.el);
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ mounted: true });
  }

  componentDidUnmount() {
    this;

    NewModal.instanceNumber--;

    if (NewModal.instanceNumber === 0) {
      document.body.removeChild(NewModal.el);
      NewModal.el = null;
    }
  }

  onClick = (e) => {
    const { onClose } = this.props;

    if (e.target === this.overlayRef.current) {
      onClose(e);
    }
    return null;
  };

  render() {
    const { children, isOpen, transparent, ...props } = this.props;

    return this.state.mounted && createPortal(
      <Overlay
        ref={this.overlayRef}
        transparent={transparent}
        onClick={this.onClick}
        isOpen={isOpen}
        instanceNumber={NewModal.instanceNumber}
      >
        <Modal
          ref={this.modalRef}
          isOpen={isOpen}
          {...props}
        >
          <ActiveModalContext.Provider value={isOpen}>
            {children}
          </ActiveModalContext.Provider>
        </Modal>
      </Overlay>,
      NewModal.el,
    );
  }
}

NewModal.propTypes = {
  children: any,
  onClose: func,
  isOpen: bool,
  transparent: bool,
};

NewModal.defaultProps = {
  isOpen: true,
};
