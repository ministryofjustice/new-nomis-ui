import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DETAILS_TABS } from 'containers/Bookings/constants';
import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { loadCaseNoteTypesAndSubTypes } from 'containers/Bookings/actions';
import { Model as caseNoteModel } from 'helpers/dataMappers/caseNotes';

import CaseNoteList from './caseNoteList';
import CaseNoteDetails from './caseNoteDetails';

import {
  setCaseNotesPagination,
} from '../../actions';

class CaseNotes extends Component {
  componentWillMount() {
    const { loadCaseNotes,loadTypesSubTypes, offenderNo, caseNotesPagination, caseNotesQuery } = this.props;
    
    loadTypesSubTypes();
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
    loadTypesSubTypes: () => dispatch(loadCaseNoteTypesAndSubTypes()),
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

export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
