import React from 'react';
import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import { switchProp } from 'styled-tools';
import { string, shape, oneOf, func } from 'prop-types';

import { size, assetPath } from 'sly/components/themes';
import { Image, Link } from 'sly/components/atoms';

const Wrapper = styled(Link)`
  display: flex;
  flex-direction: column;

  ${switchProp('layout', {
    regular: css`
      border: ${size('border.regular')} solid ${palette('secondary', 3)};
      padding: ${size('spacing.xLarge')};
      border-radius: ${size('spacing.small')};
      // TODO: @pranesh-seniorly this should be flexbox and should figure out sizes by itsef
      width: ${size('profileTile.wrapper.regular.width')};
      &:hover {
        cursor: pointer;
        background: ${palette('white', 0)};
        box-shadow: 0 ${size('spacing.regular')} ${size('spacing.large')} ${palette('grayscale', 0)}80;
      }
    `,
  })}
`;

export const ImageWrapper = styled(Image)`
  object-fit: cover;
  z-index: 0;
  display: block;

  ${switchProp('layout', {
    regular: css`
        margin-bottom: ${size('spacing.xLarge')};
    `,
    modal: css`
        margin-bottom: ${size('spacing.large')};
    `,
  })}
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeadingWrapper = styled.div`
  font-size: ${size('text.subtitle')};
  font-weight: bold;
  margin-bottom: ${size('spacing.small')};
`;

const SubHeadingWrapper = styled.div`
  ${switchProp('layout', {
    modal: css`
      margin-bottom: ${size('spacing.large')};
    `,
  })}
`;

const DescriptionWrapper = styled.div`
  color: ${palette('grayscale', 1)};
`;

const ProfileTile = ({
  heading,
  subHeading,
  imageUrl,
  description,
  layout,
  ...props
}) => (
  <Wrapper layout={layout} {...props}>
    <ImageWrapper src={assetPath(imageUrl)} aspectRatio="16:9" layout={layout} />
    <InfoWrapper layout={layout}>
      <HeadingWrapper>{heading}</HeadingWrapper>
      <SubHeadingWrapper layout={layout}>{subHeading}</SubHeadingWrapper >
      { layout === 'modal' && <DescriptionWrapper>{description}</DescriptionWrapper>}
    </InfoWrapper>
  </Wrapper>
);

ProfileTile.propTypes = {
  profile: shape({
    heading: string.isRequired,
    subHeading: string.isRequired,
    imageUrl: string.isRequired,
    description: string,
  }),
  layout: oneOf(['regular', 'modal']),
  onClick: func,
};

ProfileTile.defaultProps = {
  layout: 'regular',
};

export default ProfileTile;
