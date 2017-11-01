import React, { Component } from 'react';
import { FormattedNumber, FormattedDate,FormattedTime } from 'react-intl';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectBookingDetailsId,
  selectQuickLookViewModel,
  selectOffenderDetails,
} from 'containers/Bookings/selectors'


import {
  loadQuickLook,
} from 'containers/Bookings/actions';

import './index.scss';

class HiddenInformation extends Component {

  constructor() {
    super();

    this.showDetails = this.showDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);
  }

  componentWillMount() {
    this.setState({ hidden: true });
  }

  showDetails() {
    this.setState({ hidden: false })
  }

  hideDetails() {
    this.setState({ hidden: true })
  }

  render() {
    if (this.state.hidden) {
      return (<div>
          <div className="link" role="button" onClick={this.showDetails}>
            &#9658;
            Show details
        </div>
       </div>)
    }
    return (<div>
      <div>
        <div className="link" role="button" onClick={this.hideDetails}>
          &#9660;
          Hide details
        </div>
      </div>
        {this.props.children}
      </div>)
  }
}

const Details = ({ age, gender, ethnicity }) =>
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
        <label>Gender</label>
      </div>
      <div className="col-lg-6 col-xs-6">
        <b>
          {gender}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Ethnicity</label>
      </div>
      <div className="col-lg-6 col-xs-6">
        <b>
          {ethnicity || '--'}
        </b>
      </div>
    </div>

  </div>

const Balances = ({ spends, cash, savings,currency }) =>
  <div className="panel panel-border-narrow">

    <div className="row border-bottom-line">

       <div className="col-lg-6 col-xs-6">
          <label>Spends</label>
       </div>

       <div className="col-lg-6 col-xs-6">
         <b>
           <FormattedNumber
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
            value={savings || 0}
            style="currency"
            currency={currency}
          />
        </b>
      </div>
    </div>
</div>

const SentenceDetail = ({ type, releaseDate }) =>
  <div className="panel panel-border-narrow">

    <div className="row border-bottom-line">
        <div className="col-lg-6 col-xs-6">
          <label>
            Type
          </label>
        </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {type}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>
          Release date
        </label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <FormattedDate value={releaseDate} />
        </b>
      </div>
    </div>

  </div>

const Activities = ({ activities }) => <div>
    {(activities.morningActivities || []).map((activity,index) =>
      <div className="row border-bottom-line" key={`${activity}_${index}_am`}>
         <div className="col-lg-6">
           {index === 0 && <label>Morning (AM)</label>}
         </div>

        <div className="col-lg-3">
          <b>
            {activity.description}
          </b>
        </div>
        <div className="col-lg-3">
          <FormattedTime value={activity.startTime} /> {activity.endTime && <span>
          <span> - </span>
          <FormattedTime value={activity.endTime} />
        </span>}
        </div>
      </div>
    )}

  {(activities.afternoonActivities || []).map((activity,index) =>
    <div className="row border-bottom-line" key={`${activity}_${index}_pm`}>
      <div className="col-lg-6">
        {index === 0 && <label>Afternoon (PM)</label>}
      </div>

      <div className="col-lg-3">
        <b>
          {activity.description}
        </b>
      </div>
      <div className="col-lg-3">
        <FormattedTime value={activity.startTime} /> {activity.endTime && <span>
        <span> - </span>
        <FormattedTime value={activity.endTime} />
      </span>}
      </div>
    </div>
  )}
</div>


class QuickLook extends Component {

  componentDidMount() {
    const { loadViewModel,bookingId } = this.props;
    
    loadViewModel(bookingId);
  }

  render() {
    const { viewModel,offenderDetails } = this.props;

    if (!viewModel) { return <div>Loading....</div> }

    const { balance,sentence, activities } = (viewModel && viewModel.toJS());

    return (<div className="quick-look">

      <div className="row">

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
          { sentence && <HiddenInformation> <SentenceDetail {...sentence} /> </HiddenInformation>}
          { !sentence && <div> No offence details are available at this time </div> }
        </div>
      </div>
       <div className="row">

         <div className="col-md-6">
           <h3 className="heading-medium">
             Money
           </h3>

            <HiddenInformation>
                 <Balances {...balance} />
            </HiddenInformation>
         </div>

        <div className="col-md-6">
          <h3 className="heading-medium">
            Prison activities
          </h3>
          { activities && <Activities activities={activities} /> }
          { !activities && <div>No activity assigned</div>}
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