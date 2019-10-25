import React, { Component } from 'react';
import styled from 'styled-components';

import { size, palette, assetPath } from 'sly/components/themes';
import { Heading, Image, Icon, Paragraph } from 'sly/components/atoms';
import IconItem from 'sly/components/molecules/IconItem';
import PlusBadge from 'sly/components/molecules/PlusBadge';

const TextWrapper = styled.div`
  display: block;
  transform: rotate(0);
`;

const StyledHeading = styled(Heading)`
  color: ${palette('secondary', 'base')};
  font-size: ${size('text.hero')};
  margin: ${size('spacing.large')};
  font-weight: ${size('weight.bold')};
  display: inline-block;
`;

const ItalizeHeading = styled(Heading)`
  color: ${palette('secondary', 'base')};
  font-size: ${size('text.hero')};
  margin: ${size('spacing.large')};
  margin-left: 0;
  font-style: italic;
  display: inline-block;
  
`;

const IconItemWrapper = styled.div`
  margin-bottom: ${size('spacing.large')};
`;

const FullWidthSection = styled.div`
  margin-bottom: ${size('spacing.xLarge')};
`;

const PlusWrapper = styled.div`
  position: relative;
  padding: ${size('spacing.huge')} 0;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -${size('plus.left.default')};
  overflow: hidden;
  width:100vw;
  height:100%;
  z-index: 0;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    left:-webkit-calc(${size('plus.left.tablet')} - 50vw);
    left:-moz-calc(${size('plus.left.tablet')} - 50vw);
    left:calc(${size('plus.left.tablet')} - 50vw);
  }
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    left:-webkit-calc(${size('plus.left.laptop')} - 50vw);
    left:-moz-calc(${size('plus.left.laptop')} - 50vw);
    left:calc(${size('plus.left.laptop')} - 50vw);
  }
  display:inline-block;
  &:before {
    content:'';
    position:absolute;
    left:0;
    top:0;
    width:100vw; 
    height:100%;
    background: linear-gradient(to right,rgba(213, 240, 240,1), rgba(213, 240, 240,0));
  }

`;
const StyledImage = styled(Image)`
  max-width: 100%;
  height:100%;
  object-fit: cover;
  display: block;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    width: 100%;
    max-height:100%;
  }
`;

const SeniorlyIcon = styled(Icon)`
  margin-bottom: ${size('spacing.small')};
  display: inline-block
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    > svg {
      margin: 0 auto;
    }
  }

`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${size('text.subtitle')};
`;

export default class PlusBranding extends Component {

  render() {
    return (
      <FullWidthSection>
        <PlusWrapper>
          <ImageWrapper>
            <StyledImage src={assetPath('images/plus/plusbg.jpg')} alt="Seniorly Plus Home" />
          </ImageWrapper>
          <TextWrapper>
            <Paragraph>
              <SeniorlyIcon icon="logo" palette="secondary" size="xxLarge" />
              <StyledHeading>
                seniorly
              </StyledHeading>
              <ItalizeHeading>
                plus
              </ItalizeHeading>
            </Paragraph>
            <StyledParagraph>
              Seniorly Plus is a selection of only the highest quality homes. Each Plus home is verified through in-person
              quality inspection to ensure your next home is one you will love. Just look for the &nbsp;
              <PlusBadge />
              &nbsp;badge.
            </StyledParagraph>
            <Paragraph>
              <IconItemWrapper>
                <IconItem icon="house" iconPalette="secondary" borderPalette="secondary" borderVariation="base" borderless={false}>Each space is thoughfully designed for comfort and care</IconItem>
              </IconItemWrapper>
              <IconItemWrapper>
                <IconItem icon="care" iconPalette="secondary" borderPalette="secondary" borderVariation="base" borderless={false}>Seniorly Plus communities come with premium support</IconItem>
              </IconItemWrapper>
              <IconItemWrapper>
                <IconItem icon="verified" iconPalette="secondary" borderPalette="secondary" borderVariation="base" borderless={false}>Be at ease knowing each community is verified with an in-person inspection</IconItem>
              </IconItemWrapper>
            </Paragraph>
          </TextWrapper>
        </PlusWrapper>
      </FullWidthSection>
    )
  }
}
