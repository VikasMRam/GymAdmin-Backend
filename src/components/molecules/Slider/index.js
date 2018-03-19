import React, { Component } from 'react';
import { string, number, bool, func, oneOf } from 'prop-types';
import styled from 'styled-components';
import { font, palette } from 'styled-theme';
import { ifProp, prop } from 'styled-tools';

import { size } from 'sly/components/themes';

const thumbColor = ({ disabled }) => palette(disabled ? 2 : 0);

const barColor = palette('grayscale', 2);

const hoverThumbColor = ({ disabled }) => !disabled && palette(0);

const thumbHeight = size('slider.knobHeight');
const thumbWidth = size('slider.knobWidth');
const thumbPosition = size('slider.knob');
const barHeight = size('spacing.small');

const border = '0rem solid transparent';
const thumbBorderRadius = size('spacing.small');
const trackBorderRadius = size('spacing.nano');

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: ${size};
  color: ${palette('grayscale', 0)};
  background-color: transparent;
`;

const SliderBar = styled.input`
  -webkit-appearance: none;
  width: 100%;
  margin: 0;
  height: ${size('element.regular')};
  background: transparent;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: ${thumbColor};
    border: ${border};
    height: ${thumbHeight};
    width: ${thumbWidth};
    border-radius: ${thumbBorderRadius};
    cursor: pointer;
    margin-top: -0.95rem;
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${hoverThumbColor};
    }
  }

  &::-moz-range-thumb {
    background: ${thumbColor};
    height: ${thumbHeight};
    width: ${thumbWidth};
    border: ${border};
    border-radius: ${thumbBorderRadius};
    cursor: pointer;
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${hoverThumbColor};
    }
  }

  &::-ms-thumb {
    height: ${thumbHeight};
    width: ${thumbWidth};
    cursor: pointer;
    border: ${border};
    border-radius: ${thumbBorderRadius};
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: ${barHeight};
    background: ${barColor};
    border-radius: ${trackBorderRadius};
    border: ${border};
  }

  &::-ms-track {
    width: 100%;
    height: ${barHeight};
    border: ${border};
    border-radius: ${trackBorderRadius};
    color: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: ${barHeight};
    background: ${barColor};
    border-radius: ${trackBorderRadius};
    border: ${border};
  }

  &::-moz-range-progress {
    background: ${thumbColor};
  }

  &::-ms-fill-lower {
    background: ${thumbColor};
    border: ${border};
    border-radius: ${trackBorderRadius};
  }

  &::-ms-fill-upper {
    background: ${barColor};
    border: ${border};
    border-radius: ${trackBorderRadius};
  }
`;

const Value = styled.span`
  text-align: right;
  width: ${props => size('slider.valueWidth', prop('width')(props))(props)};
`;

class Slider extends Component {
  state = {
    value: this.props.defaultValue,
  };

  onChange = ({ target }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(target.value);
    }
    this.setState({ value: target.value });
  };

  render() {
    const {
      id,
      min,
      max,
      defaultValue,
      valueWidth,
      valueParse,
      step,
      onChange,
      ...props
    } = this.props;

    const { value } = this.state;

    return (
      <Wrapper {...props}>
        <SliderBar
          id={id}
          min={min}
          max={max}
          defaultValue={defaultValue}
          step={step}
          onChange={this.onChange}
          {...props}
        />
        <Value width={valueWidth}>{valueParse(value)}</Value>
      </Wrapper>
    );
  }
}

Slider.propTypes = {
  id: string,
  min: number,
  max: number,
  defaultValue: number,
  step: number,
  reverse: bool,
  disabled: bool,
  valueParse: func,
  valueWidth: oneOf(['small', 'regular', 'large']),
};

Slider.defaultProps = {
  min: 0,
  max: 2,
  defaultValue: 1,
  step: 1,
  palette: 'secondary',
  type: 'range',
  valueParse: val => val,
  valueWidth: 'regular',
};

export default Slider;
