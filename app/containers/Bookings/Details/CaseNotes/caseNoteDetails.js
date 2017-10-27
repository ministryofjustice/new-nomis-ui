import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CaseNoteDetailsBlock from 'components/Bookings/Details/CaseNotes/detailsPage';

import {
  selectCaseNoteDetails,
} from './selectors';

import {
  setCaseNotesListView,
} from '../../actions';

class CaseNotes extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { viewList, caseNoteDetails, openAmendModal, displayAmendCaseNoteModal } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination

    return (caseNoteDetails && <CaseNoteDetailsBlock displayAmendCaseNoteModal={displayAmendCaseNoteModal} viewList={viewList} caseNote={caseNoteDetails} openAmendModal={openAmendModal} />) || null;
  }
}

CaseNotes.propTypes = {
  viewList: PropTypes.func.isRequired,
  openAmendModal: PropTypes.func.isRequired,
  displayAmendCaseNoteModal: PropTypes.bool.isRequired,
};

CaseNotes.defaultProps = {

};

export function mapDispatchToProps(dispatch) {
  return {
    viewList: () => dispatch(setCaseNotesListView()),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNoteDetails: selectCaseNoteDetails(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
