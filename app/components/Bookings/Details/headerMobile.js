import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
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

function HeaderMobile({ inmateData, tabData }) {
  const { firstName, lastName, bookingNo, facialImageId, alertsCodes, assignedLivingUnit } = inmateData;

  const nameString = `${lastName.toUpperCase()}, ${toTitleCase(firstName)}`;
  // Officer Loader...
  const officer = { firstName: 'PAYNE', lastName: 'RON' };
  const officerNameString = `${toTitleCase(officer.lastName)}, ${toTitleCase(officer.firstName)}`;
  return (
    <HeaderWrapper data-name={'HeaderWrapper'}>
      <ContentWrapper data-name={'ContentWrapper'}>
        <FaceImage data-name={'FaceImage'}>
          <EliteImage imageId={facialImageId} />
        </FaceImage>
        <InformationWrapper data-name={'InformationWrapper'}>
          <InmateName>{nameString}</InmateName>
          <InformationBlock><span>ID: </span>{bookingNo}</InformationBlock>
          <InformationBlock><span>Key Worker: </span>{officerNameString}</InformationBlock>
          <InformationBlock><span>Alerts: </span><AlertCodes>{alertsCodes.join(', ')}</AlertCodes></InformationBlock>
          <InformationBlock><span>Location: </span>{assignedLivingUnit.description}</InformationBlock>
        </InformationWrapper>
      </ContentWrapper>
      <AddCaseNoteButton>
        <AddCaseNoteButtonComponent onClick={tabData.action} buttonstyle="link">Add new case note</AddCaseNoteButtonComponent>
      </AddCaseNoteButton>
    </HeaderWrapper>
  );
}

HeaderMobile.propTypes = {
  inmateData: PropTypes.object.isRequired,
  tabData: PropTypes.object.isRequired,
};


export default HeaderMobile;
