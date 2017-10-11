import React from 'react';
import Dropdown from 'components/Dropdown';
import './index.scss';

export default ({ user, switchCaseLoad }) => (
  <div className="banner">

     <div className="logo">

       <img src="/img/Syscon_logo.svg"></img>

       <h1 className="company-name">
         SYSCON
       </h1>

       <span className="divider"></span>

       <h1 className="service-name">
         Prison Manager
       </h1>
       <div className="desktop-menu">
         {user && <Dropdown switchCaseLoad={switchCaseLoad} user={user} /> }
       </div>

       <div className="mobile-menu">
       </div>

     </div>

</div>)
