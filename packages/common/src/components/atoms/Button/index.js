import React, { Component } from 'react';
import { bool, string, oneOf, object, func } from 'prop-types';
import { Link as RRLink } from 'react-router-dom';

import Root from './Root';

import { getKey } from 'sly/common/components/themes';
import { palette as palettePropType } from 'sly/common/propTypes/palette';
import { variation as variationPropType } from 'sly/common/propTypes/variation';
import { createRRAnchor } from 'sly/common/components/helpers';
// todo: most probably should be common in future
import events from 'sly/web/services/events';
import { isString } from 'sly/common/services/helpers/utils';

const getTarget = (href) => {
  if (!href.match(/https?:\/\//)) {
    return {};
  }

  return {
    target: '_blank',
    rel: 'noopener',
  };
};

const RRLinkButton = createRRAnchor(Root);

export default class Button extends Component {
  static propTypes = {
    disabled: bool,
    ghost: bool,
    secondary: bool,
    transparent: bool,
    borderPalette: palettePropType,
    background: palettePropType,
    palette: palettePropType,
    backgroundVariation: variationPropType,
    kind: oneOf(['jumbo', 'regular', 'tab', 'label', 'plain']),
    selected: bool,
    type: string,
    to: string,
    event: object,
    href: string,
    onClick: func,
  };

  static defaultProps = {
    palette: 'white',
    background: 'primary',
    kind: 'regular',
    type: 'button',
    border: 'regular',
    borderPalette: 'transparent',
    borderVariation: 'stroke',
    borderRadius: 'small',
    size: 'caption',
    lineHeight: 'title',
    padding: ['medium', 'large'],
    weight: 'medium',
    textDecoration: 'none',
    cursor: 'pointer',
    clamped: true,
  };

  getStyleProps() {
    const {
      kind,
      secondary,
      ghost,
      borderPalette,
      disabled,
      selected,
      transparent,
      background,
      backgroundVariation,
      palette: paletteProp,
    } = this.props;
    const props = {};

    // border styles
    if (secondary) {
      props.borderPalette = 'slate';
      props.borderVariation = 'stroke';
    } else if (ghost) {
      if (borderPalette !== 'transparent' && disabled) {
        props.borderVariation = 'filler';
      } else if (borderPalette === 'transparent') {
        props.borderPalette = 'currentcolor';
      }
    }

    // text styles, padding & margin styles
    // TODO: Check with Jared and correct Line heights of Buttons Texts
    if (kind === 'jumbo') {
      props.size = 'body';
      props.lineHeight = 'body';
      props.padding = ['large', 'xxxLarge'];
    } else if (kind === 'tab') {
      props.lineHeight = 'caption';
      props.padding = ['regular', 'large'];
    } else if (kind === 'label') {
      props.padding = ['0', 'large'];
      props.height = getKey('sizes.element.regular');
    }
    if (ghost) {
      if (secondary) {
        props.palette = 'slate';
        props.variation = disabled ? 'filler' : 'base';
      } else if (disabled) {
        props.palette = 'primary';
        props.variation = 'filler';
      } else if (paletteProp === 'white') {
        props.palette = background;
        props.variation = backgroundVariation;
      }
    } else if (transparent && paletteProp === 'white') {
      props.palette = 'slate';
    } else if (secondary) {
      props.palette = 'slate';
      props.variation = disabled ? 'filler' : 'base';
    } else if (selected) {
      props.palette = 'slate';
    }

    // background styles
    if (ghost) {
      if (selected) {
        props.background = paletteProp !== 'white' ? paletteProp : background;
        props.backgroundVariation = 'stroke';
      } else {
        props.background = 'white';
        props.backgroundVariation = 'base';
      }
    } else if (transparent) {
      props.background = 'transparent';
    } else if (secondary) {
      props.background = 'grey';
      props.backgroundVariation = 'background';
    } else if (disabled) {
      props.backgroundVariation = 'filler';
    }

    if (disabled) {
      props.cursor = 'not-allowed';
    }

    return props;
  }

  getProps() {
    const {
      to, href: hrefprop, event, onClick: onClickProp, ...props
    } = this.props;
    const styleProps = this.getStyleProps();
    styleProps.isTextChildren = isString(props.children);

    const onClick = (...args) => {
      if (event) {
        events.track(event);
      }
      if (onClickProp) {
        return onClickProp(...args);
      }
      return null;
    };

    if (to && !to.match(/^https?:\/\//)) {
      return {
        ButtonComponent: RRLink,
        onClick,
        ...props,
        ...styleProps,
        // flip the order on which we present the components
        component: RRLinkButton,
        to,
      };
    }

    const href = to || hrefprop;

    if (href) {
      return {
        ButtonComponent: Root,
        onClick,
        ...props,
        ...styleProps,
        href,
        as: 'a',
        ...getTarget(href),
      };
    }

    return {
      ButtonComponent: Root,
      onClick,
      ...props,
      ...styleProps,
    };
  }

  render() {
    const { ButtonComponent, ...props } = this.getProps();
    return <ButtonComponent {...props} />;
  }
}
