package pages
import geb.Page

class   AlertsPage extends Page {
  static at = {
    title == 'Alerts - Prison NOMIS'
  }

  static content = {
    alerts { $('.alert-tables tbody tr') }
    nextPageLink { $('#next-page') }
    previousPageLink { $('#previous-page') }
  }
}
