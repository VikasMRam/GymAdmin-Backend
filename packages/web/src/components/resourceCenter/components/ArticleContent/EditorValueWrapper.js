import React from 'react';
import styled, { css } from 'styled-components';
import { key } from 'styled-theme';
import { string } from 'prop-types';

import Block from 'sly/common/system/Block';
import { sx, space, sx$tablet } from 'sly/common/system/sx';

const tableStyles = css`
  & figure.table {
    table {
      ${sx({ border: 'box' })}
      width: 100%;
      border-collapse: collapse;
      border-style: hidden;
      box-shadow: 0 0 0 1px ${key('palette.slate.lighter-90')};
      margin-bottom: ${key('space.l')};
      
      ${sx$tablet({ marginBottom: 'xl' })}
     
      & > thead,
      & > tbody {
        & > tr {
          ${sx({
            borderBottom: 's',
            borderColor: 'slate.lighter-90',
          })}
          
          & > th, & > td {
            ${sx({
              padding: 'm l',
              font: 'body-m',
              textAlign: 'left',
            })}
          }
        }
      }
      
      & > thead > tr {
        background: ${key('palette.slate.lighter-95')};
        padding-right: ${key('space.m')};
      }
      
      & > tbody > tr {
        &:last-child {
          border-bottom: none;
        }
      }

      & figure.image {
        line-height: normal;
        height: ${key('space.l')};

        & > img {
          height: 100%;
        }
      }
    }
  }
`;

const DynamicItemWrapper = styled(Block)`
  & * {
    font-size: 1.125rem;
    line-height: ${key('space.xl')};
    word-break: break-word;
  }
  & > p {
    letter-spacing: 0;
    margin-bottom: ${key('space.l')};
    
    ${sx$tablet({ margin: '0 0 xl'})}
  }
  
  & > ul, & > ol {
    margin: ${key('space.xs')} 0 ${key('space.xl')};
    padding-inline-start: ${key('space.l')};
    
    ${sx$tablet({ marginTop: 0 })}
    
    li {
      margin-bottom: ${key('space.s')};
    }
  }

  & a {
    color: ${key('color.viridian.base')};
  }
  
  ${tableStyles}
`;

const EditorValueWrapper = ({ value, ...rest }) => (
  <DynamicItemWrapper
    dangerouslySetInnerHTML={{ __html: value }}
    width={sx`calc(100% - ${space('m')} * 2)`}
    sx$tablet={{ width: 'col6' }}
    sx$laptop={{ width: 'col8' }}
    {...rest}
  />
);

EditorValueWrapper.propTypes = {
  value: string,
};

export default EditorValueWrapper;
