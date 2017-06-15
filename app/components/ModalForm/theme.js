import styled from 'styled-components';
// import colours from 'theme/colours';

export const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
`;

export const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(40,40,40,0.3);
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

export const ModalComponentContainer = styled.div`
  width: 100%;
  max-width: 630px;
  background: white;
  padding: 30px;
  pointer-events: auto;
`;
