import React from 'react';
import styled from 'styled-components';
import { node } from 'prop-types';

import clientPropType from 'sly/web/propTypes/client';
import { STATUS_PALETTE_MAP, STATUS_ICON_MAP } from 'sly/web/constants/familyDetails';
import pad from 'sly/web/components/helpers/pad';
import { Box, Block } from 'sly/web/components/atoms';
import Stage from 'sly/web/components/molecules/Stage';
import IconBadge from 'sly/web/components/molecules/IconBadge';

const StyledBox = styled(Box)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PaddedInfoWrapper = pad(InfoWrapper, 'large');

const FamilyEntry = ({ client, children }) => {
  const InfoWrapperComponent = children && children.length ? PaddedInfoWrapper : InfoWrapper;

  return (
    <div>
      <StyledBox padding="large">
        <InfoWrapperComponent>
          <Block palette="primary" weight="medium">{client.clientInfo.name}</Block>
          <IconBadge palette={STATUS_PALETTE_MAP[client.status]} icon={STATUS_ICON_MAP[client.status]} text={client.status} />
        </InfoWrapperComponent>
        <div>
          {children}
        </div>
      </StyledBox>
      <Box padding="large" snap="top">
        <Stage stage={client.stage} />
      </Box>
    </div>
  );
};

FamilyEntry.propTypes = {
  client: clientPropType.isRequired,
  children: node,
};

export default FamilyEntry;