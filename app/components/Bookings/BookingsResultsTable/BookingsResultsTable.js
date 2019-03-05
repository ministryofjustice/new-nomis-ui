import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Table from '@govuk-react/table'

import { StyledTable, StyledCellHeader, StyledCell, FlagsContainer } from './BookingsResultsTable.styles'
import { offenderImageUrl, DETAILS_TABS } from '../../../containers/Bookings/constants'
import EliteImage from '../../../containers/EliteContainers/Image'
import Name from '../../Name'
import flags from '../AlertFlags'
import { linkOnClick } from '../../../helpers'
import history from '../../../history'

const onViewDetails = (event, row) => {
  event.preventDefault()
  history.push(`/offenders/${row.get('offenderNo')}/${DETAILS_TABS.QUICK_LOOK}`)
}

const ResultsTable = ({ results, sortOrder, sortOrderChange, onAlertFlagClick }) => (
  <StyledTable
    head={
      <Table.Row>
        <StyledCellHeader>Picture</StyledCellHeader>
        <StyledCellHeader setWidth="25%">
          Name{' '}
          {sortOrderChange && (
            <span {...linkOnClick(sortOrderChange)} data-qa="bookings-results-sort-arrow">
              {sortOrder === 'ASC' ? (
                <img src="/img/Triangle_asc.png" height="8" width="15" alt="Up arrow" />
              ) : (
                <img src="/img/Triangle_desc.png" height="8" width="15" alt="Down arrow" />
              )}
            </span>
          )}
        </StyledCellHeader>
        <StyledCellHeader desktopOnly>Prison no.</StyledCellHeader>
        <StyledCellHeader>Location</StyledCellHeader>
        <StyledCellHeader desktopOnly>IEP</StyledCellHeader>
        <StyledCellHeader desktopOnly>Age</StyledCellHeader>
        <StyledCellHeader desktopOnly setWidth="33.3333%">
          Flags
        </StyledCellHeader>
      </Table.Row>
    }
  >
    {results.map(row => (
      <Table.Row key={row.get('offenderNo')} data-qa="bookings-results-table-row">
        <StyledCell>
          <div className="photo clickable" {...linkOnClick(e => onViewDetails(e, row))}>
            <EliteImage src={offenderImageUrl(row.get('facialImageId'))} listView />
          </div>
        </StyledCell>
        <StyledCell bold data-qa="bookings-results-offender-name">
          <div className="link clickable" {...linkOnClick(e => onViewDetails(e, row))}>
            <Name lastName={row.get('lastName')} firstName={row.get('firstName')} />
          </div>
        </StyledCell>
        <StyledCell desktopOnly>{row.get('offenderNo')}</StyledCell>
        <StyledCell>{row.get('assignedLivingUnitDesc')}</StyledCell>
        <StyledCell desktopOnly>{row.get('iepLevel')}</StyledCell>
        <StyledCell desktopOnly>{row.get('age')}</StyledCell>
        <StyledCell desktopOnly>
          <FlagsContainer>
            {flags.AlertFlags(row.get('alertsDetails'), 'inline-header-large align-alerts', () =>
              onAlertFlagClick(row.get('offenderNo'))
            )}
            {flags.AssessmentFlags(row.get('categoryCode'), 'inline-header-large align-alerts')}
          </FlagsContainer>
        </StyledCell>
      </Table.Row>
    ))}
  </StyledTable>
)

ResultsTable.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
  sortOrderChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onAlertFlagClick: PropTypes.func.isRequired,
}

export default ResultsTable
