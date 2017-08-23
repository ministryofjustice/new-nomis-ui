import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';
import PreviousNextNavigation from 'components/PreviousNextNavigation';

import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { createFormAction } from 'redux-form-saga';
import styled from 'styled-components';

import FilterForm from './filterForm';

import {
  CASE_NOTE_FILTER,
} from '../../constants';

import { selectCaseNotesQuery, selectCaseNotesPagination, selectBookingDetailsId } from '../../selectors';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes,
  caseNoteFilterSelectInfo
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';

const MarginFix = styled.a `
  margin-bottom: 1em;
  display:block;
`


const ArrowUp = ({toggle}) => <span className="clickable" onClick={toggle}> &#9650; </span>
const ArrowDown = ({toggle}) => <span className="clickable" onClick={toggle}> &#9660;  </span>

class FilterToggle extends PureComponent {

  constructor(){
    super();
    this.toggleClick = this.toggleClick.bind(this);
  }

  componentWillMount(){
    this.setState({show: true});
  }

  toggleClick(e){
      e.preventDefault();
     this.setState({show: !this.state.show });
  }

  render() {
    return (
    <div>

      <MarginFix href="#" onClick={this.toggleClick}>

        {this.state.show?
          <span>
            <span> <ArrowUp/> </span>
            <span> Hide filters </span>
          </span> :

          <span>
            <span> <ArrowDown/> </span>
            <span> Show filters </span>
          </span>
        }
      </MarginFix>

      {this.state.show ? this.props.children : null}

    </div>)
  }
}

class CaseNotesMobile extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadCaseNotes, bookingId, caseNotesPagination, caseNotesQuery } = this.props;
    loadCaseNotes(bookingId, caseNotesPagination, caseNotesQuery);
  }

  render() {

    const { setCaseNoteView, caseNotesStatus, caseNotes, totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination } = this.props; // totalResults, caseNotesPagination, bookingId, caseNotesQuery, setPagination
    if (caseNotesStatus.Type !== 'SUCCESS') return <div>Loading Casenotes ...</div>;

    return (<div>

      <FilterToggle>
        <FilterForm {...this.props} />
      </FilterToggle>

      <div>
         { caseNotes.toJS().length === 0 ?  <h1 className="bold-medium">No records found matching search criteria.</h1> : null}
      </div>

      { caseNotes.map((caseNote) => <CaseNoteListItem action={() => setCaseNoteView(caseNote.get('caseNoteId'))} caseNote={caseNote} key={caseNote.get('caseNoteId')} />)}
      <PreviousNextNavigation pagination={caseNotesPagination} totalRecords={totalResults} pageAction={(id) => setPagination(bookingId, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)} />
    </div>);
  }
}

CaseNotesMobile.propTypes = {
  bookingId: PropTypes.number.isRequired,
  caseNotesStatus: PropTypes.object,
  caseNotes: PropTypes.object.isRequired,
  caseNotesPagination: PropTypes.object.isRequired,
  caseNotesQuery: PropTypes.object.isRequired,
  loadCaseNotes: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  setCaseNoteView: PropTypes.func.isRequired,
};

CaseNotesMobile.defaultProps = {
  caseNotesStatus: {  },
  totalResults: 0,
  showFiltersMobile: false,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadCaseNotes: (id, pagination, query) => dispatch(loadBookingCaseNotes(id, pagination, query)),
    setPagination: (id, pagination, query) => dispatch(setCaseNotesPagination(id, pagination, query)),
    setCaseNoteView: (id) => dispatch(setCaseNotesDetailView(id)),
    onSubmitForm: createFormAction((formData) => ({ type: CASE_NOTE_FILTER.BASE, payload: { query: formData.toJS(), resetPagination: true } }), [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]),

  };
}

const mapStateToProps = createStructuredSelector({
  caseNotes: selectCaseNotes(),
  caseNotesStatus: selectCaseNotesStatus(),
  caseNotesPagination: selectCaseNotesPagination(),
  caseNotesQuery: selectCaseNotesQuery(),
  bookingId: selectBookingDetailsId(),
  totalResults: selectTotalCaseNotes(),
  caseNoteFilters: caseNoteFilterSelectInfo(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotesMobile);
