/* eslint-disable react/style-prop-object */
import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { Link } from 'react-router'
import { FormattedDate, FormattedTime } from '../../../../components/intl'

import { properCaseName, toFullName } from '../../../../utils/stringUtils'
import DisplayValue from '../../../../components/FormComponents/DisplayValue'
import EliteOfficerName from '../../../EliteContainers/OfficerName'
import ValueWithLabel from '../../../../components/ValueWithLabel'

import { Model as quickLookModel } from '../../../../helpers/dataMappers/quickLook'
import { Model as offenderProfileModel } from '../../../../helpers/dataMappers/offenderDetails'

import { loadQuickLook } from '../../actions'

import './index.scss'

export const Balances = ({ spends, cash, savings, currency }) => (
  <div>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>Spends</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <strong>
          <FormattedNumber id="spends" value={spends} style="currency" currency={currency} />
        </strong>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>Private</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <strong>
          <FormattedNumber id="cash" value={cash} style="currency" currency={currency} />
        </strong>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>Savings</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <strong>
          <FormattedNumber id="savings" value={savings} style="currency" currency={currency} />
        </strong>
      </div>
    </div>
  </div>
)

export const OffenceDetails = ({ offences, releaseDate, indeterminateReleaseDate }) => (
  <div>
    {!offences.size && <div> No offence details are available at this time </div>}

    {offences.map(offence => (
      <div className="row border-bottom-line" key={uuid()}>
        <div className="col-lg-6 col-xs-6">
          <span>Main Offence/Offences</span>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b>{offence.get('type')}</b>
        </div>
      </div>
    ))}

    {(releaseDate || indeterminateReleaseDate) && (
      <div className="row border-bottom-line">
        <div className="col-lg-6 col-xs-6">
          <span>Release date</span>
        </div>

        <div className="col-lg-6 col-xs-6">
          {releaseDate ? (
            <b>
              <FormattedDate value={releaseDate} />
            </b>
          ) : (
            <b>Indeterminate</b>
          )}
        </div>
      </div>
    )}
  </div>
)

export const Activities = ({ activities, period }) => (
  <div>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>{period}</span>
      </div>

      {activities.size === 0 && (
        <div>
          <div className="col-lg-6 col-xs-6">
            <span>{"Today's"} schedule is empty</span>
          </div>
        </div>
      )}
      {activities.map((activity, index) => (
        <div className={`row border-bottom-line ${index === 0 && 'no-top-gutter'}`} key={uuid()}>
          <div className="col-lg-6 col-xs-6" />

          <div className="col-lg-6 col-xs-6">
            <span>
              <b> {activity.get('type')} </b>
              {activity.get('shortComment') && <b> - </b>}
            </span>

            <span>{activity.get('shortComment')}</span>

            {activity.get('cancelled') && <span className="cancelled"> (cancelled)</span>}
          </div>

          <div className="row add-padding-bottom">
            <div className="col-lg-6 col-xs-6" />
            <div className="col-lg-6 col-xs-6">
              {activity.get('startTime') && <FormattedTime value={activity.get('startTime')} />}
              {activity.get('endTime') && (
                <span>
                  <span> - </span>
                  <FormattedTime value={activity.get('endTime')} />
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const NegativeAndPositiveCaseNoteCount = ({ negativeCaseNotes, positiveCaseNotes }) => (
  <div>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>IEP Warnings </span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <b> {negativeCaseNotes} </b>
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>IEP Encouragement</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <b> {positiveCaseNotes} </b>
        </b>
      </div>
    </div>
  </div>
)

export const Adjudications = ({ adjudications }) => {
  const awards = adjudications.get('awards')
  const proven = adjudications.get('proven')
  return (
    <div>
      <div className="row border-bottom-line">
        <div className="col-lg-6 col-xs-6">
          <span>Proven adjudications</span>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b> {proven || 0} </b>
        </div>
      </div>

      {awards.size === 0 && (
        <div className="add-gutter-margin-top">
          <div className="col-lg-6 col-xs-6">
            <span>Active adjudications</span>
          </div>

          <div className="col-lg-6 col-xs-6">
            <b> No active awards </b>
          </div>
        </div>
      )}

      {awards.map((award, index) => (
        <div key={uuid()} className="row add-gutter-margin-top">
          <div className="col-lg-6 col-xs-6">{index === 0 && <span>Active awards</span>}</div>
          <div className="col-lg-6 col-xs-6">
            <b>
              {' '}
              {award.get('durationText')} {award.get('sanctionCodeDescription')}{' '}
            </b>
            <div> {award.get('comment')} </div>
            <div> {award.get('effectiveDate') && <FormattedDate value={award.get('effectiveDate')} />} </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const KeyWorkerSessionDate = ({ lastKeyWorkerSessionDate }) => (
  <div className="row border-bottom-line">
    <div className="col-lg-6 col-xs-6">
      <span>Last Key worker activity</span>
    </div>

    <div className="col-lg-6 col-xs-6">
      <b> {lastKeyWorkerSessionDate ? <FormattedDate value={lastKeyWorkerSessionDate} /> : '--'} </b>
    </div>
  </div>
)

export const NextOfKin = ({ nextOfKin }) => (
  <div>
    {nextOfKin.size === 0 && (
      <div>
        <div className="row border-bottom-line">
          <div className="col-lg-6 col-xs-6">
            <span>Next of kin</span>
          </div>

          <div className="col-lg-6 col-xs-6">
            <b> No next of kin identified </b>
          </div>
        </div>
      </div>
    )}

    {nextOfKin.map((kin, index) => (
      <div key={uuid()}>
        <div className="row border-bottom-line">
          <div className="col-lg-6 col-xs-6">{index === 0 && <span>Next of kin</span>}</div>

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
      </div>
    ))}
  </div>
)

export const Visits = ({ lastVisit, nextVisit }) => (
  <div>
    <h3 className="heading-medium">Visits</h3>

    {lastVisit.size > 0 && (
      <LastVisit
        date={lastVisit.get('date')}
        type={lastVisit.get('type')}
        status={lastVisit.get('status')}
        leadVisitor={lastVisit.get('leadVisitor')}
        cancellationReason={lastVisit.get('cancellationReason')}
      />
    )}
    {lastVisit.size === 0 && (
      <div className="row">
        <div className="col-lg-6 col-xs-6">
          <span>Last visit date</span>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b> No visit history </b>
        </div>
      </div>
    )}

    <div className="top-border add-gutter-margin-top">
      {nextVisit.size > 0 && (
        <NextVisit
          date={nextVisit.get('date')}
          type={nextVisit.get('type')}
          leadVisitor={nextVisit.get('leadVisitor')}
        />
      )}
      {nextVisit.size === 0 && (
        <div className="row border-bottom-line">
          <div className="col-lg-6 col-xs-6">
            <span>Next visit date</span>
          </div>

          <div className="col-lg-6 col-xs-6">
            <b> No upcoming visits </b>
          </div>
        </div>
      )}
    </div>
  </div>
)

export const LastVisit = ({ date, type, status, leadVisitor, cancellationReason }) => (
  <div>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>Last visit date</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <FormattedDate value={date} />{' '}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span className="shift-right">Type of visit</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {' '}
          <DisplayValue value={type} />{' '}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span className="shift-right">Lead visitor</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {' '}
          <DisplayValue value={leadVisitor} />{' '}
        </b>
      </div>
    </div>

    <div className={`row ${cancellationReason ? 'border-bottom-line' : 'add-gutter-margin-top'}`}>
      <div className="col-lg-6 col-xs-6">
        <span className="shift-right">Visit status</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {' '}
          <DisplayValue value={status} />{' '}
        </b>
      </div>
    </div>

    {cancellationReason && (
      <div className="row">
        <div className="col-lg-6 col-xs-6">
          <span className="shift-right">Reason </span>
        </div>

        <div className="col-lg-6 col-xs-6">
          <b> {cancellationReason} </b>
        </div>
      </div>
    )}
  </div>
)

export const NextVisit = ({ date, type, leadVisitor }) => (
  <div>
    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span>Next visit date</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          <FormattedDate value={date} />{' '}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span className="shift-right">Type of visit</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {' '}
          <DisplayValue value={type} />{' '}
        </b>
      </div>
    </div>

    <div className="row border-bottom-line">
      <div className="col-lg-6 col-xs-6">
        <span className="shift-right">Lead visitor</span>
      </div>

      <div className="col-lg-6 col-xs-6">
        <b>
          {' '}
          <DisplayValue value={leadVisitor} />{' '}
        </b>
      </div>
    </div>
  </div>
)

export const AssignedStaffMembers = ({
  keyWorkerId,
  communityOffenderManager,
  offenderSupervisor,
  caseAdministrator,
  drugWorker,
}) => {
  const hasCommunityOffenderManager = communityOffenderManager && communityOffenderManager.size > 0
  const hasOffenderSupervisor = offenderSupervisor && offenderSupervisor.size > 0
  const hasCaseAdministrator = caseAdministrator && caseAdministrator.size > 0
  const hasDrugWorker = drugWorker && drugWorker.size > 0

  return (
    <div>
      {!keyWorkerId &&
        !hasCommunityOffenderManager &&
        !hasOffenderSupervisor &&
        !hasCaseAdministrator &&
        !hasDrugWorker && <p>No assigned staff members</p>}

      {keyWorkerId && (
        <ValueWithLabel label="Key Worker">
          <EliteOfficerName staffId={keyWorkerId} />
        </ValueWithLabel>
      )}
      {hasCommunityOffenderManager && (
        <ValueWithLabel label="Community Offender Manager">
          {toFullName({
            firstName: communityOffenderManager.get('firstName'),
            lastName: communityOffenderManager.get('lastName'),
          })}
        </ValueWithLabel>
      )}
      {hasOffenderSupervisor && (
        <ValueWithLabel label="Offender Supervisor">
          {toFullName({
            firstName: offenderSupervisor.get('firstName'),
            lastName: offenderSupervisor.get('lastName'),
          })}
        </ValueWithLabel>
      )}
      {hasCaseAdministrator && (
        <ValueWithLabel label="Case Administrator">
          {toFullName({
            firstName: caseAdministrator.get('firstName'),
            lastName: caseAdministrator.get('lastName'),
          })}
        </ValueWithLabel>
      )}
      {hasDrugWorker && (
        <ValueWithLabel label="Drug Worker">
          {toFullName({
            firstName: drugWorker.get('firstName'),
            lastName: drugWorker.get('lastName'),
          })}
        </ValueWithLabel>
      )}
    </div>
  )
}

class QuickLook extends Component {
  componentDidMount() {
    const { loadViewModel, offenderNo } = this.props

    loadViewModel(offenderNo)
  }

  render() {
    const { viewModel, offenderDetails, offenderNo } = this.props
    const adjudications = viewModel.get('adjudications')
    const lastVisit = viewModel.get('lastVisit')
    const nextVisit = viewModel.get('nextVisit')
    const activities = viewModel.get('activities')
    const balance = viewModel.get('balance')
    const assignedStaffMembers = viewModel.get('assignedStaffMembers')

    return (
      <div className="quick-look">
        <div className="row">
          <div className="col-md-6 col-xs-12">
            <h3 className="heading-medium top-heading">Offences</h3>
            <OffenceDetails
              offences={viewModel.get('offences')}
              releaseDate={viewModel.get('releaseDate')}
              indeterminateReleaseDate={viewModel.get('indeterminateReleaseDate')}
            />
          </div>

          <div className="col-md-6 col-xs-12">
            <h3 className="heading-medium">Money</h3>
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
              <h3 className="heading-medium">Case notes and adjudications (Last 3 months)</h3>

              <NegativeAndPositiveCaseNoteCount
                negativeCaseNotes={viewModel.get('negativeCaseNotes')}
                positiveCaseNotes={viewModel.get('positiveCaseNotes')}
              />
              <Adjudications adjudications={adjudications} />
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
                <h3 className="heading-medium">Assigned staff members</h3>

                <AssignedStaffMembers
                  keyWorkerId={offenderDetails.getIn(['keyworker', 'staffId'])}
                  communityOffenderManager={assignedStaffMembers.get('communityOffenderManager')}
                  offenderSupervisor={assignedStaffMembers.get('offenderSupervisor')}
                  caseAdministrator={assignedStaffMembers.get('caseAdministrator')}
                  drugWorker={assignedStaffMembers.get('drugWorker')}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <h3 className="heading-medium">Other</h3>

                <NextOfKin nextOfKin={viewModel.get('nextOfKin')} />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <h3 className="heading-medium">Key worker activity</h3>

                <KeyWorkerSessionDate lastKeyWorkerSessionDate={viewModel.get('lastKeyWorkerSessionDate')} />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xs-12">
            <h3 className="heading-medium">Schedule for today</h3>
            <Activities activities={activities.get('morningActivities')} period="Morning (AM)" />
            <Activities activities={activities.get('afternoonActivities')} period="Afternoon (PM)" />
            <Activities activities={activities.get('eveningDuties')} period="Evening (ED)" />

            <Link className="link" to={`/offenders/${offenderNo}/schedule`}>
              {' '}
              Seven day schedule
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    loadViewModel: offenderNo => dispatch(loadQuickLook(offenderNo)),
  }
}

const mapStateToProps = (immutableState, props) => {
  const data =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']) || offenderProfileModel
  const viewModel = immutableState.getIn(['search', 'details', 'quickLookViewModel']) || quickLookModel

  return {
    offenderNo: props.offenderNo,
    viewModel,
    offenderDetails: data,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickLook)
