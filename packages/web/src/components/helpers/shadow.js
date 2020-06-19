import styled, { css } from 'styled-components';

import { size, palette } from 'sly/web/components/themes';
import { setDisplayName } from 'sly/web/components/helpers';
import transition from 'sly/web/components/helpers/transition';

const styles = (spread = 'regular') => css`
  box-shadow: 0 0 ${size('spacing', spread)} ${palette('slate', 'filler')}80;
`;

const shadow = (Component, ...props) => setDisplayName(styled(Component)`
  ${styles(...props)}
`, Component.displayName);

export const shadowOnHover = (Component, ...props) => setDisplayName(styled(transition(Component, 'box-shadow'))`
  :hover {
    ${styles(...props)}
  }
`, Component.displayName);

export default shadow;