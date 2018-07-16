package pages
import geb.Page

class AlertsPage extends Page {
  static at = {
    title == 'Prison-NOMIS'
  }

  static content = {
    alerts { $('.offender-alerts') }
    nextPageLink { $('#next-page') }
    previousPageLink { $('#previous-page') }
  }
}
