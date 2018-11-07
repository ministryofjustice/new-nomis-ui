package modules

import geb.Module

class HeaderModule extends Module {

  static content = {
    isDesktop (required: false) { return $('#nav-icon').displayed == false}
    usernameDesktop (required: false)  { $('.info-wrapper .user-name').text() }
    caseloadDesktop (required: false)   { $('.info-wrapper .case-load').text() }
    caseloadLEI  (required: false) { $('#menu-option-LEI') }

    dropDown { $('.info-wrapper') }
    dropDownMobile { $('div#nav-icon') }
    dropDownMobileContents { $('div#nav-icon span', 1) }
    logoutLink { $('a', text: 'Log out') }
    mobileLogoutLink{$('#mobile-logout')}
    myAllocationsMenuLink(required: false) { $( text: 'My key worker allocations')}
    dropDownMenu { dropDown.displayed ? dropDown : dropDownMobile }
    dropDownMenuContents { dropDown.displayed ? dropDown : dropDownMobileContents }
  }
  def logout() {
    dropDownMenu.click()
    waitFor { logoutLink.displayed || mobileLogoutLink.displayed }

    if(logoutLink.present)
      logoutLink.click()
    else
      mobileLogoutLink.click()
  }
}
