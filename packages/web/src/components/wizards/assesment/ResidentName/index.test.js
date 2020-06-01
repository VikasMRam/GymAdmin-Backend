import React from 'react';
import { shallow } from 'enzyme';

import { ResidentName } from 'sly/web/components/wizards/assesment';

const handleSubmit = jest.fn();
const defaultProps = {
  handleSubmit,
};
const wrap = (props = {}) => shallow(<ResidentName {...defaultProps} {...props} />);

describe('Wizards|Assesment - Steps|ResidentName', () => {
  it('does not render children when passed in', () => {
    const wrapper = wrap({ children: 'test' });
    expect(wrapper.contains('test')).toBeFalsy();
  });

  it('renders', () => {
    const wrapper = wrap();

    expect(wrapper.find('PaddedHeading').contains("Last question, what is the resident's name?")).toBeTruthy();
    expect(wrapper.find('PaddedField').filter({ type: 'text' })).toHaveLength(2);
    expect(wrapper.find('StyledTipBox')).toHaveLength(1);
  });

  it('renders correct number of fields when numberOfPeople is passed', () => {
    const numberOfPeople = 3;
    const wrapper = wrap({
      numberOfPeople,
    });

    expect(wrapper.find('PaddedField').filter({ type: 'text' })).toHaveLength(numberOfPeople * 2);
  });

  it('handles submit', () => {
    const wrapper = wrap();

    wrapper.find('form').simulate('submit');
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('handles onSkipClick', () => {
    const onSkipClick = jest.fn();
    const wrapper = wrap({
      onSkipClick,
    });

    wrapper.find('Footer').dive().find('Button')
      .at(0)
      .simulate('click');
    expect(onSkipClick).toHaveBeenCalled();
  });
});
