import React from 'react';
import PropTypes from 'prop-types';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';

import CaseNoteFilterForm from './filterForm';

const CaseNotes = (props) => {
  const {
    setCaseNoteView,
    caseNotes,
    totalResults,
    pagination,
    offenderNo,
    caseNotesQuery,
    setPagination,
    location,
  } = props;

  return (
    <div>
      <div>
        <CaseNoteFilterForm offenderNo={offenderNo} location={location} />
        <div>
          <NoSearchResultsReturnedMessage resultCount={caseNotes.size} />
        </div>
        <div className="add-gutter-top">
          {caseNotes.map((caseNote) => (<CaseNoteListItem
            key={caseNote.get('caseNoteId')}
            action={() => setCaseNoteView(caseNote.get('caseNoteId'))}
            caseNote={caseNote}
          />))}
        </div>
        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalResults}
          pageAction={(id) => setPagination(offenderNo, { perPage: pagination.perPage, pageNumber: id }, caseNotesQuery)}
        />
      </div>
    </div>
  );
};

CaseNotes.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  caseNotes: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  setCaseNoteView: PropTypes.func.isRequired,
};

CaseNotes.defaultProps = {
  totalResults: 0,
};

export default CaseNotes;
