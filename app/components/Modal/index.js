import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import Button from 'components/Button';
import EliteImage from 'containers/EliteContainers/Image';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import { ModalContainer,
  ModalBackground,
  ModalEnclosure,
  ModalTypeImageContainer,
  ModalTypeInfoContainer,
  ModalTitle,
  ModalBody,
  ModalTypeImage,
  ModalImageContainerMask,
  ModalImageContainer,
  ModalImageDetails,
  ModalImageDetailsName,
  ModalImageDetailsID,
  ModalImageDetailsKeyWorker,
  ModalImageDetailsCurrent,
  ModalClose,
} from './theme';

class Modal extends Component {

  constructor() {
    super();
    this.state = {
      position: 0,
      actualPosition: 1,
    };

    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if (!this.slider) return;
    const slideTrack = this.slider.getElementsByClassName('slick-track')[0];
    // create an observer instance
    this.observer = new MutationObserver(() => {
      const slickActive = this.slider.getElementsByClassName('slick-active')[0];
      // get the index of the active slide image
      const slickActiveDataIndex = Number(slickActive.dataset.index);

      if (this.state.position !== slickActiveDataIndex
        && slideTrack.style.transition === '') {
        let newPosition = slickActiveDataIndex + 1;
        if (newPosition === 0) newPosition = this.props.modalData.photos.length;
        this.setState({ position: slickActiveDataIndex, actualPosition: newPosition });
      }
    });

    // configuration of the observer:
    const config = { attributes: true, childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    this.observer.observe(slideTrack, config);
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    if (!this.slider) return;
    // stop observing
    this.observer.disconnect();
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
    };

    return (
      <ModalContainer data-name={'Modal'}>
        <ModalBackground onClick={this.closeModal} />
        <ModalEnclosure>
          { modalData.type === 'info' ?
            <ModalTypeInfoContainer data-name={'ModalTypeInfoContainer'} >
              <ModalTitle>{modalData.title}</ModalTitle>
              <ModalBody>{modalData.body}</ModalBody>
              <Button onClick={this.closeModal} buttonstyle="submit" style={{ pointerEvents: 'auto', marginTop: '50px' }}>Ok - continue</Button>
            </ModalTypeInfoContainer> :
            <ModalTypeImageContainer data-name={'ModalTypeImageContainer'}>
              <ModalClose onClick={this.closeModal} />
              <ModalTypeImage>
                <ModalImageContainerMask innerRef={(slider) => { this.slider = slider; }} >
                  <Slider {...settings} >
                    { modalData.photos.map((value) =>
                      (<ModalImageContainer key={Math.random()}>
                        <EliteImage imageId={value} />
                      </ModalImageContainer>)
                    )}
                  </Slider>
                </ModalImageContainerMask>
              </ModalTypeImage>
              <ModalImageDetails>
                <ModalImageDetailsName>{modalData.name}</ModalImageDetailsName>
                <ModalImageDetailsID>{`ID: ${modalData.id}`}</ModalImageDetailsID>
                <ModalImageDetailsKeyWorker>Key Worker: <EliteOfficerName staffId={modalData.keyWorker} /></ModalImageDetailsKeyWorker>
                <ModalImageDetailsCurrent>{`${this.state.actualPosition}/${modalData.photos.length}`}</ModalImageDetailsCurrent>
              </ModalImageDetails>
            </ModalTypeImageContainer>
          }
        </ModalEnclosure>

      </ModalContainer>
    );
  }
}

Modal.propTypes = {
  modalData: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

Modal.defaultProps = {
};

export default Modal;
