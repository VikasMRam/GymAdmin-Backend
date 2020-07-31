import React, { Component } from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import { ifProp, prop } from 'styled-tools';
import { any, func, bool, element, string } from 'prop-types';

import { isBrowser } from 'sly/web/config';
import { size, palette, key } from 'sly/common/components/themes';
import IconButton from 'sly/web/components/molecules/IconButton';
import Heading from 'sly/common/components/atoms/Heading';
import Block from 'sly/common/components/atoms/Block';
import Icon from 'sly/common/components/atoms/Icon';

const Overlay = styled.div`
  display: ${ifProp('isOpen', 'flex', 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${palette('slate', 'base')}e5;
  overflow: auto;
  z-index: calc(${key('zIndexes.modal.overlay')} - ${prop('instanceNumber')});
`;

const Modal = styled.div`
  margin: auto;
  border-radius: 6px;
  background-color: ${palette('white', 'base')};
  display: ${ifProp('isOpen', 'block', 'none')};

  width: calc(100% - ${size('spacing.xxLarge')});
  @media screen and (min-width: ${size('breakpoint.mobile')}) {
    width: ${size('layout.col4')};
  }
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    width: ${size('layout.col6')};
  }
`;

export const PaddedHeaderWithCloseBody = styled.div`
  padding: ${size('spacing.xxLarge')};
  padding-top: 0;
`;

export const HeaderWithClose = styled(({ children, icon, onClose, ...props }) => (
  <Block
    padding={[
      'xLarge',
      'xLarge',
      children || icon ? 'xLarge' : 0,
    ]}
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
    <Heading level="subtitle">{children}</Heading>
    <IconButton
      icon="close"
      palette="slate"
      onClick={onClose}
      transparent
      noPadding
    />
  </Block>
))`
  display: flex;
  align-items: center;

  ${Heading} {
    margin: 0;
    flex-grow: 1;
  }
  ${IconButton} {
    flex-grow: 0;
  }
`;

HeaderWithClose.propTypes = {
  children: element,
  icon: string,
  onClose: func,
};

export const ModalBody = styled(Block)``;

ModalBody.defaultProps = {
  padding: 'xLarge',
};

export const ModalActions = styled(Block)`
  > * {
    margin-left: ${size('spacing.large')};
  }
`;

ModalActions.defaultProps = {
  padding: [0, 'xLarge', 'xLarge'],
  align: 'right',
};

const PORTAL_ELEMENT_CLASS = 'modal-portal';
let instanceNumber = 0;

// TODO: @fonz todo a proper modal from this hack; animate entry and leave;
// FIXME: we had to uqickly introduce this because the modals were impeding agents
// to update the Stages
// FIXME: more than one modal are currently possible, we have to mimic the mechanism used in react-modal
export default class NewModal extends Component {
  static typeHydrationId = 'NewModal';
  overlayRef = React.createRef();

  constructor(props) {
    super(props);

    if (isBrowser) {
      this.insertEl();
    }
  }

  state = {
    mounted: false,
    instanceNumber: 0,
  };

  componentDidMount() {
    instanceNumber++;

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      mounted: true,
      instanceNumber,
    });
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
    this.el = null;
    instanceNumber--;
  }

  insertEl = () => {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.setAttribute('class', PORTAL_ELEMENT_CLASS);
      document.body.appendChild(this.el);
    }
  };

  onClick = (e) => {
    const { onClose } = this.props;

    if (e.target === this.overlayRef.current) {
      onClose(e);
    }
    return null;
  };

  render() {
    const { children, isOpen, ...props } = this.props;
    const { mounted, instanceNumber } = this.state;

    return mounted && ReactDom.createPortal(
      (
        <Overlay ref={this.overlayRef} onClick={this.onClick} isOpen={isOpen} instanceNumber={instanceNumber}>
          <Modal isOpen={isOpen} {...props}>
            {children}
          </Modal>
        </Overlay>
      ),
      this.el,
    );
  }
}

NewModal.propTypes = {
  children: any,
  onClose: func,
  isOpen: bool,
};

NewModal.defaultProps = {
  isOpen: true,
};
