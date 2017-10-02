import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import { toFullName } from 'utils/stringUtils';

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

function HeaderMobile({ inmateData, onImageClick }) {
  const { firstName, lastName, offenderNo, facialImageId, alertsCodes, assignedLivingUnit, assignedOfficerId } = inmateData;

  const nameString = toFullName({ firstName, lastName });

  return (
    <HeaderWrapper data-name={'HeaderWrapper'}>
      <ContentWrapper data-name={'ContentWrapper'}>
        <FaceImage data-name={'FaceImage'} onClick={() => onImageClick(facialImageId)}>
          <EliteImage imageId={facialImageId} />
        </FaceImage>
        <InformationWrapper data-name={'InformationWrapper'}>
          <InmateName>{nameString}</InmateName>
          <InformationBlock><span>ID: </span>{offenderNo}</InformationBlock>
          <InformationBlock><span>Key Worker: </span><officername><EliteOfficerName staffId={assignedOfficerId} /></officername></InformationBlock>
          <InformationBlock><span>Alerts: </span><AlertCodes>{alertsCodes.join(', ')}</AlertCodes></InformationBlock>
          <InformationBlock><span>Location: </span>{assignedLivingUnit.description} - {assignedLivingUnit.agencyName}</InformationBlock>
        </InformationWrapper>
      </ContentWrapper>
      <AddCaseNoteButton>
        <AddCaseNoteButtonComponent to={'/bookings/details/addCaseNote'} buttonstyle="link">Add new case note</AddCaseNoteButtonComponent>
      </AddCaseNoteButton>
    </HeaderWrapper>
  );
}

HeaderMobile.propTypes = {
  inmateData: PropTypes.object.isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default HeaderMobile;
