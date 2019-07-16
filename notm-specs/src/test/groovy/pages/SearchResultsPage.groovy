package pages

import geb.Page
import modules.ErrorsModule

class SearchResultsPage extends Page {

  static url = '/results'

  static at = {
    title == 'Offender search results - Digital Prison Services'
    headingText == 'Offender search results'
  }

  static content = {
    errors { module(ErrorsModule) }
    headingText { $("[data-qa='page-heading-text']").text() }
    form { $('form')}
    images  { $("[data-qa='bookings-results-offender-photo']") }
    moreFiltersLink { $('span.govuk-details__summary-text') }
    checkboxes(required: false) { $('input', name: 'alerts') }
    rows { $("[data-qa='bookings-results-table-row']") }
    searchAgainButtons {$('button.button')}
    sortingSelect { $('#sorting') }
    dateOfBirthOption { $('option', value: 'dateOfBirth:ASC') }
    sortingToggleArrow { $("[data-qa='bookings-results-sort-arrow']") }
    clearFilters { $('a.clear-filters') }
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
