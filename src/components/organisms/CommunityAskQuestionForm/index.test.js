import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import CommunityAskQuestionForm from 'sly/components/organisms/CommunityAskQuestionForm';
import { EXIT_INTENT_TYPE } from 'sly/constants/retentionPopup';

const handleSubmit = jest.fn();
const communityName = 'Rhoda Goldman Plaza';
const user = { id: 1, name: 'Pranesh Kumar' };
const error = 'Blah';

const wrap = (props = {}) => shallow(<CommunityAskQuestionForm handleSubmit={handleSubmit} communityName={communityName} {...props} />);

describe('CommunityAskQuestionForm', () => {
  it('render name and email when user is not passed', () => {
    const wrapper = wrap({});
    expect(wrapper.find('StyledHeading').dive().dive().dive()
      .text()).toContain(communityName);
    expect(wrapper.find(Field).filter({ name: 'name' })).toHaveLength(1);
    expect(wrapper.find(Field).filter({ name: 'email' })).toHaveLength(1);
    expect(wrapper.find(Field).filter({ name: 'question' })).toHaveLength(1);
    expect(wrapper.find('StyledButton')).toHaveLength(1);
    expect(wrapper.find('strong')).toHaveLength(0);
  });

  it('does not render name and email when user is passed', () => {
    const wrapper = wrap({ user });
    expect(wrapper.find('StyledHeading').dive().dive().dive()
      .text()).toContain(communityName);
    expect(wrapper.find(Field).filter({ name: 'name' })).toHaveLength(0);
    expect(wrapper.find(Field).filter({ name: 'email' })).toHaveLength(0);
    expect(wrapper.find(Field).filter({ name: 'question' })).toHaveLength(1);
    expect(wrapper.find('StyledButton')).toHaveLength(1);
    expect(wrapper.find('strong')).toHaveLength(0);
  });

  it('render error when error is passed', () => {
    const wrapper = wrap({ error });
    expect(wrapper.find('StyledHeading').dive().dive().dive()
      .text()).toContain(communityName);
    expect(wrapper.find(Field).filter({ name: 'name' })).toHaveLength(1);
    expect(wrapper.find(Field).filter({ name: 'email' })).toHaveLength(1);
    expect(wrapper.find(Field).filter({ name: 'question' })).toHaveLength(1);
    expect(wrapper.find('StyledButton')).toHaveLength(1);
    expect(wrapper.find('strong')).toHaveLength(1);
  });

  it('should rednder title for exit form', () => {
    const title = 'Wait! Get support from a local senior living expert. This is a free service.';
    const wrapper = wrap({ type: EXIT_INTENT_TYPE });
    const headingElem = wrapper.find('StyledHeading');

    expect(headingElem).toHaveLength(1);
    expect(headingElem.at(0).dive().dive().dive()
      .text()).toContain(title);

    expect(wrapper.find(Field).filter({ name: 'name' })).toHaveLength(1);
    expect(wrapper.find(Field).filter({ name: 'email' })).toHaveLength(1);
    expect(wrapper.find(Field).filter({ name: 'question' })).toHaveLength(1);
    expect(wrapper.find('StyledButton')).toHaveLength(1);
    expect(wrapper.find('strong')).toHaveLength(0);
  });

  it('handles onFormSubmit', () => {
    const wrapper = wrap({});
    wrapper.find('form').simulate('submit');
    expect(handleSubmit).toHaveBeenCalled();
  });
});
