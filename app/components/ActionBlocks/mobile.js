import React from 'react';
import PropTypes from 'prop-types';

import ActionBlockMobile from './ActionBlockMobile';

import {
  WrapperColumn,
} from './mobile.theme';


function ActionBlocksMobile({ actions }) {
  return (
    <WrapperColumn data-name={'WrapperColumn'}>
      {actions.map((action) =>
        (<ActionBlockMobile data-name={'ActionBlockMobile'} {...action} />))}
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
