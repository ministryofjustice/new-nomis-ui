import React, { Component } from 'react';
import { FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { properCaseName } from 'utils/stringUtils';
import DisplayValue from 'components/FormComponents/DisplayValue';
import { Link } from 'react-router';

import {
  selectBookingDetailsId,
  selectQuickLookViewModel,
  selectOffenderDetails,
} from 'containers/Bookings/selectors'

import {
  loadQuickLook,
} from 'containers/Bookings/actions';

import './index.scss';

export const Details = ({ age, religion, ethnicity }) =>
  <div className="quick-look">

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Age</label>
      </div>
      <div className="col-lg-6 col-xs-6">
        <b>
          {age}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Religion</label>
      </div>
      <div className="col-lg-6 col-xs-6">
        <b>
          <DisplayValue value={religion} />
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Ethnicity</label>
      </div>
      <div className="col-lg-6 col-xs-6">
        <b>
          <DisplayValue value={ethnicity} />
        </b>
      </div>
    </div>

  </div>

export const Balances = ({ spends, cash, savings, currency }) =>
<div>
    <div className="row border-bottom-line">

       <div className="col-lg-6 col-xs-6">
          <label>Spends</label>
       </div>

       <div className="col-lg-6 col-xs-6">
         <b>
           <FormattedNumber
             id="spends"
             value={spends || 0}
             style="currency"
             currency={currency}
           />
         </b>
       </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Private</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <FormattedNumber
            id="cash"
            value={cash || 0}
            style="currency"
            currency={currency}
          />
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Savings</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <FormattedNumber
            id="savings"
            value={savings || 0}
            style="currency"
            currency={currency}
          />
        </b>
      </div>
    </div>
</div>

export const OffenceDetails = ({ offences, releaseDate, indeterminateReleaseDate }) =>
  <div>

    {!offences && <div> No offence details are available at this time </div>}

    {(offences || []).map((offence, index) =>
    <div className="row border-bottom-line" key={`${offence}_${index}`}>
      <div className="col-lg-6 col-xs-6">
        <label>
          Main Offence/Offences
        </label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {offence.type}
        </b>
      </div>

    </div>
    )}

    {(releaseDate || indeterminateReleaseDate) &&
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>
          Release date
        </label>
      </div>

      <div className="col-lg-6 col-xs-6">
        {releaseDate ?
        <b>
          <FormattedDate value={releaseDate} />
        </b>
          :
        <b>Indeterminate</b>
        }
      </div>
    </div>
    }

  </div>

export const Activities = ({ activities, period }) => <div>

  <div className="row border-bottom-line">

    <div className="col-lg-6 col-xs-6">
        <label>{period}</label>
    </div>

    {(!activities || activities.length === 0) &&
      <div>
        <div className="col-lg-6 col-xs-6">
          <label>{"Today's"} schedule is empty</label>
        </div>
      </div>
    }

    {(activities || []).map((activity, index) =>
      <div className="row border-bottom-line" key={`${activity}_${index}_${period}`}>

        <div className="col-lg-6 col-xs-6">
        </div>

        <div className="col-lg-6 col-xs-6">
          <span>
            <b> {activity.type} </b>
            {activity.shortComment && <b>{' - '}</b>}
          </span>

          <span>
            {activity.shortComment}
          </span>
        </div>
        <div className="row add-padding-bottom">
          <div className="col-lg-6 col-xs-6">
          </div>
          <div className="col-lg-6 col-xs-6">
            <FormattedTime value={activity.startTime} /> {activity.endTime &&
            <span>
             <span> - </span>
             <FormattedTime value={activity.endTime} />
            </span>}
          </div>
       </div>
      </div>
    )}

  </div>

</div>

const NegativeAndPositiveCaseNoteCount = ({ negativeCaseNotes,positiveCaseNotes }) => <div>
<div className="row border-bottom-line">
  <div className="col-lg-6 col-xs-6">
    <label>Negative entries total</label>
  </div>

  <div className="col-lg-6 col-xs-6">
    <b>
      <b> {negativeCaseNotes} </b>
    </b>
  </div>
</div>

<div className="row border-bottom-line">
  <div className="col-lg-6 col-xs-6">
    <label>Positive entries total</label>
  </div>

  <div className="col-lg-6 col-xs-6">
    <b>
      <b> {positiveCaseNotes} </b>
    </b>
  </div>
</div>
</div>

export const Adjudications = ({ awards, proven }) => <div>
  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label>Proven adjudications</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b>
        <b> {proven} </b>
      </b>
    </div>
  </div>

   {(!awards || awards.length === 0) && <div className="add-gutter-margin-top">
    <div className="col-lg-6 col-xs-6">
       <label>Active adjudications</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> No active awards </b>
    </div>
  </div> }

  {(awards || []).map((award, index) => <div className="row add-gutter-margin-top">
    <div className="col-lg-6 col-xs-6">
      {index === 0 && <label>Active awards</label> }
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> {award.durationText} {award.sanctionCodeDescription} </b>
      <div> {award.comment} </div>
      <div> <FormattedDate value={award.effectiveDate} /> </div>
    </div>
  </div>)}

</div>

export const NextOfKin = ({ nextOfKin = [] }) => <div>

  { nextOfKin.length === 0 && <div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Next of kin</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b> No next of kin identified </b>
      </div>
    </div>
  </div>}

  { nextOfKin.map((kin, index) => <div key={`${kin.firstName}_${kin.lastName}_${index}`}>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        {index === 0 && <label>Next of kin</label>}
      </div>

      <div className="col-lg-6 col-xs-6">
        <div>
        <b>
          {`${kin.lastName && properCaseName(kin.lastName)}, ${kin.firstName && properCaseName(kin.firstName)} `}
          {kin.middleName && `${properCaseName(kin.middleName)} `}
        </b>
        </div>
        <div>
        <b>
          {kin.contactTypeDescription && `${kin.contactTypeDescription} `}
          {kin.relationship && `(${kin.relationship})`}
        </b>
      </div>
      </div>
    </div>
  </div>)}
</div>

class QuickLook extends Component {

  componentDidMount() {
    const { loadViewModel, bookingId } = this.props;
    
    loadViewModel(bookingId);
  }

  render() {
    const { viewModel, offenderDetails } = this.props;

    if (!viewModel) { return <div>Loading....</div> }

    const { balance, offences, releaseDate, indeterminateReleaseDate, activities, positiveCaseNotes, negativeCaseNotes, nextOfKin, adjudications } = (viewModel && viewModel.toJS());
    const { awards, proven } = adjudications;

    return (<div className="quick-look">

      <div className="row">

        <div className="visible-xs">
          <h2 className="heading-large">
            Quick look
          </h2>
        </div>

        <div className="col-md-6 col-xs-12">
          <h3 className="heading-medium">
            Personal details
          </h3>

          <Details {...offenderDetails} />
        </div>

        <div className="col-md-6 col-xs-12">
          <h3 className="heading-medium">
            Offences
          </h3>
           <OffenceDetails offences={offences} releaseDate={releaseDate} indeterminateReleaseDate={indeterminateReleaseDate} />
        </div>
      </div>

     <div className="row">

       <div className="col-md-6 col-xs-12">
         <h3 className="heading-medium">
           Money
         </h3>
             <Balances {...balance} />
       </div>


       <div className="col-md-6 col-xs-12">
         <h3 className="heading-medium">
           Other
         </h3>

         <NextOfKin nextOfKin={nextOfKin} />
       </div>

     </div>

      <div className="row">

        <div className="col-md-6 col-xs-12">

          <h3 className="heading-medium">
            Case notes and adjudications
          </h3>

          <NegativeAndPositiveCaseNoteCount negativeCaseNotes={negativeCaseNotes} positiveCaseNotes={positiveCaseNotes} />
          <Adjudications awards={awards} proven={proven} />
        </div>

        <div className="col-md-6 col-xs-12">
          <h3 className="heading-medium">
            Schedule for today
          </h3>
          { activities && <Activities activities={activities.morningActivities} period={'Morning (AM)'} /> }
          { activities && <Activities activities={activities.afternoonActivities} period={'Afternoon (PM)'} /> }
          { !activities && <div>No activity assigned</div> }

          <Link className="link" to={'/bookings/details/scheduled'}> Seven day schedule</Link>
        </div>
      </div>

    </div>)
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    loadViewModel: (bookingId) => dispatch(loadQuickLook(bookingId)),
  }
}

const mapStateToProps = createStructuredSelector({
  bookingId: selectBookingDetailsId(),
  viewModel: selectQuickLookViewModel(),
  offenderDetails: selectOffenderDetails(),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickLook);