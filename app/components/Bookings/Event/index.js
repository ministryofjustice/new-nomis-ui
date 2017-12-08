import React from 'react';
import moment from 'moment';

export default ({ startTime, endTime, type, shortComment }) =>
  <div className="row add-gutter-margin-bottom add-gutter-margin-bottom">

    <div className="col-xl-5 col-lg-6 col-md-6 col-xs-6">
    <span className="whereabouts-startTime">
      {moment(startTime).format('HH:mm')}
    </span>

      {endTime && <span>-</span>}
      <span className="whereabouts-endTime"> {endTime && moment(endTime).format('HH:mm')} </span>
    </div>

    <div className="col-xl-7 col-lg-6 col-md-6 col-xs-6">

    <span>
      <b> {type} </b>
      {shortComment && <b>{' - '}</b>}
    </span>

      <span>
       {shortComment}
    </span>

    </div>
  </div>