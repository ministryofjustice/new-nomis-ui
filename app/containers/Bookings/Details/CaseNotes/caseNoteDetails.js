import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import CaseNoteDetailsBlock from 'components/Bookings/Details/CaseNotes/detailsPage';
import { Model as caseNoteModel } from 'helpers/dataMappers/caseNotes';

import {
  setCaseNotesListView,
} from '../../actions';

const CaseNotes = (props) => {
  const { viewList, caseNoteDetails, caseNoteId, offenderNo } = props;

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

CaseNotes.propTypes = {
  viewList: PropTypes.func.isRequired,
};


export function mapDispatchToProps(dispatch) {
  return {
    viewList: () => dispatch(setCaseNotesListView()),
  };
}

const mapStateToProps = (immutableState, props) => {
  const offenderNo = props.offenderNo;
  const caseNotes = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNotes']) || caseNoteModel;
  const results = caseNotes.get('results');
  const caseNoteId = Number(props.caseNoteId)
  const caseNoteDetails = results.find(detail => detail.get('caseNoteId') === caseNoteId);

  return {
    caseNoteDetails,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
