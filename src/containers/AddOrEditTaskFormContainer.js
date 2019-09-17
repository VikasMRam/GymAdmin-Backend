import React, { Component } from 'react';
import { arrayOf, string, object, func } from 'prop-types';
import { reduxForm } from 'redux-form';

import { prefetch, query } from 'sly/services/newApi';
import clientPropType from 'sly/propTypes/client';
import userPropType from 'sly/propTypes/user';
import taskPropType from 'sly/propTypes/task';
import { createValidator, required } from 'sly/services/validation';
import { TASK_RESOURCE_TYPE, USER_RESOURCE_TYPE, CLIENT_RESOURCE_TYPE } from 'sly/constants/resourceTypes';
import AddTaskForm from 'sly/components/organisms/AddTaskForm';

const validate = createValidator({
  title: [required],
  dueDate: [required],
  creator: [required],
  stage: [required],
  status: [required],
  priority: [required],
});

const ReduxForm = reduxForm({
  form: 'AddOrEditTaskForm',
  validate,
})(AddTaskForm);

@prefetch('users', 'getUsers')

@query('createTask', 'createTask')

@query('updateTask', 'updateTask')

export default class AddOrEditTaskFormContainer extends Component {
  static propTypes = {
    users: arrayOf(userPropType),
    client: clientPropType,
    priorities: arrayOf(string).isRequired,
    statuses: arrayOf(string).isRequired,
    status: object,
    createTask: func,
    notifyInfo: func,
    onSuccess: func,
    updateTask: func,
    task: taskPropType,
  };

  handleSubmitTask = (data) => {
    const {
      createTask, updateTask, notifyInfo, onSuccess, client, task,
    } = this.props;
    const payload = {
      type: TASK_RESOURCE_TYPE,
      attributes: {
        ...data,
      },
      relationships: {
        owner: {
          data: {
            type: USER_RESOURCE_TYPE,
            id: data.owner,
          },
        },
      },
    };
    if (!task && data.relatedTo) {
      payload.relationships.relatedEntities = {
        data: [
          {
            type: client ? CLIENT_RESOURCE_TYPE : USER_RESOURCE_TYPE,
            id: data.relatedTo,
          },
        ],
      };
    }

    let taskApiCall;
    if (task) {
      taskApiCall = updateTask({ id: task.id }, payload);
    } else {
      taskApiCall = createTask(payload);
    }

    taskApiCall
      .then(() => {
        if (task) {
          notifyInfo('Task successfully updated');
        } else {
          notifyInfo('New task successfully created');
        }
        if (onSuccess) {
          onSuccess();
        }
      });
  };

  render() {
    const {
      statuses, priorities, users, status, task, client,
    } = this.props;
    const { users: usersStatus } = status;
    const { hasFinished: usersHasFinished } = usersStatus;
    const isPageLoading = !usersHasFinished;
    if (isPageLoading) {
      return null;
    }
    const initialValues = {};
    if (client) {
      initialValues.relatedTo = client.name;
    }
    if (task) {
      if (task.title) {
        initialValues.title = task.title;
      }
      if (task.relatedEntities) {
        initialValues.relatedTo = task.relatedEntities[0].id;
      }
      if (task.dueDate) {
        initialValues.dueDate = new Date(task.dueDate);
      }
      if (task.owner) {
        initialValues.owner = task.owner.id;
      }
      if (task.status) {
        initialValues.status = task.status;
      }
      if (task.priority) {
        initialValues.priority = task.priority;
      }
      if (task.description) {
        initialValues.description = task.description;
      }
      if (task.created_at) {
        initialValues.created_at = task.created_at;
      }
      if (task.creator) {
        initialValues.creator = task.creator;
      }
    }

    return (
      <ReduxForm
        {...this.props}
        statuses={statuses}
        priorities={priorities}
        assignedTos={users}
        onSubmit={this.handleSubmitTask}
        initialValues={initialValues}
        heading={task && task.title}
      />
    );
  }
}