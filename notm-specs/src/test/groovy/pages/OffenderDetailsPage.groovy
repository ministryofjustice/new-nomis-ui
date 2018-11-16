package pages

import geb.Page
import modules.ErrorsModule

class OffenderDetailsPage extends Page {

  static at = {
    title == 'Prison-NOMIS'
    addCaseNoteLink.displayed || addCaseNoteLinkMobile.displayed
    addAppointmentLink.displayed || addAppointmentLinkMobile.displayed
    !offenderNameHeading.empty
    !spinner.displayed
  }

  static content = {
    errors { module(ErrorsModule) }
    offenderNameHeading { $('h1.heading-medium').text() }
    addCaseNoteLink { $('a.button-link', 0) }
    addAppointmentLink { $('a.button-link', 1) }
    addCaseNoteLinkMobile { $('a.button-link', 2) }
    addAppointmentLinkMobile { $('a.button-link', 3) }
    spinner(required: false) { $('div.spinner-component')}
    // TODO: toast messageBar(required: false) { $('div #messageBar')}
  }

  def gotoAddCaseNotes() {
    if (addCaseNoteLink.displayed) {
      addCaseNoteLink.click()
    } else {
      addCaseNoteLinkMobile.click()
    }
  }

  def gotoAddAppointment() {
    if (addAppointmentLink.displayed) {
      addAppointmentLink.click()
    } else {
      addAppointmentLinkMobile.click()
    }
  }
}