import React from 'react';
import PropTypes from 'prop-types';

import {
  Wrapper,
  Title,
  Subtitle,

} from './titleblock.theme';

function TitleBlock({ title, subtitle }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  );
}

TitleBlock.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
};

TitleBlock.defaultProps = {
  title: 'testing',
  subtitle: '1 2 3',
};

export default TitleBlock;
