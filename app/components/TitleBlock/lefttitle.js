import React from 'react';
import PropTypes from 'prop-types';

import {
  LeftWrapper,
  Title

} from './titleblock.theme';


function TitleBlock({ title }) {
  return (
    <LeftWrapper>
      <Title>{title}</Title>
    </LeftWrapper>
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
