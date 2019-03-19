package pages

import geb.Page
import modules.ErrorsModule

class OffenderCaseNotesPage extends Page {

  static at = {
    title == 'Case notes - Digital Prison Services'
    caseNoteDetails.size() == 2
  }

  static content = {
    errors { module(ErrorsModule) }
    offenderNameHeading { $('h1').text() }
    addLinks { $('a.button-link') }// 1st is add case note, 2nd appointment
    caseNoteDetails { $("[data-qa='case-note']") }
    message {}
  }
}