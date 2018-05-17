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
    images { $('div.row img') }
  }

  def selectOffender(index) {
    images[index].click()
  }
}
