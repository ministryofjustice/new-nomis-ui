package pages

import geb.Page
import modules.ErrorsModule

class OffenderDetailsPage extends Page {

  static at = {
    title == 'Prison-NOMIS'
    addCaseNoteLink.displayed
    addAppointmentLink.displayed
    !offenderNameHeading.empty
    !spinner.displayed
  }

  static content = {
    errors { module(ErrorsModule) }
    offenderNameHeading { $('h1.heading-medium').text() }
    addCaseNoteLink { $('a.button-link[name="add-case-note-link"]',0) }
    addKeyworkerSessionLink(required: false) { $('a.button-link[name="add-kw-session-link"]',0) }
    addAppointmentLink { $('a.button-link[name="add-appointment-link"]',0) }
    spinner(required: false) { $('div.spinner-component')}
  }
}