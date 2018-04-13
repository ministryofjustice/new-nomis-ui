import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import ResultsViewToggle from 'components/ResultsViewToggle';
import ResultsViewToggleMobile from 'components/ResultsViewToggle/mobile';
import AssignmentsHeader from 'components/AssignmentsHeader';
import AssignmentsHeaderMobile from 'components/AssignmentsHeader/mobile';
import BookingTable from 'components/Bookings/Table';
import BookingGrid from 'components/Bookings/Grid';

import { viewDetails as vD } from 'containers/Bookings/actions';
import { DETAILS_TABS } from 'containers/Bookings/constants';
import {
  LOAD_ASSIGNMENTS,
} from 'containers/Assignments/constants';


import { setSearchContext } from 'globalReducers/app';

import { Model as UserModel } from 'helpers/dataMappers/user';

import {
  setAssignmentsPagination,
  setAssignmentsView,
} from './actions';


const Results = ({ resultsView, results, viewDetails, sortOrder }) => resultsView === 'List' ?
  <BookingTable viewName={resultsView} results={results} viewDetails={viewDetails} sortOrder={sortOrder} />
  :
  <BookingGrid viewName={resultsView} results={results} viewDetails={viewDetails} sortOrder={sortOrder} />

class Assignments extends Component {
  componentDidMount() {
    this.props.setContext('assignments');
    this.props.loadAssignments(this.props.location.query);
  }

  componentDidUpdate(prevProps) {
    if (!Map(prevProps.location.query).equals(Map(this.props.location.query))) {
      this.props.loadAssignments(this.props.location.query);
    }
  }

  render() {
    const {
      results,
      deviceFormat,
      totalResults,
      pagination,
      setPage,
      resultsView,
      setResultsView,
      user,
      error,
      viewDetails,
    } = this.props;

    const { perPage } = pagination;

    return (
      <div>
        {deviceFormat === 'desktop' ?
          <AssignmentsHeader
            resultsViewToggle={<ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />}
            user={user}
            options={{ assignments: totalResults }}
          />
          :
          <div>
            <AssignmentsHeaderMobile user={user} options={{ assignments: totalResults }} />
            <ResultsViewToggleMobile resultsView={resultsView} setResultsView={setResultsView} />
          </div>
        }

        {error &&
          <div className="error-summary">
            <div className="error-message"> {error} </div>
          </div>}

        <Results
          resultsView={resultsView}
          results={results}
          viewDetails={viewDetails}
          sortOrder="ASC"
        />

        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalResults}
          pageAction={(id) => { setPage({ perPage, pageNumber: id }); }}
        />
      </div>
    );
  }
}

Assignments.propTypes = {
  deviceFormat: PropTypes.string.isRequired,
  pagination: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  resultsView: PropTypes.string.isRequired,
  setResultsView: PropTypes.func.isRequired,
  setContext: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch, props) {
  return {
    viewDetails: (offenderNo) => dispatch(vD(offenderNo, DETAILS_TABS.OFFENDER_DETAILS)),
    setPage: (pagination) => dispatch(setAssignmentsPagination({ ...props.location.query, ...pagination })),
    setResultsView: (view) => dispatch(setAssignmentsView(view)),
    setContext: (context) => dispatch(setSearchContext(context)),
    loadAssignments: (query = {}) => dispatch({ type: LOAD_ASSIGNMENTS, payload: { ...query } }),
  };
}

const mapStateToProps = (immutableState, props) => {
  const assignments = immutableState.getIn(['assignments']);
  const results = assignments.get('results');
  const totalResults = assignments.get('totalRecords');
  const pagination = {
    perPage: props.location.query.perPage || 10,
    pageNumber: props.location.query.pageNumber || 0,
  };
  const resultsView = assignments.get('view');
  const deviceFormat = immutableState.getIn(['app', 'deviceFormat']);
  const user = immutableState.getIn(['authentication', 'user']) || UserModel.toJS();
  const error = assignments.get('error');

  return {
    results,
    deviceFormat,
    totalResults,
    pagination,
    resultsView,
    user,
    error,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
