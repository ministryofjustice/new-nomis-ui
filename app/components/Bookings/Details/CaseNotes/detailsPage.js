import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedDate, FormattedTime } from 'react-intl';


import { viewDetails } from 'containers/Bookings/actions';
import { DETAILS_TABS } from 'containers/Bookings/constants';

import {
  selectBookingDetailsId,
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
  const { caseNote, backToCaseNotes, addAmendment } = props;

  if (!caseNote) {
    return <div>Loading..</div>
  }

  const {
    authorName,
    originalNoteText,
    occurrenceDateTime,
    creationDateTime,
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
       <div className="row add-gutter-top">

         <div className="col-lg-2 add-gutter-bottom">
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
             <DateTimeBlock dateTime={creationDateTime} />
           </h2>

           <div>
             {authorName}
           </div>

           {occurrenceDateTime && <div>
               <span className="right-padding"> Occurrence date: </span>
               <span>
                  <FormattedDate value={occurrenceDateTime} /> - <FormattedTime value={occurrenceDateTime} />
              </span>
           </div>}

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
};

export function mapDispatchToProps(dispatch) {
  return {
    backToCaseNotes: (bookingId) => dispatch(viewDetails(bookingId, DETAILS_TABS.CASE_NOTES)),
    addAmendment: () => dispatch(push('/bookings/details/amendCaseNote')),
  }
}

const mapStateToProps = createStructuredSelector({
  bookingId: selectBookingDetailsId(),
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseNoteDetails);
