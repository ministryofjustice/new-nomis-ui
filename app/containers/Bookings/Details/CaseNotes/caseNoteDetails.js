import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import Pagination from 'components/Pagination';
// import JsonBlock from 'components/JsonBlock';
import CaseNoteDetailsBlock from 'components/Bookings/Details/CaseNotes/detailsPage';

// import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';

import {
  selectCaseNoteDetails,
} from './selectors';

import {
  setCaseNotesListView,
} from '../../actions';

class CaseNotes extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { viewList, caseNoteDetails } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination
    return <CaseNoteDetailsBlock viewList={viewList} caseNote={caseNoteDetails} />;
  }
}

CaseNotes.propTypes = {
  caseNoteDetails: PropTypes.object.isRequired,
  viewList: PropTypes.func.isRequired,
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
