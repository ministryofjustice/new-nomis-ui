import React from 'react';
import PropTypes from 'prop-types';
import { H1 as H1Styled } from '../titles.theme';


function H1({ children, className }) {
  return (
    <H1Styled className={className}>
      {children}
    </H1Styled>
  );
}

H1.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

H1.defaultProps = {
  className: '',
};

export default H1;
