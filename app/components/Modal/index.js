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
      const slickActiveDataIndex = slickActive ? Number(slickActive.dataset.index) : 0;

      if (this.state.position !== slickActiveDataIndex
        && slideTrack.style.transition === '') {
        let newPosition = slickActiveDataIndex + 1;
        if (newPosition === 0) newPosition = this.props.modalData.array.length;
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
      initialSlide: Number(modalData.index),
    };

    let dataGrid;
    if (modalData.type !== 'info') {
      dataGrid = !modalData.header ? modalData.array.map((modalObject) => (
        modalObject.array.map((keypair) =>
          (
            <div key={`${keypair.title}${keypair.value}`}>
              <ModalImageDetailsID>{keypair.title}: {keypair.value}</ModalImageDetailsID>
            </div>
          )
        )
      ))
      :
      [(<div>
        <ModalImageDetailsName>{modalData.name}</ModalImageDetailsName>
        <ModalImageDetailsID>{`ID: ${modalData.offenderNo}`}</ModalImageDetailsID>
        <ModalImageDetailsKeyWorker>Key Worker: <div style={{ display: 'inline-block' }} ><EliteOfficerName username={modalData.keyWorker} /></div></ModalImageDetailsKeyWorker>
      </div>)];
    }

    return (
      <ModalContainer data-name={'Modal'}>
        <ModalBackground onClick={this.closeModal} />
        <ModalEnclosure>
          { modalData.type === 'info' ?
            <ModalTypeInfoContainer data-name={'ModalTypeInfoContainer'} >
              <ModalClose data-name={'ModalClose'} onClick={this.closeModal} />
              <ModalTitle>{modalData.title}</ModalTitle>
              <ModalBody>{modalData.body}</ModalBody>
              <Button onClick={this.closeModal} buttonstyle="submit" style={{ pointerEvents: 'auto', marginTop: '50px' }}>Ok - continue</Button>
            </ModalTypeInfoContainer>
            :
            <ModalTypeImageContainer data-name={'ModalTypeImageContainer'}>
              <ModalClose data-name={'ModalClose'} onClick={this.closeModal} />
              <ModalTypeImage>
                <ModalImageContainerMask innerRef={(slider) => { this.slider = slider; }} >
                  <Slider {...settings} >
                    { modalData.array.map((modalObject) =>
                      (<ModalImageContainer key={Math.random()}>
                        <EliteImage imageId={modalObject.imageId} />
                      </ModalImageContainer>)
                    )}
                  </Slider>
                </ModalImageContainerMask>
              </ModalTypeImage>
              <ModalImageDetails>
                {dataGrid[this.state.actualPosition - 1]}
                <ModalImageDetailsCurrent>{`${this.state.actualPosition}/${modalData.array.length}`}</ModalImageDetailsCurrent>
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
