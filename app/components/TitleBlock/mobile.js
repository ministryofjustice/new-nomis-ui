import React from 'react';
import PropTypes from 'prop-types';

import {
  Wrapper,
  Title,
  Subtitle,

} from './mobile.theme';

function TitleBlockMobile({ title, subtitle }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  );
}

TitleBlockMobile.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
};

TitleBlockMobile.defaultProps = {
  title: 'testing',
  subtitle: '1 2 3',
};

export default TitleBlockMobile;
