import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { selectCaseNotesQuery, selectCaseNotesPagination, selectBookingDetailsId, selectCaseNotesView, selectDisplayAmendCaseNoteModal } from '../../selectors';
import CaseNoteList from './caseNoteList';
import CaseNoteDetails from './caseNoteDetails';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
  openAmendCaseNoteModal,
} from '../../actions';

class CaseNotes extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadCaseNotes, bookingId, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(bookingId, caseNotesPagination, caseNotesQuery);
  }

  render() {
    const { caseNotesView, openAmendModal, displayAmendCaseNoteModal } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination

    if (caseNotesView === 'LIST') {
      return <CaseNoteList />;
    }
    return <CaseNoteDetails displayAmendCaseNoteModal={displayAmendCaseNoteModal} openAmendModal={openAmendModal} />;
  }
}

CaseNotes.propTypes = {
  bookingId: PropTypes.number.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
  openAmendModal: PropTypes.func.isRequired,
  caseNotesView: PropTypes.string.isRequired,
  displayAmendCaseNoteModal: PropTypes.bool.isRequired,
};

CaseNotes.defaultProps = {
  caseNotesStatus: { wait: 'What' },
  // caseNotes: ['jokes', 'on', 'you'],
  totalResults: 0,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadCaseNotes: (id, pagination, query) => dispatch(loadBookingCaseNotes(id, pagination, query)),
    setPagination: (id, pagination, query) => dispatch(setCaseNotesPagination(id, pagination, query)),
    setCaseNoteView: (id) => dispatch(setCaseNotesDetailView(id)),
    openAmendModal: () => dispatch(openAmendCaseNoteModal()),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNotes: selectCaseNotes(),
  caseNotesStatus: selectCaseNotesStatus(),
  caseNotesPagination: selectCaseNotesPagination(),
  caseNotesQuery: selectCaseNotesQuery(),
  bookingId: selectBookingDetailsId(),
  totalResults: selectTotalCaseNotes(),
  caseNotesView: selectCaseNotesView(),
  displayAmendCaseNoteModal: selectDisplayAmendCaseNoteModal(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
