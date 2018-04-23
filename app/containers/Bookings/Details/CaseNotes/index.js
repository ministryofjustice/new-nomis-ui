import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DETAILS_TABS } from 'containers/Bookings/constants';
import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { loadCaseNoteTypesAndSubTypes } from 'containers/Bookings/actions';
import { Model as caseNoteModel } from 'helpers/dataMappers/caseNotes';
import { buildCaseNotQueryString } from 'utils/stringUtils';

import CaseNoteList from './caseNoteList';
import CaseNoteDetails from './caseNoteDetails';

class CaseNotes extends Component {

  componentDidMount() {
    if (window) {
      window.scrollTo(0,0);
    }

    const { loadCaseNotes,loadTypesSubTypes, offenderNo, query } = this.props;
    
    loadTypesSubTypes();
    loadCaseNotes(offenderNo, query);
  }

  componentWillReceiveProps(props) {
    if (this.props && this.props.caseNotes !== props.caseNotes) {
      window.scrollTo(0,0);
    }
  }

  componentDidUpdate(prevProps) {
    if (!Map(prevProps.query).equals(Map(this.props.query))) {
      this.props.loadCaseNotes(this.props.offenderNo, this.props.query);
    }
  }

  render() {
    const {
      offenderNo,
      caseNoteId,
      setCaseNoteView,
      caseNotes,
      totalResults,
      setPagination,
      query,
      location,
    } = this.props;

    const pagination = {
      perPage: query.perPage,
      pageNumber: query.pageNumber,
    };

    if (caseNoteId) {
      return <CaseNoteDetails offenderNo={offenderNo} caseNoteId={caseNoteId} />
    }

    return (
      <CaseNoteList
        location={location}
        offenderNo={offenderNo}
        caseNotes={caseNotes}
        pagination={pagination}
        caseNotesQuery={query}
        setPagination={setPagination}
        totalResults={totalResults}
        setCaseNoteView={setCaseNoteView}
      />
    )
  }
}

CaseNotes.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
};

CaseNotes.defaultProps = {
  caseNotesStatus: {},
  totalResults: 0,
};

export function mapDispatchToProps(dispatch, props) {
  return {
    loadCaseNotes: (id, query) => dispatch(loadBookingCaseNotes(id, query)),
    setPagination: (id, pagination) => dispatch(push(`/offenders/${id}/case-notes?${buildCaseNotQueryString({ ...props.location.query, ...pagination })}`)),
    setCaseNoteView: (id) => dispatch(push(`/offenders/${props.offenderNo}/${DETAILS_TABS.CASE_NOTES}/${id}`)),
    loadTypesSubTypes: () => dispatch(loadCaseNoteTypesAndSubTypes()),
  };
}

const mapStateToProps = (immutableState, props) => {
  const offenderNo = props.offenderNo;
  const caseNotes = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNotes']) || caseNoteModel;
  const results = caseNotes.get('results');
  const totalResults = caseNotes.getIn(['meta', 'totalRecords']);
  const query = {
    perPage: props.location.query.perPage || 10,
    pageNumber: props.location.query.pageNumber || 0,    
    ...props.location.query,
  };

  const deviceFormat = immutableState.getIn(['app','deviceFormat']);

  return {
    caseNotes: results,
    caseNoteId: props.itemId,
    offenderNo,
    deviceFormat,
    totalResults,
    query,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
