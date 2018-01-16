import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';


import AmendCaseNoteModal from 'containers/Bookings/Details/CaseNotes/AmendCaseNoteModal';

import { viewDetails } from 'containers/Bookings/actions';
import { DETAILS_TABS } from 'containers/Bookings/constants';

import {
  selectBookingDetailsId,
  selectScheduledEvents,
  selectHeaderDetail,
  selectCurrentFilter,
} from 'containers/Bookings/selectors'

import {
  DateTimeBlock,
} from './sharedCaseNoteComponents';

import './details-page.scss';

const AmendmentBlock = ({ dateTime, authorName, text }) => (<div className="row amendment add-gutter-top">
  <div className="content">
    <h2 className="heading-small">Amendment</h2>
    <p>
      {text}
    </p>
    <h2 className="heading-small">
      <DateTimeBlock dateTime={dateTime} />
    </h2>

    <div>
      {authorName}
    </div>
  </div>
</div>);


const CaseNoteDetails = (props) => {
  const { displayAmendCaseNoteModal, caseNote, backToCaseNotes,addAmendment } = props;

  if (!caseNote) {
    return <div>Loading..</div>
  }

  const {
    authorName,
    originalNoteText,
    occurrenceDateTime,
    subTypeDescription,
    typeDescription,
    amendments,
    bookingId,
  } = caseNote.toJS();
  const amendmentList = amendments.map((am) =>
    <AmendmentBlock
      key={am.creationDateTime}
      data-name={'AmendmentBlock'}
      dateTime={am.creationDateTime}
      authorName={am.authorName}
      text={am.additionalNoteText}
    />
  );

  return (
    <div className="case-note-details">
      {displayAmendCaseNoteModal ? <AmendCaseNoteModal /> : null}
       <div className="row add-gutter-top">

         <div className="col-lg-2">
           <Link className="link clickable" onClick={() => backToCaseNotes(bookingId)}> {'<'} Back to list </Link>
         </div>

         <div className="col-lg-7">
           <h2 className="heading-medium">
             {typeDescription} {'|'} {subTypeDescription}
           </h2>
           <p>
              {originalNoteText}
           </p>

           <h2 className="heading-small">
             <DateTimeBlock dateTime={occurrenceDateTime} />
           </h2>

           <div>
             {authorName}
           </div>
           {amendmentList}

           <div className="add-gutter-top add-gutter-bottom">
             <button className="button-cancel" onClick={() => addAmendment()}>Make amendment</button>
           </div>
         </div>
       </div>
    </div>
  );
}

CaseNoteDetails.propTypes = {
  caseNote: PropTypes.object.isRequired,
  displayAmendCaseNoteModal: PropTypes.bool.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    backToCaseNotes: (bookingId) => dispatch(viewDetails(bookingId, DETAILS_TABS.CASE_NOTES)),
    addAmendment: () => dispatch(push('/amendCaseNote')),
  }
}


const mapStateToProps = createStructuredSelector({
  bookingId: selectBookingDetailsId(),
});
export default connect(mapStateToProps, mapDispatchToProps)(CaseNoteDetails);

