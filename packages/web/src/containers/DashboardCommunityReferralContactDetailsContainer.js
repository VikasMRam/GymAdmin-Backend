import { reduxForm } from 'redux-form';

import DashboardCommunityReferralContactDetails from 'sly/web/components/organisms/DashboardCommunityReferralContactDetails';
import { createValidator, required, email } from 'sly/web/services/validation';

const validate = createValidator({
  name: [required],
  email: [required, email],
  slyMessage: [required],
});

const ReduxForm = reduxForm({
  form: 'DashboardCommunityReferralContactDetails',
  validate,
  destroyOnUnmount: true,
})(DashboardCommunityReferralContactDetails);

export default ReduxForm;