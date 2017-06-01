import React from 'react';
import PropTypes from 'prop-types';

import ActionBlock from './ActionBlock';

import {
  Wrapper,
} from './actionblock.theme';


function ActionBlocks({ actions }) {
  return (
    <Wrapper>
      {actions.map((action) =>
        (<ActionBlock {...action} />))}
    </Wrapper>
  );
}

ActionBlocks.propTypes = {
  actions: PropTypes.array,
};

ActionBlocks.defaultProps = {
  actions: [],
};

export default ActionBlocks;
