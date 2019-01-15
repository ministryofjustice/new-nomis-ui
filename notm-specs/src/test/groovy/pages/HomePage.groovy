package pages

import geb.Page
import modules.ErrorsModule
import modules.HeaderModule

class HomePage extends Page {

  static url = '/'

  static at = {
    title == 'Welcome back - Prison NOMIS'
    headingText == 'Welcome back'
    searchButtonDesktop.text() == 'Search' || searchButtonMobile.text() == 'Search'
  }

  static content = {
    errors { module(ErrorsModule) }
    header(required: false) { module(HeaderModule) }
    headingText { $("[data-qa=\'page-heading-text\']").text() }
    searchButtonDesktop { $('.button-start', type: 'submit') }
    searchButtonMobile { $('.mobile-button', type: 'submit') }
    locations { $('select option') }
    myKeyWorkerAllocationsLink(required: false) { $("[data-qa='my-kw-allocations-link']") }
    manageKeyWorkersLink(required: false) { $("[data-qa='manage-kw-link']") }
    whereaboutsLink(required: false) { $("[data-qa='whereabouts-link']") }
    globalSearchCheckBox(required: false) { $('.global-search') }
  }

  void searchFor(String offenderInfo) {
    //TODO: Encapsulate the button into a single one
    $('form').keywords = offenderInfo
    if (searchButtonDesktop.displayed) {
      searchButtonDesktop.click()
    } else if (searchButtonMobile.displayed) {
      searchButtonMobile.click()
    }
  }
}
