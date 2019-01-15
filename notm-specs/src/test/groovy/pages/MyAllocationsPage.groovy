package pages

import geb.Page
import model.Offender

class MyAllocationsPage extends Page {
  static url = '/key-worker-allocations'

  static at = {
    headingText == 'My key worker allocations'
  }

  static content = {
    headingText { $("[data-qa=\'page-heading-text\']").text() }
    rowsReady(wait:true) { $('.offender') }
  }

  def matchOffenders(ArrayList<Offender> offenders) {

    waitFor { rowsReady }

    def offenderRows = $('.offender')
    Integer matchCount = 0

    for(Integer index =0; index != offenderRows.size(); index++) {

      boolean match = offenders
        .stream()
        .anyMatch{offender -> matchOffender(offenderRows[index], offender)}

      if(match)
        matchCount++
    }

    return matchCount == offenders.size()
  }

  private def matchOffender(def offenderRow,Offender offender) {

    String fullName = offenderRow.find('span', 1).text().toUpperCase()
    String offenderNo = offenderRow.find('span', 2).text()

    return offender.offenderNo == offenderNo &&
      "${offender.lastName}, ${offender.firstName}" == fullName
  }
}