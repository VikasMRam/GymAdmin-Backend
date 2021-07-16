import React from 'react';
import { string } from 'prop-types';
// import { ifProp } from 'styled-tools';

import agentPropType from 'sly/common/propTypes/agent';
import { Block, Heading, Grid, Link } from 'sly/common/system';
import Avatar from 'sly/web/components/molecules/Avatar';
import { getImagePath } from 'sly/web/services/images';
import { stateNames } from 'sly/web/constants/geo';


const CommunityAgentSection = ({
  agent, layout, ...props
}) => {
  const {
    gallery,
    info,
    address,
    id,
  } = agent;
  const {
    recentFamiliesHelped, displayName,
  } = info;

  const { city, state } = address;


  let path;
  let imageUrl = null;
  if (gallery?.images?.length) {
    path = gallery.images[0].path;
    imageUrl = getImagePath(encodeURI(path.replace(/\.jpe?g$/i, '.jpg')));
  }

  return (
    <Block {...props}>
      <Grid
        gridTemplateColumns="4.5rem 1fr"
        gridGap="m"
        align="center"
        pad="l"
      >
        <Avatar size="xxxLarge" user={{ name: displayName, picture: { src: imageUrl, path } }} />
        <Block display="flex" flexDirection="column" justifyContent="center" textAlign="left">
          <Link to={`/agents/${stateNames[state]}/${city.replace(' ', '-')}/${id}`} > <Block font="title-m" color="primary">{displayName}</Block></Link>
          {recentFamiliesHelped > 0 && <Block pt="xxs" font="body-m">{recentFamiliesHelped} families helped</Block>}
        </Block>
      </Grid>

      <Heading pad="xs" font="title-s">How our FREE service works</Heading>
      <Block>
        Our Seniorly Local Advisors will guide you through the entire process of finding the right senior living
        community. After they assess you or your loved one’s lifestyle, care needs, budget, they will send you
        information on senior living communities that fit your needs. Since they live locally, they can schedule and
        accomapany you on tours and even neogotiate rent once you selected the right home.
      </Block>
    </Block>
  );
};

CommunityAgentSection.propTypes = {
  agent: agentPropType.isRequired,
  layout: string,
};
CommunityAgentSection.defaultProps = {
  layout: 'community',
};
CommunityAgentSection.typeHydrationId = 'CommunityAgentSection';

export default CommunityAgentSection;

