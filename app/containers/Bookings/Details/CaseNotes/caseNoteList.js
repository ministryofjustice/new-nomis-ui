import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Pagination from 'components/Pagination';
import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';
import { createFormAction } from 'redux-form-saga';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { selectCaseNotesQuery, selectCaseNotesPagination, selectBookingDetailsId } from '../../selectors';
import CaseNoteFilterForm from './caseNoteFilterForm';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';


import {
  CASE_NOTE_FILTER,
} from '../../constants';

import { CaseNoteList } from './caseNoteList.theme';
class CaseNotes extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadCaseNotes, bookingId, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(bookingId, caseNotesPagination, caseNotesQuery);
  }

  render() {
    const { setCaseNoteView, caseNotesStatus, caseNotes, totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination, onSubmitForm } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination
    // if (caseNotesStatus.Type !== 'SUCCESS') return <div>Loading Casenotes ...</div>;
    const cnquery = caseNotesQuery;
    const cnInitialvalues = cnquery && cnquery.toJS ? cnquery.toJS() : cnquery;
    return (<div>
      <CaseNoteFilterForm initialValues={cnInitialvalues} onSubmit={onSubmitForm} />
      {caseNotesStatus.Type === 'SUCCESS' ? <CaseNoteList>
        {caseNotes.map((caseNote) => <CaseNoteListItem action={() => setCaseNoteView(caseNote.get('caseNoteId'))} caseNote={caseNote} key={caseNote.get('caseNoteId')} />)}
      </CaseNoteList> : <div>Loading Casenotes ...</div> }
      <Pagination pagination={caseNotesPagination} totalRecords={totalResults} pageAction={(id) => setPagination(bookingId, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)} />
    </div>);
  }
}

CaseNotes.propTypes = {
  bookingId: PropTypes.number.isRequired,
  caseNotesStatus: PropTypes.object,
  caseNotes: PropTypes.object.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  setCaseNoteView: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
