import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CaseNoteDetailsBlock from 'components/Bookings/Details/CaseNotes/detailsPage';
import { Model as caseNoteModel } from 'helpers/dataMappers/caseNotes';

import {
  selectCaseNoteDetails,
} from './selectors';

import {
  setCaseNotesListView,
} from '../../actions';

const CaseNotes = (props) => {
  const { viewList, caseNoteDetails, caseNoteId, bookingId } = props;

  return (caseNoteDetails &&
    <div>
      <CaseNoteDetailsBlock
        bookingId={bookingId}
        caseNoteId={caseNoteId}
        viewList={viewList}
        caseNote={caseNoteDetails}
      />
    </div>) || null;
}

CaseNotes.propTypes = {
  viewList: PropTypes.func.isRequired,
};

CaseNotes.defaultProps = {

};

export function mapDispatchToProps(dispatch) {
  return {
    viewList: () => dispatch(setCaseNotesListView()),
  };
}

const mapStateToProps = (immutableState, props) => {
  const bookingId = Number(props.bookingId);
  const caseNotes = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', bookingId, 'CaseNotes']) || caseNoteModel;
  const results = caseNotes.get('results');
  const caseNoteDetails = results.find(detail => detail.get('caseNoteId') === Number(props.caseNoteId));

  return {
    caseNoteDetails,
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
