import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';

import CaseNoteFilterForm from './filterForm';

const CaseNotes = (props) => {
  const {
    setCaseNoteView,
    caseNotes,
    totalResults,
    caseNotesPagination,
    offenderNo,
    caseNotesQuery,
    setPagination,
  } = props;

  return (
    <div>
      <div>
        <CaseNoteFilterForm offenderNo={offenderNo} />
        <div>
          <NoSearchResultsReturnedMessage resultCount={caseNotes.size} />
        </div>
        <div className="add-gutter-top">
          {caseNotes.map((caseNote) => (<CaseNoteListItem
            action={() => setCaseNoteView(caseNote.get('caseNoteId'))}
            caseNote={caseNote} key={uuid()}
          />))}
        </div>
        <PreviousNextNavigation
          pagination={caseNotesPagination}
          totalRecords={totalResults}
          pageAction={(id) => setPagination(offenderNo, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)}
        />
      </div>
    </div>
  );
};

CaseNotes.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  caseNotes: PropTypes.object.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  setCaseNoteView: PropTypes.func.isRequired,
};

CaseNotes.defaultProps = {
  totalResults: 0,
};

export default CaseNotes;
