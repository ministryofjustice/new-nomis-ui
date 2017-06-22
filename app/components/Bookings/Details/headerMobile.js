import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import {
  HeaderWrapper,
  FaceImage,
  AddCaseNoteButton,
  AddCaseNoteButtonComponent,
  InmateName,
  InformationBlock,
  AlertCodes,
  ContentWrapper,
  InformationWrapper,
} from './headerMobile.theme';

const toTitleCase = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();

function HeaderMobile({ inmateData, setModalOpen, setModalData }) {
  const { firstName, lastName, bookingNo, facialImageId, alertsCodes, assignedLivingUnit, assignedOfficerUserId } = inmateData;

  const nameString = `${lastName.toUpperCase()}, ${toTitleCase(firstName)}`;
  // Officer Loader...
  const officer = { firstName: 'PAYNE', lastName: 'RON' };
  const officerNameString = `${toTitleCase(officer.lastName)}, ${toTitleCase(officer.firstName)}`;

  const showModal = function () {
    const modalData = {
      type: 'photo',
      photos: this,
      name: nameString,
      id: bookingNo,
      keyWorker: officerNameString,
    };

    setModalOpen(true);
    setModalData(modalData);
  };

  return (
    <HeaderWrapper data-name={'HeaderWrapper'}>
      <ContentWrapper data-name={'ContentWrapper'}>
        <FaceImage data-name={'FaceImage'} onClick={showModal.bind([facialImageId])}>
          <EliteImage imageId={facialImageId} />
        </FaceImage>
        <InformationWrapper data-name={'InformationWrapper'}>
          <InmateName>{nameString}</InmateName>
          <InformationBlock><span>ID: </span>{bookingNo}</InformationBlock>
          <InformationBlock><span>Key Worker: </span><officername><EliteOfficerName staffId={assignedOfficerUserId} /></officername></InformationBlock>
          <InformationBlock><span>Alerts: </span><AlertCodes>{alertsCodes.join(', ')}</AlertCodes></InformationBlock>
          <InformationBlock><span>Location: </span>{assignedLivingUnit.description}</InformationBlock>
        </InformationWrapper>
      </ContentWrapper>
      <AddCaseNoteButton>
        <AddCaseNoteButtonComponent to={'/addCaseNote'} buttonstyle="link">Add new case note</AddCaseNoteButtonComponent>
      </AddCaseNoteButton>
    </HeaderWrapper>
  );
}
HeaderMobile.propTypes = {
  inmateData: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func,
  setModalData: PropTypes.func,
};

HeaderMobile.defaultProps = {
  setModalOpen: () => {},
  setModalData: () => {},
};


export default HeaderMobile;
