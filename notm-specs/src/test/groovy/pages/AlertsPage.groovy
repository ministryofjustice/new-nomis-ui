package pages
import geb.Page

class AlertsPage extends Page {
  static at = {
    title == 'Alerts - Digital Prison Services'
    !spinner.displayed
    typeSelect.find('option').size() > 1
  }

  static content = {
    spinner(required: false) { $('.spinner-component') }
    alerts { $('.alert-tables tbody tr') }
    nextPageLink { $('#next-page') }
    previousPageLink { $('#previous-page') }
    typeSelect { $('#alertType') }
    applyFiltersButton { $('form button[type=submit]') }
    clearFiltersButton { $( 'form button.reset-filters') }
  }
}
