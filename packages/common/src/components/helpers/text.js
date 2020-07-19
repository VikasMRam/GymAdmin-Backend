import { css } from 'styled-components';
import { ifProp } from 'styled-tools';

import { getKey } from 'sly/web/components/themes';

// uses props size and weight
const getSize = (type, prop = 'size') => (props) => {
  const key = `sizes.${type}.${props[prop]}`;
  return getKey(key) || props[prop];
};

const getWeight = (props) => {
  if (!(props.weight || props.size)) return null;

  if (props.weight) {
    const key = `sizes.weight.${props.weight}`;
    return css({
      fontWeight: getKey(key) || props.weight,
    });
  }

  if (['subtitle', 'title', 'hero', 'superHero'].includes(props.size)) {
    const key = 'sizes.weight.medium';
    return css({
      fontWeight: getKey(key),
    });
  }

  return null;
};

export const withText = props => css`
  ${props.size && css`
    font-size: ${getSize('text')(props)};
    line-height: ${getSize('lineHeight')(props)};
  `}

  ${ifProp('lineHeight', css`
    line-height: ${getSize('lineHeight', 'lineHeight')(props)};
  `)}

  ${getWeight(props)};
`;
