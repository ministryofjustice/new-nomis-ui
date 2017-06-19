import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { AMEND_CASENOTE } from 'containers/Bookings/constants';
import { closeAmendCaseNoteModal } from 'containers/Bookings/actions';
import AmendCaseNoteFormMobile from './amendCaseNoteFormMobile';
// import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from '../AddCaseNoteModal/selectors';

class AmendCaseNotePageMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    // const caseNoteTypeList = this.props.caseNoteTypeList.toJS();
    // const subTypeList = this.props.caseNoteSubTypeList;
    return (
      <AmendCaseNoteFormMobile
        initialValues={{ }}
        onSubmit={this.props.onSubmitForm}
        goBack={this.context.router.goBack}
      />
    );
  }
}

AmendCaseNotePageMobile.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
};

AmendCaseNotePageMobile.defaultProps = {
};

AmendCaseNotePageMobile.contextTypes = {
  router: PropTypes.object.isRequired,
};


const mapStateToProps = createStructuredSelector({
});

export function mapDispatchToProps(dispatch) {
  return {
    closeAmendCaseNoteModal: () => dispatch(closeAmendCaseNoteModal()),
    onSubmitForm: createFormAction((formData) => ({ type: AMEND_CASENOTE.BASE, payload: { query: formData.toJS() } }), [AMEND_CASENOTE.SUCCESS, AMEND_CASENOTE.ERROR]),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AmendCaseNotePageMobile);
