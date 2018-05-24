import React from 'react';

import './index.scss';

export default ({ maximum, value }) => {
  let level;
  
  if (maximum) {
    if (!value) {
      level = 'none';
    } else if (value < maximum) {
      level = 'low';
    } else if (value === maximum) {
      level = 'medium';
    } else if (value > maximum) {
      level = 'high';
    }
  }

  return (
      <span className="threshold-indicator">
          <span className={level}> {value} </span>
      </span>
  )
}

