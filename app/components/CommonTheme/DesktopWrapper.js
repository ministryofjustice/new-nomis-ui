import React from 'react';
import PropTypes from 'prop-types';

import {
  Outer,
  Inner,
} from './DesktopWrapper.theme';

function DesktopWrapper({ children, background }) {
  return (
    <Outer background={background}>
      <Inner>
        { children }
      </Inner>
    </Outer>
  );
}


DesktopWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string,
};

DesktopWrapper.defaultProps = {
  background: 'white',
};

export default DesktopWrapper;
