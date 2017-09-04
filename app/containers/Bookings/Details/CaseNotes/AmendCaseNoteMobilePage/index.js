import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { AMEND_CASENOTE } from 'containers/Bookings/constants';
import AmendCaseNoteForm from '../AmendCaseNoteModal/amendCaseNoteForm';

import { DETAILS_TABS } from '../../../constants';
import { selectBookingDetailsId } from '../../../selectors';
import { viewDetails } from '../../../actions';

import '../AmendCaseNoteModal/index.scss';

class AmendCaseNotePageMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.goToBookingDetails(this.props.bookingDetailsId);
  }

  render() {
    const { onSubmitForm } = this.props;

    return (
      <div className="amend-case-note">
        <h1 className="bold-large">Amend case note</h1>
        <AmendCaseNoteForm isMobile initialValues={{ }} onSubmit={onSubmitForm} goBack={this.goBack} />
      </div>
    );
  }
}

AmendCaseNotePageMobile.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
  goToBookingDetails: PropTypes.func.isRequired
};

AmendCaseNotePageMobile.defaultProps = {
};

const mapStateToProps = createStructuredSelector({
  bookingDetailsId: selectBookingDetailsId()
});

export function mapDispatchToProps(dispatch) {
  return {
    goToBookingDetails: (bookingId) => dispatch(viewDetails(bookingId, DETAILS_TABS.CASE_NOTES)),
    onSubmitForm: createFormAction((formData) => ({ type: AMEND_CASENOTE.BASE, payload: { query: formData.toJS() } }), [AMEND_CASENOTE.SUCCESS, AMEND_CASENOTE.ERROR]),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AmendCaseNotePageMobile);
