import React, { Component } from 'react';
import { object, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError, clearSubmitErrors } from 'redux-form';
import styled from 'styled-components';

import { withRouter } from 'react-router';
import { size } from 'sly/common/components/themes';
import SlyEvent from 'sly/web/services/helpers/events';
import { WizardController, WizardStep, WizardSteps } from 'sly/web/services/wizard';
import { USER_SAVE_INIT_STATUS } from 'sly/web/constants/userSave';
import { COMMUNITY_ENTITY_TYPE } from 'sly/web/constants/entityTypes';
import { NOTIFICATIONS_COMMUNITY_ADD_FAVORITE_SUCCESS, NOTIFICATIONS_COMMUNITY_ADD_FAVORITE_FAILED } from 'sly/web/constants/notifications';
import { community as communityPropType } from 'sly/common/propTypes/community';
import { withAuth, prefetch, query } from 'sly/web/services/api';
import { Block } from 'sly/web/components/atoms';
import AddNoteFormContainer from 'sly/web/containers/AddNoteFormContainer';
import CommunitySaved from 'sly/web/components/organisms/CommunitySaved';
import { USER_SAVE } from 'sly/web/services/api/constants';
import { ensureAuthenticated } from 'sly/web/store/authenticated/actions';

const PaddedBlock = styled(Block)`
  padding: ${size('spacing.xxLarge')};
`;

const mapStateToProps = (state, ownProps) => {
  const { slug, userSaves } = ownProps;
  const userSave = userSaves && userSaves.find(us => us.entityType === COMMUNITY_ENTITY_TYPE && us.entitySlug === slug);
  return {
    userSave,
  };
};

@withAuth
@withRouter
@prefetch('community', 'getCommunity', (req, { slug }) => req({
  id: slug,
  include: 'similar-communities,questions,agents',
}))
@prefetch('userSaves', 'getUserSaves', (req, { match }) => req({
  'filter[entity_type]': COMMUNITY_ENTITY_TYPE,
  'filter[entity_slug]': match.params.communitySlug,
}))
@query('createAction', 'createUuidAction')
@query('createOldUserSave')
@query('updateOldUserSave')
@connect(mapStateToProps, { ensureAuthenticated, clearSubmitErrors })

export default class SaveCommunityContainer extends Component {
  static propTypes = {
    match: object,
    slug: string,
    user: object,
    userSave: object,
    status: object.isRequired,
    createOldUserSave: func,
    updateOldUserSave: func,
    createAction: func,
    community: communityPropType,
    notification: string,
    setQueryParams: func,
    notifyInfo: func,
    notifyError: func,
    onDoneButtonClick: func,
    onCancelClick: func,
  };

  state = { updatingUserSave: false };

  // FIXME: ugly hack to convert a declarative intent in an imperative one
  componentDidMount() {
    const { createUserSave, updateUserSave } = this;
    const { userSave } = this.props;

    if (userSave) {
      updateUserSave(USER_SAVE_INIT_STATUS);
    } else {
      createUserSave();
    }
  }

  authenticatedCreateUserSave = (data) => {
    const { ensureAuthenticated, createOldUserSave } = this.props;
    return ensureAuthenticated(
      'Sign up to add to your favorites list',
      () => createOldUserSave(data),
    );
  };

  authenticatedUpdateUserSave = (id, data) => {
    const { ensureAuthenticated, updateOldUserSave } = this.props;
    return ensureAuthenticated(
      'Sign up to add to your favorites list',
      () => updateOldUserSave({ id }, data),
    );
  };

  createUserSave = () => {
    const { handleModalClose } = this;
    const {
      community, notifyInfo, notifyError, createAction, match, status,
    } = this.props;
    const { id } = community;
    const payload = {
      entityType: COMMUNITY_ENTITY_TYPE,
      entitySlug: id,
    };

    this.setState({
      updatingUserSave: true,
    });

    this.authenticatedCreateUserSave(payload)
      .then(({ body }) => createAction({
        type: 'UUIDAction',
        attributes: {
          actionInfo: {
            entitySlug: community.id,
            entityType: 'Community',
            userSaveID: body.data.id,
          },
          actionPage: match.url,
          actionType: USER_SAVE,
        },
      }))
      .then(() => status.userSaves.refetch())
      .then(() => {
        this.setState({
          updatingUserSave: false,
        });
        notifyInfo(NOTIFICATIONS_COMMUNITY_ADD_FAVORITE_SUCCESS);
      }, () => {
        handleModalClose();
        notifyError(NOTIFICATIONS_COMMUNITY_ADD_FAVORITE_FAILED);
      });
  };

  updateUserSave = (status) => {
    const { handleModalClose } = this;
    const {
      userSave, notifyInfo, notifyError, createAction, community, match, status: prefetchStatus,
    } = this.props;
    const { id } = userSave;

    this.setState({
      updatingUserSave: true,
    });

    this.authenticatedUpdateUserSave(id, {
      status,
    })
      .then(({ body }) => createAction({
        type: 'UUIDAction',
        attributes: {
          actionInfo: {
            entitySlug: community.id,
            entityType: 'Community',
            userSaveID: body.data.id,
          },
          actionPage: match.url,
          actionType: USER_SAVE,
        },
      }))
      .then(() => prefetchStatus.userSaves.refetch())
      .then(() => {
        this.setState({
          updatingUserSave: false,
        });
        notifyInfo(NOTIFICATIONS_COMMUNITY_ADD_FAVORITE_SUCCESS);
      }, () => {
        handleModalClose();
        notifyError(NOTIFICATIONS_COMMUNITY_ADD_FAVORITE_FAILED);
      });
  };

  handleSubmitSaveCommunityForm = (data, next) => {
    const {
      updateOldUserSave, userSave, clearSubmitErrors, status
    } = this.props;

    const { id } = userSave;

    clearSubmitErrors();
    return updateOldUserSave({ id }, {
      note: data.note,
    })
      .then(status.userSaves.refetch)
      .catch((r) => {
        // TODO: Need to set a proper way to handle server side errors
        const { response } = r;
        return response.json().then((data) => {
          const errorMessage = Object.values(data.errors).join('. ');
          throw new SubmissionError({ _error: errorMessage });
        });
      })
      .then(() => next());
  };

  handleModalClose = () => {
    const { community, onDoneButtonClick } = this.props;
    const { id } = community;

    onDoneButtonClick();
    const event = {
      action: 'close-modal', category: 'saveCommunity', label: id,
    };
    SlyEvent.getInstance().sendEvent(event);
  };

  render() {
    const { handleSubmitSaveCommunityForm } = this;
    const { community, onDoneButtonClick, onCancelClick } = this.props;
    const { similarProperties } = community;
    const { updatingUserSave } = this.state;

    if (updatingUserSave) {
      return <PaddedBlock>Updating...</PaddedBlock>;
    }

    const PaddedCommunitySaved = () => (
      <PaddedBlock>
        <CommunitySaved name="Success" similarCommunities={similarProperties} onDoneButtonClicked={onDoneButtonClick}/>
      </PaddedBlock>
    );

    return (
      <WizardController
        formName="SaveCommunityForm"
      >
        {({
          data, next, ...props
        }) => (
          <WizardSteps {...props}>
            <WizardStep
              component={AddNoteFormContainer}
              name="Note"
              onSubmit={data => handleSubmitSaveCommunityForm(data, next)}
              heading="Community has been saved"
              placeholder="What are some things about this community that you like..."
              hasCancel
              onCancelClick={onCancelClick}
            />
            <WizardStep
              component={PaddedCommunitySaved}
              name="Success"
            />
          </WizardSteps>
        )}
      </WizardController>
    );
  }
}

