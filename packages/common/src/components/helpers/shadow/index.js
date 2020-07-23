import { css } from 'styled-components';

import { size, palette } from 'sly/common/components/themes';
import { withTransition } from 'sly/common/components/helpers/transition';

export const withShadow = ({ shadow }) => shadow && css`
  box-shadow: 0 0 ${size('spacing', shadow)} ${palette('slate', 'filler')}80;
`;

export const withShadowOnHover = ({ withShadowOnHover }) => withShadowOnHover && css`
  ${withTransition('all')}
  &:hover {
    box-shadow: 0 0 ${size('spacing', withShadowOnHover)} ${palette('slate', 'filler')}80;
  }
`;
