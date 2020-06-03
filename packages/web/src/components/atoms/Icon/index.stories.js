// https://github.com/diegohaz/arc/wiki/Example-components#icon
import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Icon from 'sly/web/components/atoms/Icon';
import Block from 'sly/web/components/atoms/Block';
import { palette } from 'sly/web/components/themes';

const getIcons = () => {
  const context = require.context('./icons/', false, /\.svg$/);
  return context
    .keys()
    .map(icon => {
      const result = icon.match(/^\.\/(.+)-regular\.svg$/);
      console.log('result', result);
      return result?.[1];
    })
    .filter(x=>x);
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background: ${palette('grey', 'background')};
  border: 1px solid ${palette('grey', 'base')};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 5px;

  > ${Icon} {
    border: 1px solid ${palette('grey', 'base')};
    background: white;
    border-radius: 2px;
  }

  > ${Block} {
    margin-top: 10px;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

function Icons() {
  return (
    <Wrapper>
      {getIcons().map(icon => (
        <Card key={icon}>
          <Icon icon={icon} size="large" />
          <Block title={icon} size="caption">{icon}</Block>
        </Card>
      ))}
    </Wrapper>
  );
}

storiesOf('Atoms|Icon', module)
  .add('default', () => <Icons />);
