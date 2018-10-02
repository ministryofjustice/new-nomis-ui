package modules

import geb.Module

class HeaderModule extends Module {

  static content = {
    dropDown { $('.header-content .clickable') }
    dropDownMobile { $('div#nav-icon') }
    // span at index 0 is not displayed
    dropDownMobileContents { $('div#nav-icon span', 1) }
    logoutLink { $('a', text: 'Log out') }
    myAllocationsMenuLink(required: false) { $('.dropdown-menu-option', text: 'My key worker allocations')}
    dropDownMenu { dropDown.displayed ? dropDown : dropDownMobile }
    dropDownMenuContents { dropDown.displayed ? dropDown : dropDownMobileContents }
  }

  def logout() {
    dropDownMenu.click()
    waitFor { logoutLink.displayed }
    logoutLink.click()
  }
}
