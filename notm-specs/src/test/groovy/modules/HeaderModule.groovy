
package modules

import geb.Module

class HeaderModule extends Module {

    static content = {
        dropDown   { $('.header-content .clickable') }
        dropDownMobile  { $('div#nav-icon span', 0) }
        logoutLink { $('a', text: 'Log out' ) }
        myAllocationsMenuLink(required: false) { $('.my-allocations-menu-link') }
        dropDownMenu { dropDown.displayed == true ? dropDown : dropDownMobile }
    }



  def logout() {
    dropDownMenu.click()
    waitFor { logoutLink.displayed }
    logoutLink.click()
  }
}
