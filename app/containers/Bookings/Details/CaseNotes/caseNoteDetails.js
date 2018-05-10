import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import CaseNoteDetailsBlock from 'components/Bookings/Details/CaseNotes/detailsPage';

import {
  setCaseNotesListView,
} from '../../actions';

import {
  loadCaseNote,
} from '../../../EliteApiLoader/actions';

class CaseNotes extends Component {

  componentDidMount() {
    this.tryLoadCaseNote({ ...this.props });
  }

  componentDidUpdate() {
    this.tryLoadCaseNote({ ...this.props });
  }

  tryLoadCaseNote({ offenderNo, caseNoteId, getCaseNote, caseNoteDetails }) {
    if (shouldLoadCaseNote({ offenderNo, caseNoteId, caseNoteDetails })) {
      getCaseNote(offenderNo, caseNoteId);
    }
  }

  render() {
    const { viewList, caseNoteDetails, caseNoteId, offenderNo, error } = this.props;  

    if (error) {
      return (
      <div className="error-summary"> 
        <div className="error-message">
            {error}
        </div>
      </div>)
    }

    return (caseNoteDetails &&
      <div>
        <CaseNoteDetailsBlock
          offenderNo={offenderNo}
          caseNoteId={caseNoteId}
          viewList={viewList}
          caseNote={caseNoteDetails}
        />
      </div>) || null;
  }
}

CaseNotes.propTypes = {
  viewList: PropTypes.func.isRequired,
};

const shouldLoadCaseNote = ({ offenderNo, caseNoteId, caseNoteDetails }) => !caseNoteDetails && caseNoteId && offenderNo;

export function mapDispatchToProps(dispatch) {
  return {
    viewList: () => dispatch(setCaseNotesListView()),
    getCaseNote: (offenderNo, caseNoteId) => dispatch(loadCaseNote(offenderNo, caseNoteId)),
  };
}

const mapStateToProps = (immutableState, props) => {
  const offenderNo = props.offenderNo;
  const caseNoteDetails = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNoteDetails']);
  const error = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNoteDetails','error']);

  return {
    caseNoteDetails,
    error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
