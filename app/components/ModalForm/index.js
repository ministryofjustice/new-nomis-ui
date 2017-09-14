import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import Slider from 'react-slick';
//
// import Button from 'components/Button';
// import EliteImage from 'containers/EliteContainers/Image';
import { ModalContainer,
  ModalBackground,
  ModalEnclosure,
  ModalComponentContainer,
} from './theme';

class Modal extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // kill scroll while displaying modal.
    document.getElementsByTagName('body')[0].style['overflow-y'] = 'hidden';
  }
  componentWillUnmount() {
    // yes scroll after closing modal.
    document.getElementsByTagName('body')[0].style = undefined;
  }
  render() {
    const { children, closeModal } = this.props;

    return (
      <ModalContainer>
        <ModalBackground onClick={closeModal} />
        <ModalEnclosure>
          <ModalComponentContainer>
            {children}
          </ModalComponentContainer>
        </ModalEnclosure>
      </ModalContainer>
    );
  }
}

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};


Modal.defaultProps = {
  children: null,
};

export default Modal;
