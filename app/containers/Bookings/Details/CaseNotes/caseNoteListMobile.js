import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CaseNoteListItemMobile from 'components/Bookings/Details/CaseNotes/listItemMobile';
import MobileNextResultsPage from 'components/MobileNextResultsPage';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { createFormAction } from 'redux-form-saga';
import { OpenFilterFormMobile } from './caseNoteFilterForm.theme';

import {
  CASE_NOTE_FILTER,
} from '../../constants';

import { selectCaseNotesQuery, selectCaseNotesPagination, selectBookingDetailsId } from '../../selectors';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';

class CaseNotesMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    const { loadCaseNotes, bookingId, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(bookingId, caseNotesPagination, caseNotesQuery);
  }
  render() {
    const { setCaseNoteView, caseNotesStatus, caseNotes, totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination
    if (caseNotesStatus.Type !== 'SUCCESS') return <div>Loading Casenotes ...</div>;

    return (<div>
      <OpenFilterFormMobile to="/filterCaseNotes"></OpenFilterFormMobile>
      {caseNotes.map((caseNote) => <CaseNoteListItemMobile action={() => setCaseNoteView(caseNote.get('caseNoteId'))} caseNote={caseNote} key={caseNote.get('caseNoteId')} />)}
      <MobileNextResultsPage pagination={caseNotesPagination} totalRecords={totalResults} pageAction={(id) => setPagination(bookingId, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)} />
    </div>);
  }
}

CaseNotesMobile.propTypes = {
  bookingId: PropTypes.number.isRequired,
  caseNotesStatus: PropTypes.object,
  caseNotes: PropTypes.object.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  setCaseNoteView: PropTypes.func.isRequired,
};

CaseNotesMobile.defaultProps = {
  caseNotesStatus: { wait: 'What' },
  // caseNotes: ['jokes', 'on', 'you'],
  totalResults: 0,
  showFiltersMobile: false,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadCaseNotes: (id, pagination, query) => dispatch(loadBookingCaseNotes(id, pagination, query)),
    setPagination: (id, pagination, query) => dispatch(setCaseNotesPagination(id, pagination, query)),
    setCaseNoteView: (id) => dispatch(setCaseNotesDetailView(id)),
    onSubmitForm: createFormAction((formData) => ({ type: CASE_NOTE_FILTER.BASE, payload: { query: formData.toJS(), resetPagination: true } }), [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]),

  };
}

const mapStateToProps = createStructuredSelector({
  caseNotes: selectCaseNotes(),
  caseNotesStatus: selectCaseNotesStatus(),
  caseNotesPagination: selectCaseNotesPagination(),
  caseNotesQuery: selectCaseNotesQuery(),
  bookingId: selectBookingDetailsId(),
  totalResults: selectTotalCaseNotes(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotesMobile);
