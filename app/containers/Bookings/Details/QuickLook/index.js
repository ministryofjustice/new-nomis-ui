import React, { Component } from 'react';
import { FormattedNumber } from 'react-intl';
import { FormattedDate, FormattedTime } from 'components/intl';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import { properCaseName } from 'utils/stringUtils';
import DisplayValue from 'components/FormComponents/DisplayValue';
import { Link } from 'react-router';
import { toFullName } from 'utils/stringUtils';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import { Model as quickLookModel } from 'helpers/dataMappers/quickLook';
import { Model as offenderProfileModel } from 'helpers/dataMappers/offenderDetails';

import {
  loadQuickLook,
} from 'containers/Bookings/actions';

import './index.scss';

export const Balances = ({ spends, cash, savings, currency }) =>
  (<div>
    <div className="row border-bottom-line">

      <div className="col-lg-6 col-xs-6">
        <label>Spends</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <strong>
          <FormattedNumber
            id="spends"
            value={spends}
            style="currency"
            currency={currency}
          />
        </strong>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Private</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <strong>
          <FormattedNumber
            id="cash"
            value={cash}
            style="currency"
            currency={currency}
          />
        </strong>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Savings</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <strong>
          <FormattedNumber
            id="savings"
            value={savings}
            style="currency"
            currency={currency}
          />
        </strong>
      </div>
    </div>
  </div>);

export const OffenceDetails = ({ offences, releaseDate, indeterminateReleaseDate }) => (
  <div>
    {!offences.size && <div> No offence details are available at this time </div>}

    {offences.map((offence) =>
      (<div className="row border-bottom-line" key={uuid()}>
        <div className="col-lg-6 col-xs-6">
          <label>
            Main Offence/Offences
          </label>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b>
            {offence.get('type')}
          </b>
        </div>

      </div>)
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
);


export const Activities = ({ activities, period }) => (
  <div>
    <div className="row border-bottom-line">

      <div className="col-lg-6 col-xs-6">
        <label>{period}</label>
      </div>

      {(activities.size === 0) &&
        <div>
          <div className="col-lg-6 col-xs-6">
            <label>{"Today's"} schedule is empty</label>
          </div>
        </div>
      }
        {activities.map((activity,index) =>
          (<div className={`row border-bottom-line ${index === 0 && 'no-top-gutter'}`} key={uuid()}>

            <div className="col-lg-6 col-xs-6">
            </div>

            <div className="col-lg-6 col-xs-6">
              <span>
                <b> {activity.get('type')} </b>
                {activity.get('shortComment') && <b>{' - '}</b>}
              </span>

              <span>
                {activity.get('shortComment')}
              </span>
            </div>

            <div className="row add-padding-bottom">
              <div className="col-lg-6 col-xs-6"></div>
              <div className="col-lg-6 col-xs-6">
                {activity.get('startTime') && <FormattedTime value={activity.get('startTime')} />}
                {activity.get('endTime') &&
                  <span>
                    <span> - </span>
                    <FormattedTime value={activity.get('endTime')} />
                  </span>
                }
              </div>
            </div>
          </div>)
        )}
    </div>

  </div>
);


const NegativeAndPositiveCaseNoteCount = ({ negativeCaseNotes,positiveCaseNotes }) => (
  <div>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>IEP Warnings </label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <b> {negativeCaseNotes} </b>
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>IEP Encouragement</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <b> {positiveCaseNotes} </b>
        </b>
      </div>
    </div>
  </div>
);

export const Adjudications = ({ awards, proven }) => (
  <div>
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

    {(awards.size === 0) && <div className="add-gutter-margin-top">
      <div className="col-lg-6 col-xs-6">
        <label>Active adjudications</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b> No active awards </b>
      </div>
    </div> }

    {awards.map((award, index) => (<div key={uuid()} className="row add-gutter-margin-top">
      <div className="col-lg-6 col-xs-6">
        {index === 0 && <label>Active awards</label> }
      </div>

      <div className="col-lg-6 col-xs-6">
        <b> {award.get('durationText')} {award.get('sanctionCodeDescription')} </b>
        <div> {award.get('comment')} </div>
        <div> {award.get('effectiveDate') && <FormattedDate value={award.get('effectiveDate')} /> } </div>
      </div>
    </div>))}
  </div>
);

export const NextOfKin = ({ nextOfKin }) => (
  <div>
    { nextOfKin.size === 0 && <div>

      <div className="row border-bottom-line">
        <div className="col-lg-6 col-xs-6">
          <label>Next of kin</label>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b> No next of kin identified </b>
        </div>
      </div>
    </div>}

    { nextOfKin.map((kin, index) => (<div key={uuid()}>
      <div className="row border-bottom-line">
        <div className="col-lg-6 col-xs-6">
          {index === 0 && <label>Next of kin</label>}
        </div>

        <div className="col-lg-6 col-xs-6">
          <div>
            <b>
              {properCaseName(kin.get('lastName'))}, {properCaseName(kin.get('firstName'))}
              {properCaseName(kin.get('middleName'))}
            </b>
          </div>
          <div>
            <b>
              {kin.get('contactTypeDescription')}
              {kin.get('relationship') && `(${kin.get('relationship')})`}
            </b>
          </div>
        </div>
      </div>
    </div>))}
  </div>
);

export const Visits = ({ lastVisit, nextVisit }) => (<div>
    <h3 className="heading-medium">
      Visits
    </h3>

    { lastVisit.size > 0 && (
      <LastVisit
        date={lastVisit.get('date')}
        type={lastVisit.get('type')}
        status={lastVisit.get('status')}
        leadVisitor={lastVisit.get('leadVisitor')}
        cancellationReason={lastVisit.get('cancellationReason')}
      />
    )}
    { lastVisit.size === 0 && <div className="row">
      <div className="col-lg-6 col-xs-6">
        <label>Last visit date</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b> No visit history </b>
      </div>
    </div>}

    <div className="top-border add-gutter-margin-top">
      { nextVisit.size > 0 && (
        <NextVisit
          date={nextVisit.get('date')}
          type={nextVisit.get('type')}
          leadVisitor={nextVisit.get('leadVisitor')}
        />
      )}
      { nextVisit.size === 0 && <div className="row border-bottom-line">
        <div className="col-lg-6 col-xs-6">
          <label>Next visit date</label>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b> No upcoming visits </b>
        </div>
      </div>}
    </div>

  </div>)


export const LastVisit = ({ date, type, status, leadVisitor, cancellationReason }) => (<div>
  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label>Last visit date</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b><FormattedDate value={date} /> </b>
    </div>
  </div>

  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label className="shift-right">Type of visit</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> <DisplayValue value={type} /> </b>
    </div>
  </div>

  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label className="shift-right">Lead visitor</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> <DisplayValue value={leadVisitor} /> </b>
    </div>
  </div>

  <div className={`row ${cancellationReason ? 'border-bottom-line' : 'add-gutter-margin-top'}`}>
    <div className="col-lg-6 col-xs-6">
      <label className="shift-right">Visit status</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> <DisplayValue value={status} /> </b>
    </div>
  </div>

  {cancellationReason && <div className="row">
    <div className="col-lg-6 col-xs-6">
      <label className="shift-right">Reason </label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> {cancellationReason} </b>
    </div>
  </div> }

</div>)

export const NextVisit = ({ date, type, leadVisitor }) => (<div>
  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label>Next visit date</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b><FormattedDate value={date} /> </b>
    </div>
  </div>

  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label className="shift-right">Type of visit</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> <DisplayValue value={type} /> </b>
    </div>
  </div>

  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <label className="shift-right">Lead visitor</label>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> <DisplayValue value={leadVisitor} /> </b>
    </div>
  </div>

</div>)

const AssignedStaffMembers = ({ communityOffenderManager ,keyWorkerId }) =>
  (<div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Key worker</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b> { (keyWorkerId && <EliteOfficerName staffId={keyWorkerId} />) || 'Not assigned'} </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <label>Community Offender Manager</label>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b> { toFullName({
          firstName: communityOffenderManager.get('firstName'),
          lastName: communityOffenderManager.get('lastName') }) || 'Not assigned'} </b>
      </div>
    </div>

  </div>)

class QuickLook extends Component {
  componentDidMount() {
    const { loadViewModel, offenderNo } = this.props;

    loadViewModel(offenderNo);
  }

  render() {
    const { viewModel, offenderDetails, offenderNo } = this.props;
    const adjudications = viewModel.get('adjudications');
    const lastVisit = viewModel.get('lastVisit');
    const nextVisit = viewModel.get('nextVisit');

    const activities = viewModel.get('activities');
    const balance = viewModel.get('balance');
    const assignedStaffMembers = viewModel.get('assignedStaffMembers');

    return (
      <div className="quick-look">
        <div className="row">

          <div className="col-md-6 col-xs-12">
            <h3 className="heading-medium top-heading">
              Offences
            </h3>
            <OffenceDetails
              offences={viewModel.get('offences')}
              releaseDate={viewModel.get('releaseDate')}
              indeterminateReleaseDate={viewModel.get('indeterminateReleaseDate')}
            />
          </div>

          <div className="col-md-6 col-xs-12">
            <h3 className="heading-medium">
              Money
            </h3>
            <Balances
              spends={balance.get('spends')}
              cash={balance.get('cash')}
              savings={balance.get('savings')}
              currency={balance.get('currency')}
            />
          </div>

        </div>

        <div className="row">

          <div className="col-md-6 col-xs-12">
            <div>
              <h3 className="heading-medium">
                Case notes and adjudications (Last 3 months)
              </h3>

              <NegativeAndPositiveCaseNoteCount
                negativeCaseNotes={viewModel.get('negativeCaseNotes')}
                positiveCaseNotes={viewModel.get('positiveCaseNotes')}
              />
              <Adjudications
                awards={adjudications.get('awards')}
                proven={adjudications.get('proven')}
              />
            </div>
          </div>

          <div className="col-md-6 col-xs-12">
            <Visits nextVisit={nextVisit} lastVisit={lastVisit} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-xs-12">

            <div className="row">
              <div className="col-xs-12">
                <h3 className="heading-medium">
                  Assigned staff members
                </h3>

                <AssignedStaffMembers
                  communityOffenderManager={assignedStaffMembers.get('communityOffenderManager')}
                  keyWorkerId={offenderDetails.getIn(['keyworker','staffId'])}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <h3 className="heading-medium">
                    Other
                </h3>

                <NextOfKin nextOfKin={viewModel.get('nextOfKin')} />
              </div>
            </div>

          </div>
          <div className="col-md-6 col-xs-12">
            <h3 className="heading-medium">
              Schedule for today
            </h3>
            <Activities activities={activities.get('morningActivities')} period={'Morning (AM)'} />
            <Activities activities={activities.get('afternoonActivities')} period={'Afternoon (PM)'} />
            <Activities activities={activities.get('eveningDuties')} period={'Evening (ED)'} />

            <Link className="link" to={`/offenders/${offenderNo}/schedule`}> Seven day schedule</Link>
          </div>
        </div>
      </div>
    )
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    loadViewModel: (offenderNo) => dispatch(loadQuickLook(offenderNo)),
  }
}

const mapStateToProps = (immutableState, props) => {
  const data = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']) || offenderProfileModel;
  const viewModel = immutableState.getIn(['search', 'details', 'quickLookViewModel']) || quickLookModel;

  return {
    offenderNo: props.offenderNo,
    viewModel,
    offenderDetails: data,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickLook);