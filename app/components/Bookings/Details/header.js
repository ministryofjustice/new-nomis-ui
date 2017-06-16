import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import Button from 'components/Button';
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

const toTitleCase = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();

function Header({ inmateData, openAddCaseNote }) {
  const { firstName, lastName, bookingNo, facialImageId, alertsCodes, assignedLivingUnit } = inmateData;

  const nameString = `${lastName.toUpperCase()}, ${toTitleCase(firstName)}`;
  // Officer Loader...
  const officer = { firstName: 'PAYNE', lastName: 'RON' };
  const officerNameString = `${toTitleCase(officer.lastName)}, ${toTitleCase(officer.firstName)}`;
  return (
    <HeaderWrapper>
      <FaceImage>
        <EliteImage imageId={facialImageId} />
      </FaceImage>
      <NameIdKeyWorker>
        <InmateName>{nameString}</InmateName>
        <IdLocation>
          <div>ID: <strong>{bookingNo}</strong></div>
          <div>Key Worker: <strong>{officerNameString}</strong></div>
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
        <Button buttonstyle="link" onClick={() => openAddCaseNote()}>Add new case note</Button>
      </AddCaseNoteButton>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  inmateData: PropTypes.object.isRequired,
  openAddCaseNote: PropTypes.func.isRequired,
};


export default Header;
