import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import { Link } from 'react-router';

import { toFullName } from 'utils/stringUtils';

import './header.scss';

function Header({ inmateData, onImageClick }) {
  const { firstName, lastName, offenderNo, facialImageId, activeAlertCount,inactiveAlertCount, assignedLivingUnit, assignedOfficerId, iepLevel, csra } = inmateData;

  const nameString = toFullName({ firstName, lastName });

  return (
    <div>

      <Link id="add-case-note-link-desktop" className="button-link" to={'/bookings/details/addCaseNote'}>Add new case note</Link>

      <div className="header-details">

      <div className="photo clickable" onClick={() => onImageClick(facialImageId)}>
           <EliteImage imageId={facialImageId} />
         </div>

         <div className="information">

           <div>

               <div className="offender-name">
                 <h1 className="heading-large">
                   {nameString}
                 </h1>
               </div>

               <div className="mobile-view">
                 <div className="column">
                   <label>Prison number</label>
                   <b>{offenderNo}</b>
                 </div>

                 <div className="column">
                   <label> Key worker </label>
                   <b> <EliteOfficerName staffId={assignedOfficerId} /> </b>
                 </div>
               </div>

           </div>


           <div className="groups">

             <div className="grouped desktop-view">

               <div className="column">
                 <label>Prison number</label>
                 <b>{offenderNo}</b>
               </div>

               <div className="column">
                 <label> Key worker </label>
                 <b> <EliteOfficerName staffId={assignedOfficerId} /> </b>
               </div>

             </div>

             <div className="grouped">

               <div className="column">
                 <label>IEP</label>
                 <b> { iepLevel } </b>
               </div>

               <div className="column">
                 <label> CSRA </label>
                 <b> { csra || '--' } </b>
               </div>

             </div>

             <div className="grouped ">

               <div className="column">
                 <label>Alerts</label>

                 <div className="alerts">

                   <div className="active-alert">
                     <b>{activeAlertCount}</b> active
                   </div>

                   <div className="inactive-alert">
                     <b>{inactiveAlertCount}</b> inactive
                   </div>
                 </div>
               </div>

               <div className="column">
                 <label> Location </label>
                 <div className="location-information">
                   <div>
                     <b> {assignedLivingUnit.description} </b>
                   </div>
                   <div>
                     <b> {assignedLivingUnit.agencyName} </b>
                   </div>
                 </div>
               </div>

             </div>
           </div>

         </div>
    </div>
      <Link id="add-case-note-link-mobile" className="button-link" to={'/bookings/details/addCaseNote'}>Add new case note</Link>
    </div>
  );
}

Header.propTypes = {
  inmateData: PropTypes.object.isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default Header;
