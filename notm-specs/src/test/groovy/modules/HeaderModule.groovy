
package modules

import geb.Module

class HeaderModule extends Module {

    static content = {
        dropDown   { $('.header-content .clickable') }
        dropDownMobile  { $('div#nav-icon span', 0) }
        logoutLink { $('a', text: 'Log out' ) }
    }

  def logout() {
    if (dropDownMobile.displayed) {
      dropDownMobile.click()
    } else if (dropDown.displayed) {
      dropDown.click()
    }
    waitFor { logoutLink.displayed }
    logoutLink.click()
  }
}
