import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import { Link } from 'react-router';

import { toFullName } from 'utils/stringUtils';

import './header.scss';

const Alerts = ({ activeAlertCount, inactiveAlertCount }) => <div className="alerts">
  <span className="active-alert"> <b>{activeAlertCount}</b> <span> active </span> </span>
  <span> <b className="inactive-alert">{inactiveAlertCount}</b> <span> inactive </span> </span>
</div>

const Location = ({ assignedLivingUnit }) => <div>
  <label>Location</label>

  <div>
    <b> {assignedLivingUnit.description} </b>
  </div>

  <div>
    <b> {assignedLivingUnit.agencyName} </b>
  </div>
</div>

const MobileOnlyLayout = ({ iepLevel, csra, activeAlertCount, inactiveAlertCount, assignedLivingUnit }) => <div className="visible-mobile no-top-gutter ">

     <div className="row">

       <div className="col-xs-12 no-left-gutter">

          <div className="row">
            <div className="col-xs-6 no-left-gutter">
              <label>IEP</label>
              <b>{iepLevel || '--'}</b>
            </div>

            <div className="col-xs-6 no-left-gutter">
              <label>CSRA</label>
              <b>{csra || '--'}</b>
            </div>
          </div>


          <div className="row">

            <div className="col-xs-6 no-left-gutter">
              <label>Alerts</label>
              <Alerts activeAlertCount={activeAlertCount} inactiveAlertCount={inactiveAlertCount} />
            </div>

            <div className="col-xs-6 no-left-gutter">
              <Location assignedLivingUnit={assignedLivingUnit} />
            </div>
          </div>

         <div className="show-full-screen-button">
           <Link className="button-link add-gutter-bottom" to={'/bookings/details/addCaseNote'}>Add new case note</Link>
           <Link className="button-link" to={'/bookings/details/addAppointment'}>Add appointment</Link>
         </div>

     </div>

   </div>
</div>

const DesktopOnlyLayout = ({ iepLevel, csra, activeAlertCount, inactiveAlertCount, assignedLivingUnit }) => <div className="visible-desktop">
  <div className="col-sm-2">
    <div className="row">
      <div className="col">
        <label>IEP</label>
        <b>{iepLevel || '--'}</b>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <label>CSRA</label>
        <b>{csra || '--'}</b>
      </div>
    </div>
  </div>

  <div className="col-sm-3">
    <div className="row">

      <div className="col">
        <label>Alerts</label>
        <Alerts activeAlertCount={activeAlertCount} inactiveAlertCount={inactiveAlertCount} />
      </div>
    </div>

    <div className="row">
      <div className="col">
        <Location assignedLivingUnit={assignedLivingUnit} />
      </div>
    </div>
  </div>

  <div className="col pull-right no-right-gutter no-left-gutter visible-desktop">
    <div className="add-gutter-bottom">
      <Link className="button-link hide-desktop-button" to={'/bookings/details/addCaseNote'}>Add case note</Link>
    </div>
    <div>
      <Link className="button-link hide-desktop-button" to={'/bookings/details/addAppointment'}>Add appointment</Link>
    </div>
  </div>
</div>

function Header({ inmateData, onImageClick }) {
  const { firstName, lastName, offenderNo, facialImageId, activeAlertCount,inactiveAlertCount, assignedLivingUnit, assignedOfficerId, iepLevel, csra } = inmateData;

  const nameString = toFullName({ firstName, lastName });

  return (
    <div className="header-details">

      <div className="row">

          <div className="col-lg-2 col-sm-3 col-md-2 col-xs-4 no-left-gutter no-right-gutter">
              <div className="photo clickable" onClick={() => onImageClick(facialImageId)}>
                <EliteImage imageId={facialImageId} />
              </div>
          </div>

          <div className="col-lg-8 col-sm-8 col-md-8 col-xs-8 no-left-gutter no-right-gutter add-gutter-bottom-mobile">
              <div className="col-sm-8 no-left-gutter">
                <h1 className="heading-medium">
                  {nameString}
                </h1>
              </div>
          </div>

          <div className="col-sm-3 col-xs-6 no-left-gutter">
              <div className="row">
                <div className="col">
                  <label>Prison number</label>
                  <b>{offenderNo}</b>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label>Key worker</label>
                  <b> <EliteOfficerName staffId={assignedOfficerId} /> </b>
                </div>
              </div>
          </div>

         <MobileOnlyLayout
           activeAlertCount={activeAlertCount}
           inactiveAlertCount={inactiveAlertCount}
           assignedLivingUnit={assignedLivingUnit}
           iepLevel={iepLevel}
           csra={csra}
         />

        <DesktopOnlyLayout
          activeAlertCount={activeAlertCount}
          inactiveAlertCount={inactiveAlertCount}
          assignedLivingUnit={assignedLivingUnit}
          iepLevel={iepLevel}
          csra={csra}
        />

     </div>
    </div>
  );
}

Header.propTypes = {
  inmateData: PropTypes.object.isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default Header;
