import React from 'react';
import styled from 'styled-components';
import { func } from 'prop-types';

import Modal, { HeaderWithClose } from 'sly/components/atoms/NewModal';
import Heading from 'sly/components/atoms/Heading';
import Button from 'sly/components/atoms/Button';
import IconItem from 'sly/components/molecules/IconItem';
import { palette, size } from 'sly/components/themes';
import pad from 'sly/components/helpers/pad';
import { community as communityPropType } from 'sly/propTypes/community';

const PaddedHeading = pad(Heading);

const Content = styled.div`
  padding: ${size('spacing.xxLarge')};
  padding-top: 0;
  ${Heading} {
    text-align: center;
  }
`;

const IconItems = pad(styled.div`
  padding: 0 ${size('spacing.large')};
`);

const StyledButton = styled(Button)`
  width: 100%;
`;

const PostConversionSureNotHelpModal = ({ community, onDismiss }) => {
  return (
    <Modal onClose={onDismiss}>
      <HeaderWithClose onClose={onDismiss} />
      <Content>
        <PaddedHeading level="subtitle">Here is the direct contact for {community.name}</PaddedHeading>
        <IconItems>
          <IconItem iconSize="caption" icon="email">{community.email}</IconItem>
          <IconItem iconSize="caption" icon="phone">{community.phoneNumber}</IconItem>
        </IconItems>
        <StyledButton onClick={onDismiss}>Click Here to Browse Similar Communities</StyledButton>
      </Content>
    </Modal>
  );
};

PostConversionSureNotHelpModal.propTypes = {
  onAccept: func.isRequired,
  onDismiss: func.isRequired,
  community: communityPropType,
};

export default PostConversionSureNotHelpModal;
