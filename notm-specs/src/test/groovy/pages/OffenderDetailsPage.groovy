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
    spinner(required: false) { $('div.spinner-component')}
  }

  def gotoAddCaseNotes() {
    // Wait for the spinner to kick in .. then for it to finish.
    waitFor { spinner.displayed }
    waitFor { !spinner.displayed }
    addCaseNoteLink.click()
  }
}