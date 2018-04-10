import React from 'react';

import { Image } from './theme';

const EliteImage = (props) => (
  <Image
    src={props.src}
    onError={(event) => { event.target.src = '/img/NoPhoto@2x.png' }}
  />
)

export default EliteImage;
