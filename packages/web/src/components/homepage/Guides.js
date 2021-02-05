import React from 'react';
import styled from 'styled-components';

import { size } from 'sly/common/components/themes';
import { host } from 'sly/web/config';
import { getHelmetForHomePage } from 'sly/web/services/helpers/html_headers';
import Block from 'sly/common/components/atoms/Block';
import Heading from 'sly/common/components/atoms/Heading';
import Paragraph from 'sly/common/components/atoms/Paragraph';
import Button from 'sly/common/components/atoms/Button';
import Link from 'sly/common/components/atoms/Link';
import Icon from 'sly/common/components/atoms/Icon';

import Section from './Section';

const Body = styled(Section)`
  display: flex;
  flex-direction: column;
  padding: 48px 24px;

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    padding: 64px 24px;
  }

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    flex-direction: row;
    padding: 80px 0;
    & > * {
      width: calc(50% - 24px)
    }
    & > :first-child {
      margin-right: 48px;
    }
  }
`;

const guides = [
  {
    to: '/assisted-living',
    alt: 'assisted living senior living seniorly',
    title: 'Assisted Living Guide',
  },
  {
    to: '/memory-care',
    alt: 'memory care senior living seniorly',
    title: 'Memory Care Guide',
  },
  {
    to: '/independent-living',
    alt: 'independent living senior living seniorly',
    title: 'Independent Living Guide',
  },
  {
    to: '/continuing-care-retirement-community',
    alt: 'ccrc senior living seniorly',
    title: 'Continuing Care Retirement Community Guide',
  },
  {
    to: '/in-home-care',
    alt: 'in home care',
    title: 'Home Care Guide',
  },
];

const resources = {
  to: '/resources',
  alt: 'more senior living resources seniorly',
  title: 'Explore our resource center',
};

const significantLinks = guides.map(info => info.to);
significantLinks.push(resources.to);

const header = getHelmetForHomePage({ canonicalUrl: host, significantLinks });

const Guides = (props) => {
  return (
    <Block background="harvest.lighter-90" {...props}>
      {header}
      <Body>
        <Block pad="xLarge" flexGrow="0">
          <Heading font="title-xlarge" pad="large">
            Resources and Helpful Guides
          </Heading>
          <Block font="body-large" pad="xLarge">
            When you first begin to explore senior living, the information and options can be overwhelming—and stressful. We get it. That’s why we’ve done the basic research for you, creating a series of Seniorly Guides and reliable resources to inform you along your journey.
          </Block>
          <Button {...resources}>{resources.title}</Button>
        </Block>

        <Block>
          {guides.map((guide) => (
            <Block
              as={Link}
              font="title-medium"
              background="white.base"
              borderRadius="regular"
              padding="xLarge"
              pad="large"
              shadowOnHoverBlur="large"
              shadowOnHoverVOffset="small"
              shadowOnHoverPalette="black.base"
              shadowOnHoverPaletteOpacity="10"
              css={css`
                display: flex;
                align-items: center;
                & > :first-child {
                  flex-grow: 1;
                }
                &:last-child {
                  margin-bottom: 0px;
                }
              `}
              {...guide}
            >
              <span>{guide.title}</span>
              <Icon icon="chevron" size={32} />
            </Block>
          ))}
        </Block>
      </Body>
    </Block>
  );
}

export default Guides;