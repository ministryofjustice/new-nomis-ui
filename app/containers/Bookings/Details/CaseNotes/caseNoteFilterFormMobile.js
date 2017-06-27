import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { CASE_NOTE_FILTER } from 'containers/Bookings/constants';
import { closeAmendCaseNoteModal } from 'containers/Bookings/actions';
import CaseNoteFilterForm from './caseNoteFilterForm';
// import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from '../AddCaseNoteModal/selectors';
import { selectCaseNotesQuery } from '../../selectors';

class AmendCaseNotePageMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    const cnquery = this.props.caseNotesQuery;
    const cnInitialvalues = cnquery && cnquery.toJS ? cnquery.toJS() : cnquery;
    console.log(cnquery);
    // const caseNoteTypeList = this.props.caseNoteTypeList.toJS();
    // const subTypeList = this.props.caseNoteSubTypeList;
    return (
      <CaseNoteFilterForm
        isMobile
        initialValues={cnInitialvalues}
        onSubmit={this.props.onSubmitForm}
        goBack={this.context.router.goBack}
      />
    );
  }
}

AmendCaseNotePageMobile.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
};

AmendCaseNotePageMobile.defaultProps = {
};

AmendCaseNotePageMobile.contextTypes = {
  router: PropTypes.object.isRequired,
};


const mapStateToProps = createStructuredSelector({
  caseNotesQuery: selectCaseNotesQuery(),
});

export function mapDispatchToProps(dispatch) {
  return {
    closeAmendCaseNoteModal: () => dispatch(closeAmendCaseNoteModal()),
    onSubmitForm: createFormAction((formData) => ({ type: CASE_NOTE_FILTER.BASE, payload: { query: formData.toJS(), resetPagination: true, goToPage: '/bookings/details' } }), [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AmendCaseNotePageMobile);
