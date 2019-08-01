package pages

import geb.Page
import modules.ErrorsModule

class OffenderDetailsPage extends Page {

  static at = {
    title == 'Quick look - Digital Prison Services'
    !offenderNameHeading.empty
    !spinner.displayed
  }

  static content = {
    errors { module(ErrorsModule) }
    offenderNameHeading { $("[data-qa=\'page-heading-text\']").text() }
    addCaseNoteLink(required: false) { $('a.button-link[name="add-case-note-link"]').find{element -> element.displayed }}
    addKeyworkerSessionLink(required: false) { $('a.button-link[name="add-kw-session-link"]').find{element -> element.displayed }}
    addAppointmentLink(required: false) { $('a.button-link[name="add-appointment-link"]').find{element -> element.displayed }}
    spinner(required: false) { $('div.spinner-component')}
    adjudicationsLink { $("a[data-qa=\'adjudications-link\']") }
    iepDetailsLink { $("a[data-qa=\'iep-details-link\']").find{element -> element.displayed } }
    categorisationLink (required: false) { $("a[data-qa=\'categorisation-external-link\']") }
  }
}