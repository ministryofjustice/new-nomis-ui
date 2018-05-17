package pages

import geb.Page
import modules.ErrorsModule;
import modules.HeaderModule;

class HomePage extends Page {

  static url = '/'

  static at = {
    title == 'Prison-NOMIS'
    headingText == 'Hello Api'
    searchButtonDesktop.text() == 'Search' || searchButtonMobile.text() == 'Search'
  }

  static content = {
    errors { module(ErrorsModule) }
    header(required: false) { module(HeaderModule) }
    headingText { $('.heading-xlarge').text() }
    searchButtonDesktop { $('.button-start', type: 'submit') }
    searchButtonMobile { $('.mobile-button', type: 'submit') }
    locations { $('select option') }
  }

  void searchFor(String offenderInfo) {
    $('form').keywords = offenderInfo
    if (searchButtonDesktop.displayed) {
      searchButtonDesktop.click()
    } else if (searchButtonMobile.displayed) {
      searchButtonMobile.click()
    }
  }
}
