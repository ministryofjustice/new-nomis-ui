import styled from 'styled-components';
// import colors from 'theme/colors';

export const ModalContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
`;

export const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background: #282828CC;
`;

export const ModalEnclosure = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const ModalContentContainer = styled.div`
  max-width: 700px;
  max-height: 750px;
  background: white;
  border-radius: 15px;
  padding: 60px;

`;

export const ModalTitle = styled.div`
  font-size: 48px;
  font-weight: bold;
`;

export const ModalBody = styled.div`
  font-size: 19px;

`;
