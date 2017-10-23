import React from 'react';
import Dropdown from 'components/Dropdown';
import MenuToggle from 'components/MenuToggle';

import './index.scss';

export default ({ user, switchCaseLoad, mobileMenuOpen, setMobileMenuOpen }) => (
    <div className="banner">

      <div className="header-content">

           <div className="brand-header">

             <span className="section" to="/">
               <img src="/img/Syscon_logo.svg"></img>
             </span>

             <span className="section">
               <h1>
                 SYSCON
               </h1>
             </span>
             <span className="section desktop-only">
               <span className="divider"></span>
             </span>

             <span className="section desktop-only">
               <h1>
                 Prison Manager
               </h1>
             </span>
           </div>


          <div className="desktop-menu">
            {user && <Dropdown switchCaseLoad={switchCaseLoad} user={user} /> }
          </div>

          <div className="mobile-menu">
            {user &&
              <MenuToggle
                toggleState={mobileMenuOpen}
                onToggle={mobileMenuOpen ? () => setMobileMenuOpen(false) : () => setMobileMenuOpen(true)}
              />
            }

          </div>
      </div>

  </div>)
