import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { createStructuredSelector } from 'reselect';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';
import { LoadingMessage } from 'components/CommonTheme';

import { selectCaseNotesQuery, selectCaseNotesPagination, selectBookingDetailsId } from '../../selectors';
import CaseNoteFilterForm from './filterForm';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';

class CaseNotes extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { setCaseNoteView, caseNotesStatus, caseNotes, totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination } = this.props;
    return (
      <div>
        <div>
          <CaseNoteFilterForm bookingId={bookingId} />
          <div>
            <NoSearchResultsReturnedMessage resultCount={caseNotes.size} />
          </div>
          <div className="add-gutter-top">
            {caseNotes.map((caseNote) => <CaseNoteListItem
              action={() => setCaseNoteView(caseNote.get('caseNoteId'))}
              caseNote={caseNote} key={uuid()}
            />)}
          </div>
          <PreviousNextNavigation
            pagination={caseNotesPagination}
            totalRecords={totalResults}
            pageAction={(id) => setPagination(bookingId, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)}
          />
        </div>
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
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  setCaseNoteView: PropTypes.func.isRequired,
};

CaseNotes.defaultProps = {
  caseNotesStatus: {},
  totalResults: 0,
};

export default CaseNotes;
