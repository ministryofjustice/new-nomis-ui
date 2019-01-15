package pages

import geb.Page
import modules.ErrorsModule

class OffenderDetailsPage extends Page {

  static at = {
    title == 'Quick look - Prison NOMIS'
    addCaseNoteLink.displayed
    addAppointmentLink.displayed
    !offenderNameHeading.empty
    !spinner.displayed
  }

  static content = {
    errors { module(ErrorsModule) }
    offenderNameHeading { $("[data-qa=\'page-heading-text\']").text() }
    addCaseNoteLink { $('a.button-link[name="add-case-note-link"]').find{element -> element.displayed }}
    addKeyworkerSessionLink(required: false) { $('a.button-link[name="add-kw-session-link"]').find{element -> element.displayed }}
    addAppointmentLink { $('a.button-link[name="add-appointment-link"]').find{element -> element.displayed }}
    spinner(required: false) { $('div.spinner-component')}
  }
}