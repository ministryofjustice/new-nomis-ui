package pages
import geb.Page

class CaseNotesPage extends Page {
  static at = {
    title == 'Case notes - Digital Prison Services'
  }

  static content = {
    nextPageLink { $('#next-page') }
    previousPageLink { $('#previous-page') }
    caseNotes { $('.case-notes') }
    typeSelect { $('#typeValue') }
    subTypeSelect { $('#subTypeValue') }
    applyFiltersButton { $('form.filter-form button[type="submit"]') }
    resetFiltersButton { $('button.reset-filters-button') }
  }
}
