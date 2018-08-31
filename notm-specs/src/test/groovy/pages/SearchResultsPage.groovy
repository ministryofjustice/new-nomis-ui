package pages

import geb.Page
import modules.ErrorsModule

class SearchResultsPage extends Page {

  static url = '/results'

  static at = {
    title == 'Prison-NOMIS'
    headingText == 'Search results'
    images.size() == 3
    images[2].displayed
  }

  static content = {
    errors { module(ErrorsModule) }
    headingText { $('h1').text() }
    images { $('div.photo img') }
    moreFiltersLink { $('span.govuk-details__summary-text') }
    checkboxes(required: false) { $('input', name: 'alerts') }
    rows { $('div.booking-table div.row') }
    searchAgainButtons {$('button.button')}
  }

  def selectOffender(index) {
    images[index].click()
  }

  def selectVisibleButton() {
    // One is desktop, other mobile
    if (searchAgainButtons[0].displayed) {
      return searchAgainButtons[0]
    }
    return searchAgainButtons[1]
  }
}
