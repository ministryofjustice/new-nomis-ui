import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import { toFullName } from 'utils/stringUtils';

import {
  HeaderWrapper,
  FaceImage,
  NameIdKeyWorker,
  AlertsLocation,
  AddCaseNoteButton,
  InmateName,
  IdLocation,
  ALBLock,
  AlertCodes,
} from './header.theme';

import {
  AddCaseNoteButtonComponent,
} from './headerMobile.theme';

function Header({ inmateData, openAddCaseNote, setModalOpen, setModalData }) {
  const { firstName, lastName, bookingNo, offenderNo, facialImageId, alertsCodes, assignedLivingUnit, assignedOfficerId } = inmateData;

  const nameString = toFullName({firstName, lastName});

  const showModal = function () {
    const modalData = {
      type: 'photo',
      array: [{ imageId: this[0], imageIndex: 0, key: 'key', title: '' }],
      name: nameString,
      id: bookingNo,
      keyWorker: assignedOfficerId,
      offenderNo: offenderNo,
      index: 0,
      header: true,
    };

    setModalOpen(true);
    setModalData(modalData);
  };

  return (
    <HeaderWrapper>
      <FaceImage data-name={'FaceImage'} onClick={showModal.bind([facialImageId])}>
        <EliteImage imageId={facialImageId} />
      </FaceImage>
      <NameIdKeyWorker>
        <InmateName>{nameString}</InmateName>
        <IdLocation>
          <div>ID: <strong>{offenderNo}</strong></div>
          <div>Key Worker: <strong><div><EliteOfficerName staffId={assignedOfficerId} /></div></strong></div>
        </IdLocation>
      </NameIdKeyWorker>
      <AlertsLocation>
        <ALBLock>
          <div>Alerts</div>
          <AlertCodes>{alertsCodes.join(', ')}</AlertCodes>
        </ALBLock>
        <ALBLock>
          <div>Location</div>
          <div><strong>{assignedLivingUnit.description}</strong></div>
        </ALBLock>
      </AlertsLocation>
      <AddCaseNoteButton>
        <AddCaseNoteButtonComponent to={'/bookings/details/addCaseNote'} buttonstyle="link">Add new case note</AddCaseNoteButtonComponent>
      </AddCaseNoteButton>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  inmateData: PropTypes.object.isRequired,
  openAddCaseNote: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func,
  setModalData: PropTypes.func,
};

Header.defaultProps = {
  setModalOpen: () => {},
  setModalData: () => {},
};


export default Header;
