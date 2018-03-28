import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { Map, List } from 'immutable';
import { DETAILS_TABS } from 'containers/Bookings/constants';

import { Model as caseNoteModel } from 'helpers/dataMappers/caseNotes';


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
import { VIEW_DETAILS } from '../../constants';

class CaseNotes extends Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadCaseNotes, offenderNo, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(offenderNo, caseNotesPagination, caseNotesQuery);
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
    const {
      offenderNo,
      caseNoteId,
      setCaseNoteView,
      caseNotesStatus,
      caseNotes,
      totalResults,
      caseNotesPagination,
      caseNotesQuery,
      setPagination,
    } = this.props;

    if (caseNoteId) {
      return <CaseNoteDetails offenderNo={offenderNo} caseNoteId={caseNoteId} />
    }

    return (
      <CaseNoteList
        offenderNo={offenderNo}
        caseNotes={caseNotes}
        caseNotesPagination={caseNotesPagination}
        caseNotesQuery={caseNotesQuery}
        setPagination={setPagination}
        totalResults={totalResults}
        setCaseNoteView={setCaseNoteView}
      />
    )
  }
}

CaseNotes.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
};

CaseNotes.defaultProps = {
  caseNotesStatus: {},
  totalResults: 0,
};

export function mapDispatchToProps(dispatch, props) {
  return {
    loadCaseNotes: (id, pagination, query) => dispatch(loadBookingCaseNotes(id, pagination, query)),
    setPagination: (id, pagination, query) => dispatch(setCaseNotesPagination(id, pagination, query)),
    setCaseNoteView: (id) => dispatch(push(`/offenders/${props.offenderNo}/${DETAILS_TABS.CASE_NOTES}/${id}`)),
  };
}

const mapStateToProps = (immutableState, props) => {
  const offenderNo = props.offenderNo;
  const caseNotes = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNotes']) || caseNoteModel;
  const results = caseNotes.get('results');
  const totalResults = caseNotes.getIn(['meta', 'totalRecords']);
  const caseNotesPagination = caseNotes.get('pagination').toJS();
  const caseNotesQuery = caseNotes.get('query').toJS();

  const deviceFormat = immutableState.getIn(['app','deviceFormat']);

  return {
    caseNotes: results,
    caseNoteId: props.itemId,
    offenderNo,
    deviceFormat,
    totalResults,
    caseNotesPagination,
    caseNotesQuery,
  };
};

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
