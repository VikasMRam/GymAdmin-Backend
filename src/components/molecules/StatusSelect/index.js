import React, { Component } from 'react';
import styled from 'styled-components';
import { func, object } from 'prop-types';
import produce from 'immer';

import userPropType from 'sly/propTypes/user';
import { Span } from 'sly/components/atoms';
import clientPropType from 'sly/propTypes/client';
import { size } from 'sly/components/themes';
import { AGENT_ND_ROLE, PLATFORM_ADMIN_ROLE } from 'sly/constants/roles';
import Field from 'sly/components/molecules/Field';
import {
  FAMILY_STATUS_ACTIVE,
  FAMILY_STATUS_ARCHIVED,
  //  FAMILY_STATUS_HOT,
  FAMILY_STATUS_DELETED,
  FAMILY_STATUS_LONG_TERM,
  FAMILY_STATUS_ON_PAUSE,
} from 'sly/constants/familyDetails';
import SlyEvent from 'sly/services/helpers/events';
import { query } from 'sly/services/newApi';
import ConfirmReasonFormContainer from 'sly/containers/ConfirmReasonFormContainer';
import ConfirmationDialog from 'sly/components/molecules/ConfirmationDialog';

const options = [
  { label: 'Active',    icon: 'active',     palette: 'green',  value: FAMILY_STATUS_ACTIVE, role: AGENT_ND_ROLE  },
  // { label: 'Hot',       icon: 'hot',        palette: 'yellow', value: FAMILY_STATUS_HOT },
  { label: 'Long Term', icon: 'hourglass',  palette: 'purple', value: FAMILY_STATUS_LONG_TERM, role: PLATFORM_ADMIN_ROLE },
  { label: 'On Pause',  icon: 'pause',      palette: 'danger', value: FAMILY_STATUS_ON_PAUSE, role: AGENT_ND_ROLE },
  { label: 'Archived',  icon: 'archived',   palette: 'slate',  value: FAMILY_STATUS_ARCHIVED, role: PLATFORM_ADMIN_ROLE  },
  { label: 'Deleted',   icon: 'trash-fill', palette: 'grey',   value: FAMILY_STATUS_DELETED, role: PLATFORM_ADMIN_ROLE },
];

const StyledField = styled(Field)`
  text-transform: uppercase;
  & .react-select__single-value, & .react-select__option {
    font-weight: ${size('weight.bold')};
  }
  & .react-select__menu {
    right: 0;
  }
`;

@query('updateClient', 'updateClient')

export default class StatusSelect extends Component {
  static propTypes = {
    updateClient: func.isRequired,
    client: clientPropType,
    rawClient: object,
    showModal: func,
    hideModal: func,
    notifyInfo: func,
    user: userPropType,
  };

  state = {
    status: this.props.client.status,
  };

  onChange = ({ value }) => {
    const { notifyInfo, hideModal } = this.props;

    this.setState({ status: value }, () => this.confirm(value)
      .then(data => this.submitUserStatus(value, data || {}))
      .then(() => {
        SlyEvent.getInstance().sendEvent({
          category: 'fdetails',
          action: 'set-family-status',
          label: 'submit',
          value,
        });
        notifyInfo(`Family successfully set to "${value}"`);
      })
      .then(hideModal));
  };

  getDateProps = () => ({
    name: 'date',
    type: 'date',
    size: 'small',
    required: true,
    label: <>Expected resume date<Span palette="danger">*</Span></>,
  });

  // FIXME: Because I am an idiot and am not clever in the slightest
  optionsForUser = () => {
    const { user } = this.props;
    const { roleID } = user;
    /* eslint-disable-next-line no-bitwise */
    return options.filter(o => o.role & roleID);
  };

  confirm = (toStatus) => {
    const { showModal, hideModal, client } = this.props;

    const onCancel = () => this.setState({ status: client.status }, hideModal);

    return new Promise((resolve) => {
      switch (toStatus) {
        case FAMILY_STATUS_LONG_TERM: return showModal((
          <ConfirmReasonFormContainer
            onAgree={resolve}
            onCancel={onCancel}
            title={`Place ${client.clientInfo.name} on ${toStatus}`}
            label="Long-term reason"
          />
        ));
        case FAMILY_STATUS_ON_PAUSE: return showModal((
          <ConfirmReasonFormContainer
            onAgree={resolve}
            onCancel={onCancel}
            title={`Place ${client.clientInfo.name} on ${toStatus}`}
            label="Pause reason"
            extraFieldProps={this.getDateProps()}
          />
        ));
        default: return showModal((
          <ConfirmationDialog
            heading={`Set ${client.clientInfo.name} to "${toStatus}"`}
            description={`Are you sure that you want to set ${client.clientInfo.name} to "${toStatus}"?`}
            onConfirmClick={() => resolve()}
            onCancelClick={onCancel}
          />
        ));
      }
    });
  };

  submitUserStatus = (clientStatus, { reason, date }) => {
    const { updateClient, rawClient } = this.props;
    return updateClient({ id: rawClient.id }, produce(rawClient, (draft) => {
      draft.attributes.status = clientStatus;
      if (reason) {
        draft.attributes.clientInfo.onHoldReason = reason;
        draft.attributes.clientInfo.resumeDate = date;
      }
    }));
  };

  render() {
    const { ...props } = this.props;
    return (
      <StyledField
        type="choice"
        name="status"
        value={this.state.status}
        size="tiny"
        options={this.optionsForUser()}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}
