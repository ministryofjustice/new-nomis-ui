import React from 'react';
import { Link } from 'react-router';

const SessionTimeout = () => (<div>
   <h1 className="heading-large">
     Unfortunately, your session has timed out. You can login again by clicking the button below.
   </h1>

  <div>
    <Link className="button button-start" to="/login">
      Login
    </Link>
  </div>
</div>)

export default SessionTimeout;
