import React from 'react';
import DatePicker from 'react-datepicker';
import { string, bool, oneOf, number, oneOfType, node, array, object } from 'prop-types';
import styled, { css } from 'styled-components';
import { ifProp } from 'styled-tools';

import { size } from 'sly/components/themes';
import { Label, Input, Icon, Block } from 'sly/components/atoms';
import textAlign from 'sly/components/helpers/textAlign';
// leave as it is: cyclic dependency
import MultipleChoice from 'sly/components/molecules/MultipleChoice';
import CommunityChoice from 'sly/components/molecules/CommunityChoice';
import RatingInput from 'sly/components/molecules/RatingInput';
import Slider from 'sly/components/molecules/Slider';
import DateChoice from 'sly/components/molecules/DateChoice';
import BoxChoice from 'sly/components/molecules/BoxChoice';
import IconInput from 'sly/components/molecules/IconInput';
import InputMessage from 'sly/components/molecules/InputMessage';

const textTypeInputs = ['email', 'iconInput'];
const getInputType = type => textTypeInputs.includes(type) ? 'text' : type;
const getInputComponent = (type) => {
  switch (type) {
    case 'rating':
      return RatingInput;
    case 'singlechoice':
    case 'multiplechoice':
    case 'buttonlist':
      return MultipleChoice;
    case 'communitychoice':
      return CommunityChoice;
    case 'slider':
      return Slider;
    case 'boxChoice':
      return BoxChoice;
    case 'dateChoice':
      return DateChoice;
    case 'iconInput':
      return IconInput;
    case 'date':
      return DatePicker;
    default:
      return Input;
  }
};

const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${size('spacing.large')};
  > input[type='checkbox'],
  > input[type='radio'] {
    margin-right: ${size('spacing.regular')};
  }
  display: flex;
  flex-direction: column;
  align-items: initial;

  ${ifProp('row', css`
    flex-direction: row;
  `)};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    flex-direction: ${ifProp({ wideWidth: true }, 'row')};
  }
`;

const CheckIcon = styled(Icon)`
  position: absolute;
  right: ${size('spacing.regular')};
  bottom: ${size('spacing.regular')};
`;

const LabelWrapper = styled.div`
  display: flex;
  vertical-align: middle;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    ${({ wideWidth }) => wideWidth && css`
      margin-right: ${size('tabletLayout.gutter')};
      flex: 0 0 ${size('tabletLayout.col2')};
    `}
  }
`;

const InputWrapper = styled.div`
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    ${({ wideWidth }) => wideWidth && css`
      margin-right: ${size('spacing.large')};
      flex: 0 0 ${size('tabletLayout.col3')};
    `}
  }
`;

const InputBeforeLabelWrapper = styled.div`
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    margin-left: ${ifProp({ wideWidth: true }, size('tabletLayout.col2'))};
  }
`;

// donot use pad to add margin bottom on input as it well lead to
// rerender on key stroke that will loose focus
const StyledInputMessage = styled(InputMessage)`
  margin-top: ${size('spacing.regular')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    margin-top: ${ifProp({ wideWidth: true }, 0)};
  }
`;
// donot use pad to add margin bottom on input as it well lead to
// rerender on key stroke that will loose focus
const CharCount = styled(textAlign(Block, 'right'))`
  margin-top: ${size('spacing.regular')};
`;
CharCount.displayName = 'CharCount';

const Field = ({
  message,
  name,
  invalid,
  warning,
  success,
  label,
  type,
  placeholder,
  className,
  value,
  hideErrors,
  labelRight,
  wideWidth,
  hideValue,
  showCharacterCount,
  ...props
}) => {
  const inputProps = {
    id: `${name}_${value || +new Date()}`,
    name,
    value: hideValue ? null : value,
    type: getInputType(type),
    invalid: invalid && !hideErrors,
    warning,
    placeholder,
    'aria-describedby': `${name}Error`,
    ...props,
  };
  const InputComponent = getInputComponent(type);
  const renderInputFirst = type === 'checkbox' || type === 'radio';
  const valueLength = inputProps.value ? inputProps.value.length : 0;
  if (type === 'date') {
    inputProps.selected = inputProps.value;
    inputProps.placeholderText = inputProps.placeholder;
    inputProps.customInput = <Input />;
  }

  return (
    <Wrapper className={className} wideWidth={wideWidth} row={renderInputFirst}>
      {renderInputFirst && (wideWidth ? <InputBeforeLabelWrapper wideWidth={wideWidth}><InputComponent {...inputProps} /></InputBeforeLabelWrapper> : <InputComponent {...inputProps} />)}
      {(label || labelRight) &&
        <LabelWrapper wideWidth={wideWidth}>
          {label &&
            <Label htmlFor={inputProps.id}>
              {label}
            </Label>
          }
          {labelRight &&
            <span>{labelRight}</span>
          }
        </LabelWrapper>
      }
      {renderInputFirst || (wideWidth ? <InputWrapper wideWidth={wideWidth}><InputComponent {...inputProps} /></InputWrapper> : <InputComponent {...inputProps} />)}
      {invalid && !hideErrors && message && (
        <StyledInputMessage name={`${name}Error`} icon="close" palette="danger" message={message} wideWidth={wideWidth} />
      )}
      {warning && !hideErrors && message && (
        <StyledInputMessage name={`${name}Warning`} icon="warning" palette="warning" message={message} wideWidth={wideWidth} />
      )}
      {success &&
        <CheckIcon icon="check" size="regular" palette="green" />
      }
      {showCharacterCount && inputProps.maxLength &&
        <CharCount size="tiny" palette={((valueLength / inputProps.maxLength) * 100) > 90 ? 'danger' : 'slate'}>{valueLength}/{inputProps.maxLength}</CharCount>
      }
    </Wrapper>
  );
};

Field.propTypes = {
  name: string.isRequired,
  value: oneOfType([
    string,
    number,
    array,
    bool,
    object,
  ]),
  className: string,
  invalid: bool,
  warning: bool,
  success: bool,
  message: string,
  hideErrors: bool,
  label: node,
  showCharacterCount: bool,
  type: oneOf([
    'textarea',
    'select',
    'communitychoice',
    'singlechoice',
    'multiplechoice',
    'buttonlist',
    'boxChoice',
    'dateChoice',
    'slider',
    'text',
    'email',
    'password',
    'checkbox',
    'radio',
    'rating',
    'number',
    'iconInput',
    'hidden',
    'date',
  ]),
  placeholder: string,
  labelRight: node,
  wideWidth: bool,
  hideValue: bool,
};

Field.defaultProps = {
  type: 'text',
};

export default Field;
