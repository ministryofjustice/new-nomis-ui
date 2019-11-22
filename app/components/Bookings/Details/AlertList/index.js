import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styled from 'styled-components'
import { List } from 'immutable'

import { FormattedDate } from '../../../intl'
import colours from '../../../../theme/colours'
import { ButtonCancel } from '../../../FormComponents'

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: none;
  margin-top: 1em;
  margin-bottom: 1em;
`

const Th = styled.th`
  font-size: 16px;
`

const ThSixth = styled(Th)`
  width: 16.666%;
`

const ThThird = styled(Th)`
  width: 33.333%;
`

const TrBody = styled.tr`
  color: ${props => (props.active ? 'black' : '#6F777B')};
  border-bottom: solid 1px #bfc1c3;
`

const Td = styled.td`
  vertical-align: top;
  overflow: hidden;
  border: none;
  font-size: 16px;
  padding: 25px 15px 25px 0;
  ${props => props.rightAlign && 'text-align: right'}
`

const TdAlertType = styled(Td)`
  font-weight: bold;
  ${props => props.active && `color: ${colours.bookings.details.alerts.warningTextColour}`};
`

const TdNotes = styled(Td)`
  font-size: 14px;
`

const P = styled.p`
  margin: 0;
`

const PMobile = styled(P)`
  overflow: hidden;
  font-size: 14px;
  line-height: 1.4;
`

const PAlertType = styled(PMobile)`
  font-weight: bold;
  color: ${props => (props.active ? colours.bookings.details.alerts.warningTextColour : '#6F777B')};
`

const MobileAlertRecord = styled.div`
  color: ${props => (props.active ? 'black' : '#6F777B')};
  padding: 11px 0 1px 0;
  font-size: 14pt;
  border-bottom: solid 1px #bfc1c3;
`

const MobileHeading = styled.h3`
  margin-bottom: 12px;
`

const MobileRow = styled.div`
  padding: 0 0 10px 0;
`

const MobileColumn = styled.div`
  padding: 0 5px 0 0;
`

const VerticalSpace = styled.div`
  padding: 20px 0;
`

const formatName = (alert, firstNameKey, lastNameKey) => {
  const titleCase = s => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`

  const firstName = alert.get(firstNameKey)
  const lastName = alert.get(lastNameKey)
  if (firstName) {
    return lastName ? `${titleCase(lastName)}, ${titleCase(firstName)}` : titleCase(firstName)
  }
  return lastName ? titleCase(lastName) : null
}

const formatAlertType = alert => `${String(alert.get('alertTypeDescription'))} (${alert.get('alertType')})`
const formatAlert = a => `${a.get('alertCodeDescription')} (${a.get('alertCode')})`

const DesktopAlertItems = ({ alerts, active, canUpdateAlerts, prisonStaffHubUrl, offenderNo, userCanEdit }) => (
  <Table>
    {active ? (
      <caption className="bold-medium add-gutter-bottom">Active alerts</caption>
    ) : (
      <caption className="bold-medium add-gutter-bottom">Inactive alerts</caption>
    )}

    <thead>
      <tr>
        <ThSixth>Type of alert</ThSixth>
        <ThSixth>Alert</ThSixth>
        <ThThird>Notes</ThThird>
        {active ? <ThSixth>Effective date</ThSixth> : <ThSixth>Effective / Expired date</ThSixth>}
        {active ? <ThSixth>Created by</ThSixth> : <ThSixth>Created / Expired by</ThSixth>}
        {active && canUpdateAlerts && userCanEdit && <ThSixth />}
      </tr>
    </thead>
    <tbody>
      {alerts.map(alert => {
        const alertId = alert.get('alertId')

        return (
          <TrBody active={active} key={alertId}>
            <TdAlertType active={active}>{formatAlertType(alert)}</TdAlertType>
            <Td>{formatAlert(alert)}</Td>
            <TdNotes>{alert.get('comment') ? alert.get('comment') : '―'}</TdNotes>
            <Td>
              <P>
                <FormattedDate value={alert.get('dateCreated')} />
              </P>
              {!active && (
                <P>
                  <FormattedDate value={alert.get('dateExpires')} />
                </P>
              )}
            </Td>
            <Td>
              <P>{formatName(alert, 'addedByFirstName', 'addedByLastName')}</P>
              {!active && <P>{formatName(alert, 'expiredByFirstName', 'expiredByLastName')}</P>}
            </Td>
            {active && canUpdateAlerts && userCanEdit && (
              <Td rightAlign>
                <ButtonCancel
                  data-qa="close-alert-button"
                  onClick={() =>
                    window.location.assign(`${prisonStaffHubUrl}edit-alert?offenderNo=${offenderNo}&alertId=${alertId}`)
                  }
                >
                  Edit / Close
                </ButtonCancel>
              </Td>
            )}
          </TrBody>
        )
      })}
    </tbody>
  </Table>
)

DesktopAlertItems.propTypes = {
  alerts: ImmutablePropTypes.list.isRequired,
  active: PropTypes.bool.isRequired,
  canUpdateAlerts: PropTypes.bool,
  userCanEdit: PropTypes.bool,
  prisonStaffHubUrl: PropTypes.string,
  offenderNo: PropTypes.string,
}

DesktopAlertItems.defaultProps = {
  canUpdateAlerts: false,
  userCanEdit: true,
  prisonStaffHubUrl: undefined,
  offenderNo: undefined,
}

const MobileAlertItems = ({ alerts, active }) => (
  <div>
    {active ? (
      <MobileHeading className="bold-medium">Active alerts</MobileHeading>
    ) : (
      <MobileHeading className="bold-medium">Inactive alerts</MobileHeading>
    )}

    {alerts.map(alert => (
      <MobileAlertRecord active={active} key={alert.get('alertId')}>
        <MobileRow className="row">
          <MobileColumn className="col-xs-6">
            <PAlertType active={active}>{formatAlertType(alert)}</PAlertType>
            <PMobile active={active}>{formatAlert(alert)}</PMobile>
          </MobileColumn>
          <MobileColumn className="col-xs-6">
            <PMobile>{alert.get('comment') ? alert.get('comment') : '―'}</PMobile>
          </MobileColumn>
        </MobileRow>
        <MobileRow className="row">
          <MobileColumn className="col-xs-6">
            <PMobile>
              <FormattedDate value={alert.get('dateCreated')} />
            </PMobile>
            {!active && (
              <PMobile>
                <FormattedDate value={alert.get('dateExpires')} />
              </PMobile>
            )}
          </MobileColumn>
          <MobileColumn className="col-xs-6">
            <PMobile>{formatName(alert, 'addedByFirstName', 'addedByLastName')}</PMobile>
            {!active && <PMobile>{formatName(alert, 'expiredByFirstName', 'expiredByLastName')}</PMobile>}
          </MobileColumn>
        </MobileRow>
      </MobileAlertRecord>
    ))}
  </div>
)

MobileAlertItems.propTypes = {
  alerts: ImmutablePropTypes.list.isRequired,
  active: PropTypes.bool.isRequired,
}

const ActiveAlertItems = ({ alerts, desktop, canUpdateAlerts, prisonStaffHubUrl, offenderNo, userCanEdit }) => {
  if (alerts.size < 1) return false
  return (
    <div>
      {desktop ? (
        <DesktopAlertItems
          alerts={alerts}
          active
          canUpdateAlerts={canUpdateAlerts}
          userCanEdit={userCanEdit}
          prisonStaffHubUrl={prisonStaffHubUrl}
          offenderNo={offenderNo}
        />
      ) : (
        <MobileAlertItems alerts={alerts} active />
      )}
    </div>
  )
}

ActiveAlertItems.propTypes = {
  alerts: ImmutablePropTypes.list.isRequired,
  desktop: PropTypes.bool.isRequired,
  canUpdateAlerts: PropTypes.bool.isRequired,
  userCanEdit: PropTypes.bool.isRequired,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  offenderNo: PropTypes.string.isRequired,
}

const InactiveAlertItems = ({ alerts, desktop }) => {
  if (alerts.size < 1) return false
  return (
    <div>
      {desktop ? (
        <DesktopAlertItems alerts={alerts} active={false} />
      ) : (
        <MobileAlertItems alerts={alerts} active={false} />
      )}
    </div>
  )
}

InactiveAlertItems.propTypes = {
  alerts: ImmutablePropTypes.list.isRequired,
  desktop: PropTypes.bool.isRequired,
}

const AlertList = ({ alerts, deviceFormat, canUpdateAlerts, prisonStaffHubUrl, offenderNo, userCanEdit }) => {
  if (alerts.size < 1) {
    return <h1 className="bold-medium">There are no alerts for this offender.</h1>
  }

  const activeAlerts = alerts.filter(alert => !alert.get('expired'))
  const expiredAlerts = alerts.filter(alert => alert.get('expired'))
  const desktop = deviceFormat === 'desktop'

  return (
    // The Integration tests use alert-tables class to select content. This class doesn't have any CSS styles attached.
    <div className="alert-tables">
      <ActiveAlertItems
        alerts={activeAlerts}
        desktop={desktop}
        canUpdateAlerts={canUpdateAlerts}
        userCanEdit={userCanEdit}
        prisonStaffHubUrl={prisonStaffHubUrl}
        offenderNo={offenderNo}
      />
      {activeAlerts && expiredAlerts && <VerticalSpace />}
      <InactiveAlertItems alerts={expiredAlerts} desktop={desktop} />
    </div>
  )
}

AlertList.propTypes = {
  alerts: ImmutablePropTypes.list,
  deviceFormat: PropTypes.string.isRequired,
  prisonStaffHubUrl: PropTypes.string,
  canUpdateAlerts: PropTypes.bool,
  userCanEdit: PropTypes.bool,
  offenderNo: PropTypes.string,
}

AlertList.defaultProps = {
  alerts: List([]),
  canUpdateAlerts: false,
  userCanEdit: true,
  prisonStaffHubUrl: undefined,
  offenderNo: undefined,
}

export default AlertList
