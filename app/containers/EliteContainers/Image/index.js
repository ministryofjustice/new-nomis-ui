import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loadImage } from 'containers/EliteApiLoader/actions';
import { selectImageDataUrl } from './selectors';
import { Image } from './theme';

class EliteImage extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  static propTypes = {
    dataURL: PropTypes.string.isRequired,
    loadImage: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.loadImage();
  }

  render() {
    const { dataURL } = this.props;
    // FIXME probably use a styled component here; not sure what all the use cases are though
    // thus for now leaving it as an img.
    return <Image style={{ backgroundImage:`url(${dataURL})` }} />; // eslint-disable-line
  }

}

export function mapDispatchToProps(dispatch, props) {
  return {
    loadImage: () => { dispatch(loadImage(props.imageId)); },
  };
}

const mapStateToProps = createStructuredSelector({
  dataURL: selectImageDataUrl(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EliteImage);
