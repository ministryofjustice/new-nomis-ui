import React from 'react';
import PropTypes from 'prop-types';

import ActionBlock from './ActionBlock';

import {
  WrapperColumn,
} from './actionblock.theme';


function ActionBlocksMobile({ actions }) {
  return (
    <WrapperColumn>
      {actions.map((action) =>
        (<ActionBlock {...action} />))}
    </WrapperColumn>
  );
}

ActionBlocksMobile.propTypes = {
  actions: PropTypes.array,
};

ActionBlocksMobile.defaultProps = {
  actions: [],
};

export default ActionBlocksMobile;
