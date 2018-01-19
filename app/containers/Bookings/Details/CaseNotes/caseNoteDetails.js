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
    const { viewList, caseNoteDetails } = this.props;

    return (caseNoteDetails &&
     <div>
       <CaseNoteDetailsBlock
         viewList={viewList} caseNote={caseNoteDetails}
       />
     </div>) || null;
  }
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

const mapStateToProps = createStructuredSelector({
  caseNoteDetails: selectCaseNoteDetails(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);
