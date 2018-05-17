package pages

import geb.Page
import modules.ErrorsModule

class OffenderDetailsPage extends Page {

  static at = {
    title == 'Prison-NOMIS'
    addCaseNoteLink.displayed
    addAppointmentLink.displayed
  }

  static content = {
    errors { module(ErrorsModule) }
    offenderNameHeading { $('h1').text() }
    addCaseNoteLink { $('a.button-link', 0) }
    addAppointmentLink { $('a.button-link', 1) }
  }

  def gotoAddCaseNotes() {
    // TODO displayed is not enough
    sleep(200)
    addCaseNoteLink.click()
  }
}