import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ReactRouterPropTypes from 'react-router-prop-types'

import PreviousNextNavigation, { paginationType } from '../../../../components/PreviousNextNavigation'
import CaseNoteListItem from '../../../../components/Bookings/Details/CaseNotes/CaseNotesListItem'
import NoSearchResultsReturnedMessage from '../../../../components/NoSearchResultsReturnedMessage'

import CaseNoteFilterForm from './filterForm'
import { caseNoteQueryType, userType } from '../../../../types'

const CaseNotes = props => {
  const { caseNotes, totalResults, pagination, offenderNo, caseNotesQuery, setPagination, location, user } = props
  const caseNoteListReferrer = location.pathname + location.search

  return (
    <div>
      <CaseNoteFilterForm offenderNo={offenderNo} location={location} />
      <div>
        <NoSearchResultsReturnedMessage resultCount={caseNotes.size} />
      </div>
      <div className="add-gutter-top case-notes">
        {caseNotes.map(caseNote => (
          <CaseNoteListItem
            key={caseNote.get('caseNoteId')}
            caseNote={caseNote}
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

  // special
  location: ReactRouterPropTypes.location.isRequired,
}

CaseNotes.defaultProps = {
  totalResults: 0,
}

export default CaseNotes
