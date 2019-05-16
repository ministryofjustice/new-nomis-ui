package pages
import geb.Page

class CaseNotesPage extends Page {
  static at = {
    title == 'Case notes - Digital Prison Services'
    !spinner.displayed
  }

  static content = {
    spinner(required: false) { $('.spinner-component') }
    nextPageLink { $('#next-page') }
    previousPageLink { $('#previous-page') }
    caseNotes { $('.case-notes') }
    typeSelect { $('select', name: 'typeValue') }
    subTypeSelect { $('select', name: 'subTypeValue') }
    applyFiltersButton { $('form.filter-form button[type="submit"]') }
    resetFiltersButton { $('button.reset-filters-button') }
  }
}
