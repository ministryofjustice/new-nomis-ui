import styled, { keyframes } from 'styled-components';
import colours from 'theme/colours';

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

export const ModalTypeImageContainer = styled.div`
  max-width: 700px;
  max-height: 820px;
  background: white;
  padding: 10px;
  pointer-events: auto;
  position: relative;
  padding-bottom: 3px;
`;

export const ModalTypeInfoContainer = styled.div`
  max-width: 700px;
  max-height: 750px;
  background: white;
  border-radius: 15px;
  padding: 60px;
  pointer-events: auto;
`;

export const ModalTitle = styled.div`
  font-size: 48px;
  font-weight: bold;
`;

export const ModalBody = styled.div`
  font-size: 19px;
`;

export const ModalTypeImage = styled.div`

`;

export const ModalImageContainerMask = styled.div`
  position: relative;
  width: 470px;
  height: 610px;
  display: inline-block;
  margin: 0px 0px;

  .slick-list {
    overflow: hidden;
  }
  .slick-arrow.slick-prev {
    height: 0px;
    width: 0px;
    overflow: hidden;
    position: absolute;
  }
  .slick-arrow.slick-next {
    height: 0px;
    width: 0px;
    overflow: hidden;
    position: absolute;
  }
  .slick-dots {

    margin: auto;
    display: table !important;
    padding: 0;
    margin-top: -44px;

    li {
      width: 20px;
      height: 20px;
      display: inline-block;
      color: transparent;
      background: black;
      border-radius: 10px;
      font-size: 0px;
      margin-left: 15px;
      opacity: 0.3;

      button {
        width: 20px;
        height: 20px;
      }
    }
    li.slick-active {
      background: #005ea5;
      opacity: 0.99;
    }
  }
`;

export const Dash = (props) => keyframes`
  from {left: 0px;}
  to {left: ${props.goal};}
`;
export const Copy = (props) => keyframes`
  from {left: 0px;}
  to {left: ${props.goal};}
`;

export const ModalImageContainerScrub = styled.div`
  position: absolute;
  left: ${(props) => props.goal}px;
  width: 470px;
  height: 610px;
  display: inline-block;

`;

export const ModalImageContainer = styled.div`
  width: 470px;
  height: 610px;
  display: inline-block;
`;

export const ModalImageLeftArrow = styled.div`
  width: 66px;
  height: 63px;
  background-image: url('/img/lightbox-left-arrow.png');
  display: inline-block;
  margin-right: 19px;
  margin-bottom: 245px;
`;

export const ModalImageRightArrow = styled.div`
  width: 66px;
  height: 63px;
  background-image: url('/img/lightbox-right-arrow.png');
  display: inline-block;
  margin-left: 19px;
  margin-bottom: 245px;
`;

export const ModalImageDetails = styled.div`
  position: relative;
  width: 472px;
  height: 120px;
  display: block;
  margin: auto;
  margin-top: 20px;
`;

export const ModalImageDetailsName = styled.div`
  font-size: 23px;
  margin-bottom: 17px;
`;

export const ModalImageDetailsID = styled.div`
  font-size: 19px;
  color: ${colours.modal.secondaryText};
`;

export const ModalImageDetailsKeyWorker = styled.div`
  font-size: 19px;
  color: ${colours.modal.secondaryText};
`;

export const ModalImageDetailsCurrent = styled.div`
  font-size: 23px;
  position: absolute;
  top: 0;
  right: 0;
`;

export const ModalClose = styled.div`
  position: absolute;
  top: -60px;
  right: 0;
  width: 60px;
  height: 55px;
  background-image: url('/img/close-x.png');
`;
