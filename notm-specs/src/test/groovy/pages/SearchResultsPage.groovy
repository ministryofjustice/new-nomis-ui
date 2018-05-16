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
  /*
  Name  ID IEP Age Location
Smelley, DanielA1234ALStandard50A-1-8
Smith, DanielA1234AJStandard60A-1-6
Smith, DariusA1234AKStandard38A-1-7
   */
}