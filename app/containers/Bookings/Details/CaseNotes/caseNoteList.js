import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { selectCaseNotesQuery, selectCaseNotesPagination, selectBookingDetailsId } from '../../selectors';
import CaseNoteFilterForm from './filterForm';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';

import { CaseNoteList } from './caseNoteList.theme';
import { LoadingMessage } from 'components/CommonTheme';

class CaseNotes extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadCaseNotes, bookingId, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(bookingId, caseNotesPagination, caseNotesQuery);
  }

  render() {
    const { setCaseNoteView, caseNotesStatus, caseNotes, totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination

    return (
      <div>
        {caseNotesStatus.Type === 'SUCCESS' ?
          <div>
            <CaseNoteFilterForm />
            <div>
              <NoSearchResultsReturnedMessage resultCount={caseNotes.toJS().length}/>
            </div>
            <CaseNoteList>
              {caseNotes.map((caseNote) => <CaseNoteListItem action={() => setCaseNoteView(caseNote.get('caseNoteId'))}
                                                             caseNote={caseNote} key={caseNote.get('caseNoteId')} />)}
            </CaseNoteList>
            <PreviousNextNavigation pagination={caseNotesPagination} totalRecords={totalResults} pageAction={(id) => setPagination(bookingId, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)} />
          </div>
          :
          <LoadingMessage>Loading case notes ...</LoadingMessage>
        }
      </div>
    );
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
};

CaseNotes.defaultProps = {
  caseNotesStatus: {},
  totalResults: 0,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadCaseNotes: (id, pagination, query) => dispatch(loadBookingCaseNotes(id, pagination, query)),
    setPagination: (id, pagination, query) => dispatch(setCaseNotesPagination(id, pagination, query)),
    setCaseNoteView: (id) => dispatch(setCaseNotesDetailView(id)),
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
