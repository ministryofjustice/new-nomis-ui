package pages
import geb.Page

class CaseNotesPage extends Page {
  static at = {
    title == 'Prison-NOMIS'
  }

  static content = {
    nextPageLink { $('#next-page') }
    previousPageLink { $('#previous-page') }
    caseNotes { $('.case-notes') }
  }
}
