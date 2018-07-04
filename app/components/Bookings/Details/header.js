import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import { Link } from 'react-router';

import { toFullName } from 'utils/stringUtils';
import { offenderImageUrl } from 'containers/Bookings/constants';

import './header.scss';

const Alerts = ({ activeAlertCount, inactiveAlertCount }) => <div className="alerts">
  <span className="active-alert">
    <strong>{activeAlertCount}</strong>
    <span> active </span>
  </span>
  <span>
    <strong className="inactive-alert">{inactiveAlertCount}</strong>
    <span> inactive </span>
  </span>
</div>;

const Location = ({ assignedLivingUnit }) =>
  <div>
    <label>Location</label>

    <div>
      <strong>{assignedLivingUnit && assignedLivingUnit.get('description')}</strong>
    </div>

    <div>
      <strong>{assignedLivingUnit && assignedLivingUnit.get('agencyName')}</strong>
    </div>
  </div>;


const MiddleSection = ({ inmateData, offenderNo }) => {
  let cat = inmateData.get('category');
  if (cat && cat.startsWith('Cat ')) {
    cat = cat.substr(4);
  }
  return (
    <div className="middle-section">
      <div className="col-xs-4 col-sm-3">
        <div className="row">
          <div className="col">
            <label>IEP</label>
            <strong>{inmateData.get('iepLevel') || '--'}</strong>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label>CSRA</label>
            <strong>{inmateData.get('csra') || '--'}</strong>
          </div>
        </div>

        {cat && <div className="row">
          <div className="col">
            <label>Category</label>
            <strong>{cat}</strong>
          </div>
        </div>}
      </div>

      <div className="visible-large">
        <div className="col-xs-6 col-sm-3">
          <div className="row">

            <div className="col">
              <label>Alerts</label>
              <Alerts activeAlertCount={inmateData.get('activeAlertCount')} inactiveAlertCount={inmateData.get('inactiveAlertCount')} />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Location assignedLivingUnit={inmateData.get('assignedLivingUnit')} />
            </div>
          </div>
        </div>
      </div>

      <div className="visible-small">
        <div className="col-xs-4">
          <div className="row">
            <div className="col">
              <label>Alerts</label>
              <Alerts activeAlertCount={inmateData.get('activeAlertCount')} inactiveAlertCount={inmateData.get('inactiveAlertCount')} />
            </div>
          </div>

        </div>

        <div className="col-xs-4">
          <div className="row">
            <div className="col">
              <Location assignedLivingUnit={inmateData.get('assignedLivingUnit')} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-6 col-sm-3">
        <div>
          <Link className="button-link" to={`/offenders/${offenderNo}/addCaseNote`}>Add case note</Link>
        </div>
        <div className="add-gutter-margin-top">
          <Link className="button-link" to={`/offenders/${offenderNo}/addAppointment`}>Add appointment</Link>
        </div>
      </div>
    </div>);
};

function Header({ inmateData, onImageClick, offenderNo }) {
  const nameString = toFullName({ firstName: inmateData.get('firstName'), lastName: inmateData.get('lastName') });
  const alerts = inmateData.get('alerts');
  let acct = false;
  let assaulter = false;
  let disability = false;
  let arsonist = false;

  alerts && alerts.forEach(a => {
    switch (a.get('alertCode')) {
      case 'HA': acct = true; break;
      case 'SA': assaulter = true; break;
      case 'XA': arsonist = true; break;
      case 'PEEP': disability = true; break;
      default:
    }
  });

  const nameAndFlags = (<div className="row">
    <div className="col-md-12">
      <h1 className="heading-medium inline-header">
        {nameString}
      </h1>
      {acct && <span className="acctStatus">ACCT OPEN</span>}
      {assaulter && <span className="assaultStatus">STAFF ASSAULTER</span>}
      {arsonist && <span className="arsonistStatus"><img src="/img/Arsonist_icon.png" className="flag-icons" alt="" width="13" height="16" /> ARSONIST</span>}
      {disability && <span className="disabilityStatus"><img src="/img/Disability_icon.png" className="flag-icons" alt="" width="19" height="21" /> DISABILITY</span>}
    </div>
  </div>);

  return (
    <div className="header-details">

      <div className="row">

          <div className="col-md-2 col-xs-3 no-left-gutter no-right-gutter">
              <div className="photo clickable" onClick={() => onImageClick(offenderImageUrl(inmateData.get('facialImageId')))}>
                <EliteImage src={offenderImageUrl(inmateData.get('facialImageId'))} />
              </div>
          </div>

          <div className="col-xs-9 col-sm-9 col-md-10 col-lg-10 no-left-gutter no-right-gutter add-gutter-bottom-mobile">

            {nameAndFlags}

            <div className="row">

              <div className="col-md-3 col-sm-3 col-xs-12">
                  <div className="row">
                    <div className="col">
                      <label>Prison number</label>
                      <strong>{inmateData.get('offenderNo')}</strong>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <label>Key worker</label>
                      <strong>{inmateData.get('keyworker') && <EliteOfficerName staffId={inmateData.getIn(['keyworker','staffId'])} /> }</strong>
                    </div>
                  </div>
              </div>

              <div className="visible-large">
                  <MiddleSection inmateData={inmateData} offenderNo={offenderNo} />
              </div>

           </div>

          </div>

        <div className="row">

          <div className="visible-small">
              <MiddleSection inmateData={inmateData} offenderNo={offenderNo} />
          </div>

        </div>
      </div>

     </div>
  );
}

Header.propTypes = {
  inmateData: PropTypes.object.isRequired,
  onImageClick: PropTypes.func.isRequired,
  offenderNo: PropTypes.string.isRequired,
};

export default Header;
