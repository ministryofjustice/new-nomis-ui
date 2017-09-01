import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CaseNoteListItem from 'components/Bookings/Details/CaseNotes/listItem';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import { loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { MarginFix } from './caseNoteList.theme';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';
import { LoadingMessage } from 'components/CommonTheme';
import FilterForm from './filterForm';

import{
  selectCaseNotesQuery,
  selectCaseNotesPagination,
  selectBookingDetailsId
} from '../../selectors';

import {
  selectCaseNotes,
  selectCaseNotesStatus,
  selectTotalCaseNotes
} from './selectors';

import {
  setCaseNotesPagination,
  setCaseNotesDetailView,
} from '../../actions';

const ArrowUp = ({toggle}) => <span className="clickable" onClick={toggle}> &#9650; </span>
const ArrowDown = ({toggle}) => <span className="clickable" onClick={toggle}> &#9660;  </span>

class FilterToggle extends PureComponent {

  constructor(){
    super();
    this.toggleClick = this.toggleClick.bind(this);
  }

  componentWillMount(){
    this.setState({show: false});
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
            <span> Hide filters </span>
            <span> <ArrowDown/> </span>
          </span> :

          <span>
            <span> Show filters </span>
            <span> <ArrowUp/> </span>
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

    return (
      <div>
        {caseNotesStatus.Type === 'SUCCESS' ?
          <div>
            <FilterToggle>
              <FilterForm {...this.props} />
            </FilterToggle>
            <div>
              <NoSearchResultsReturnedMessage resultCount={caseNotes.toJS().length}/>
            </div>
            <div>
              {caseNotes.map((caseNote) => <CaseNoteListItem action={() => setCaseNoteView(caseNote.get('caseNoteId'))}
                                                             caseNote={caseNote} key={caseNote.get('caseNoteId')}/>)}
            </div>
            <PreviousNextNavigation pagination={caseNotesPagination} totalRecords={totalResults} pageAction={(id) => setPagination(bookingId, { perPage: caseNotesPagination.perPage, pageNumber: id }, caseNotesQuery)} />
          </div>
          :
          <LoadingMessage>Loading case notes ...</LoadingMessage>
        }
      </div>
    );
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
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotesMobile);
