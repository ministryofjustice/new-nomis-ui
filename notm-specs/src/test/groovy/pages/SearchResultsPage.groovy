package pages

import geb.Page
import modules.ErrorsModule

class SearchResultsPage extends Page {

  static url = '/results'

  static at = {
    title == 'Prison-NOMIS'
    headingText == 'Search results'
  }

  static content = {
    errors { module(ErrorsModule) }
    headingText { $('h1').text() }
    form { $('form')}
    images { $('div.photo img') }
    moreFiltersLink { $('span.govuk-details__summary-text') }
    checkboxes(required: false) { $('input', name: 'alerts') }
    rows { $('div.booking-table div.row') }
    searchAgainButtons {$('button.button')}
    sortingSelect { $('#sorting') }
    dateOfBirthOption { $('option', value: 'dateOfBirth:ASC') }
    sortingToggleArrow { $('span.clickable > img') }
  }

  def selectOffender(index) {
    waitFor { images[index].displayed }
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
