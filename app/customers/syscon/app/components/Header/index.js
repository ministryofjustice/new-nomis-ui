import React from 'react';
import Dropdown from 'components/Dropdown';
import MenuToggle from 'components/MenuToggle';
import MobileMenu from 'containers/MobileMenu';

import './index.scss';

export default ({ user, switchCaseLoad, menuOpen, setMenuOpen }) => (
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
            {user &&
              <Dropdown
                switchCaseLoad={switchCaseLoad}
                user={user}
                menuOpen={menuOpen}
                toggleMenu={() => setMenuOpen(!menuOpen)}
              />
            }
          </div>

          <div className="mobile-menu">
            {user &&
              <MenuToggle
                menuOpen={menuOpen}
                toggleMenu={() => setMenuOpen(!menuOpen)}
              />
            }
          </div>

        <div className="mobile-only">
          {menuOpen && <MobileMenu />}
        </div>

      </div>

  </div>)
