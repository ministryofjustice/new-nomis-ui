import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ReactRouterPropTypes from 'react-router-prop-types'

import PreviousNextNavigation, { paginationType } from '../../../../components/PreviousNextNavigation'
import CaseNoteListItem from '../../../../components/Bookings/Details/CaseNotes/CaseNoteListItem'
import NoSearchResultsReturnedMessage from '../../../../components/NoSearchResultsReturnedMessage'

import CaseNoteFilterForm from './filterForm'
import { caseNoteQueryType, userType } from '../../../../types'
import ResultsFilter from '../../../../components/ResultsFilter/ResultsFilter'

const CaseNotes = props => {
  const {
    caseNotes,
    totalResults,
    pagination,
    pagination: { perPage, pageNumber },
    offenderNo,
    caseNotesQuery,
    setPagination,
    location,
    user,
    handlePerPageChange,
  } = props
  const caseNoteListReferrer = location.pathname + location.search

  return (
    <div>
      <CaseNoteFilterForm offenderNo={offenderNo} location={location} />
      <ResultsFilter>
        <ResultsFilter.ResultsTotals perPage={perPage} pageNumber={pageNumber} totalResults={totalResults} />
        <ResultsFilter.PerPageDropdown
          handleChange={handlePerPageChange}
          totalResults={totalResults}
          perPage={perPage}
        />
      </ResultsFilter>
      <div>
        <NoSearchResultsReturnedMessage resultCount={caseNotes.size} />
      </div>
      <div className="case-notes">
        {caseNotes.map(caseNote => (
          <CaseNoteListItem
            key={caseNote.get('caseNoteId')}
            caseNote={caseNote.toJS()}
            offenderNo={offenderNo}
            user={user}
            caseNoteListReferrer={caseNoteListReferrer}
          />
        ))}
      </div>
      <PreviousNextNavigation
        pagination={pagination}
        totalRecords={totalResults}
        pageAction={id => setPagination(offenderNo, { perPage: pagination.perPage, pageNumber: id }, caseNotesQuery)}
      />
    </div>
  )
}

CaseNotes.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  caseNotes: ImmutablePropTypes.list.isRequired,
  pagination: paginationType.isRequired,
  caseNotesQuery: caseNoteQueryType.isRequired,
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  user: userType.isRequired,
  handlePerPageChange: PropTypes.func.isRequired,

  // special
  location: ReactRouterPropTypes.location.isRequired,
}

CaseNotes.defaultProps = {
  totalResults: 0,
}

export default CaseNotes
