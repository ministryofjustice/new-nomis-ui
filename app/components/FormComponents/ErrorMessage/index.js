import React from 'react';

export default ({ heading,error }) => error && (<div>
  <div className="error-summary">
    <div className="error-summary-heading">
      {heading}
    </div>
    <div className="error-message">{error} </div>

  </div>
</div>)