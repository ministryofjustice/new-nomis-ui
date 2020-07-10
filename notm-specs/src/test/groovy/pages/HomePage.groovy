package pages

import geb.Page
import modules.ErrorsModule
import modules.HeaderModule

class HomePage extends Page {

  static url = '/'

  static at = {
    title == 'Home - Digital Prison Services'
    headingText == 'Search for a prisoner'
    searchButtonDesktop.text() == 'Search' || searchButtonMobile.text() == 'Search'
    header.isDesktop ? header.caseloadDesktop == 'LEEDS (HMP)' : true
  }

  static content = {
    errors { module(ErrorsModule) }
    header(required: false) { module(HeaderModule) }
    headingText { $("[data-qa='page-heading-text']").text() }
    searchButtonDesktop { $("[data-qa='search-button']") }
    searchButtonMobile { $("[data-qa='search-button']") }
    locations { $('select option') }
    myKeyWorkerAllocationsLink(required: false) { $("[data-qa='my-kw-allocations-link']") }
    manageKeyWorkersLink(required: false) { $("[data-qa='manage-kw-link']") }
    whereaboutsLink(required: false) { $("[data-qa='whereabouts-link']") }
    globalSearchLink(required: false) { $("[data-qa='global-search-link']") }
    addBulkAppointmentsLink(required: false) { $("[data-qa='add-bulk-appointments-link']") }
    useOfForceLink(required: false) { $("[data-qa='useOfForce-link']") }
    pathfinderLink(required: false) { $("[data-qa='pathfinder-link']") }
    covidUnitsLink(required: true) { $("[data-qa='covid-units-link']") }
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
