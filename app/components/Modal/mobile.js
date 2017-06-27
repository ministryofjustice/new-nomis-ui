import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import EliteImage from 'containers/EliteContainers/Image';
import { ModalContainer,
  ModalBackground,
  ModalEnclosure,
  ModalTypeImageContainer,
  ModalTypeImage,
  ModalImageContainerMask,
  ModalImageContainer,
  ModalClose,
} from './mobile.theme';

class ModalMobile extends Component {

  constructor() {
    super();
    this.state = {
      duration: '0.5s',
      goal: 0,
      animationChange: 2,
      position: 0,
    };

    this.mover = { position: 0 };

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.setModalOpen(false);
  }

  render() {
    const { modalData } = this.props;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: Number(modalData.index),
    };

    return (
      <ModalContainer data-name={'Modal'}>
        <ModalBackground onClick={this.closeModal} />
        <ModalEnclosure>
          <ModalTypeImageContainer data-name={'ModalTypeImageContainer'}>
            <ModalClose onClick={this.closeModal} />
            <ModalTypeImage>
              <ModalImageContainerMask>
                <Slider {...settings} >
                  { modalData.array.map((modalObject) =>
                    (<ModalImageContainer key={Math.random()}>
                      <EliteImage imageId={modalObject.imageId} />
                    </ModalImageContainer>)
                  )}
                </Slider>
              </ModalImageContainerMask>
            </ModalTypeImage>
          </ModalTypeImageContainer>
        </ModalEnclosure>
      </ModalContainer>
    );
  }
}

ModalMobile.propTypes = {
  modalData: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

ModalMobile.defaultProps = {
};

export default ModalMobile;
