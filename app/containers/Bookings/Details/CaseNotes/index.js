import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { selectDeviceFormat } from 'selectors/app';
import {
  selectCaseNotesQuery,
  selectCaseNotesPagination,
  selectBookingDetailsId,
  selectCaseNotesView,
} from '../../selectors';

import CaseNoteList from './caseNoteList';
import CaseNoteDetails from './caseNoteDetails';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';

class CaseNotes extends Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadCaseNotes, bookingId, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(bookingId, caseNotesPagination, caseNotesQuery);
  }

  componentDidMount() {
    if (window) {
      window.scrollTo(0,0);
    }
  }

  componentWillReceiveProps(props) {
    if (this.props && this.props.caseNotes !== props.caseNotes) {
      window.scrollTo(0,0);
    }
  }

  render() {
    const { caseNotesView } = this.props;
    if (caseNotesView === 'LIST') {
      return <CaseNoteList />
    }
    return <CaseNoteDetails />
  }
}

CaseNotes.propTypes = {
  bookingId: PropTypes.number.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
  caseNotesView: PropTypes.string.isRequired,
};

CaseNotes.defaultProps = {
  caseNotesStatus: {},
  totalResults: 0,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadCaseNotes: (id, pagination, query) => dispatch(loadBookingCaseNotes(id, pagination, query)),
    setPagination: (id, pagination, query) => dispatch(setCaseNotesPagination(id, pagination, query)),
    setCaseNoteView: (id) => dispatch(setCaseNotesDetailView(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNotes: selectCaseNotes(),
  caseNotesStatus: selectCaseNotesStatus(),
  caseNotesPagination: selectCaseNotesPagination(),
  caseNotesQuery: selectCaseNotesQuery(),
  bookingId: selectBookingDetailsId(),
  totalResults: selectTotalCaseNotes(),
  caseNotesView: selectCaseNotesView(),
  deviceFormat: selectDeviceFormat(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
