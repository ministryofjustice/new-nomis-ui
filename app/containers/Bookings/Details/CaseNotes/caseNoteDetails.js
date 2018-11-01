import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import CaseNoteDetailsBlock from '../../../../components/Bookings/Details/CaseNotes/detailsPage'

import { setCaseNotesListView } from '../../actions'

import { loadCaseNote } from '../../../EliteApiLoader/actions'

class CaseNotes extends Component {
  componentDidMount() {
    const { offenderNo, caseNoteId, getCaseNote } = this.props
    getCaseNote(offenderNo, caseNoteId)
  }

  render() {
    const { viewList, caseNoteDetails, caseNoteId, offenderNo, error } = this.props

    if (error) {
      return (
        <div className="error-summary">
          <div className="error-message">{error}</div>
        </div>
      )
    }

    return (
      (caseNoteDetails && (
        <div>
          <CaseNoteDetailsBlock
            offenderNo={offenderNo}
            caseNoteId={caseNoteId}
            viewList={viewList}
            caseNote={caseNoteDetails}
          />
        </div>
      )) ||
      null
    )
  }
}

CaseNotes.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  caseNoteId: PropTypes.string.isRequired,
  caseNoteDetails: ImmutablePropTypes.map.isRequired,
  error: PropTypes.string,
  viewList: PropTypes.func.isRequired,
  getCaseNote: PropTypes.func.isRequired,
}

CaseNotes.defaultProps = {
  error: '',
}

const mapDispatchToProps = dispatch => ({
  viewList: () => dispatch(setCaseNotesListView()),
  getCaseNote: (offenderNo, caseNoteId) => dispatch(loadCaseNote(offenderNo, caseNoteId)),
})

const mapStateToProps = (immutableState, props) => {
  const { offenderNo } = props
  const caseNoteDetails = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNoteDetails'])
  const error = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNoteDetails', 'error'])

  return {
    caseNoteDetails,
    error,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseNotes)
