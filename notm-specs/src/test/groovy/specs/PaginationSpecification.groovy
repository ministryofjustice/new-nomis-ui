package specs


import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.TestFixture
import org.junit.Rule
import pages.AlertsPage
import pages.CaseNotesPage
import spock.lang.IgnoreIf

import static model.UserAccount.ITAG_USER

@Slf4j
class PaginationSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)
  def offenderNo = "A1234AJ"
  def bookingId = -10
  def agencyId = "${ITAG_USER.staffMember.assignedCaseload}"

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def "should be able to page through the alerts"() {
    elite2api.stubAlertTypes()
    oauthApi.stubUsersMe ITAG_USER
    oauthApi.stubUserRoles()
    elite2api.stubGetMyDetailsForKeyWorker ITAG_USER
    elite2api.stubImage()
    elite2api.stubBookingAlerts(bookingId)
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)
    elite2api.stubOffenderAddresses()

    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo(agencyId, offenderNo)

    elite2api.stubIEP()
    elite2api.stubAliases()

    given: 'I navigate to an offenders alerts page'
    fixture.loginAs ITAG_USER
    go "/offenders/${offenderNo}/alerts"

    when: "I can see the first 20 alerts and click on the next page link"
    at AlertsPage
    assertAlerts(0, 19)
    // Scroll to bottom to avoid link being hidden behind the mobile fixed icons
    scrollToBottom()
    nextPageLink.click()

    then: "I can see the next set of alerts"
    at AlertsPage
    assertAlerts(20, 39)

    when: "I click on the previous page link"
    scrollToBottom()
    previousPageLink.click()

    then: "I can see the previous set of alerts"
    at AlertsPage
    assertAlerts(0, 19)
  }

  def "should be able to page through the case notes"() {
    oauthApi.stubUsersMe ITAG_USER
    oauthApi.stubUserRoles()
    elite2api.stubGetMyDetailsForKeyWorker ITAG_USER
    elite2api.stubImage()
    elite2api.stubBookingCaseNotes(bookingId)
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)
    elite2api.stubOffenderAddresses()

    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo(agencyId, offenderNo)

    elite2api.stubIEP()
    elite2api.stubAliases()
    elite2api.stubCaseNoteTypes()
    elite2api.stubMeCaseNoteTypes()

    given: 'I navigate to an offenders case notes'
    fixture.loginAs ITAG_USER
    go "/offenders/${offenderNo}/case-notes"

    when: 'I can see the first twenty case notes and click on the next page link'
    at CaseNotesPage
    assert checkCaseNotes(0, 20)
    scrollToBottom()
    nextPageLink.click()

    then: 'I can see the next set of case notes'
    assert checkCaseNotes(20, 40)

    when: 'I click on the previous page link'
    scrollToBottom()
    previousPageLink.click()

    then: 'I can see the previous set of alerts'
    assert checkCaseNotes(0, 20)
  }

  def scrollToBottom() {
    js.exec("window.scrollTo(0, document.body.scrollHeight)")
  }

  def checkCaseNotes(Integer start, Integer end) {
    waitFor { caseNotes[0].text().contains("CaseNoteOriginalNoteText${start}") }
    for (Integer index = start; index != end; index++) {
      if (caseNotes[0].text().indexOf("CaseNoteOriginalNoteText${index}") == -1)
        return false
    }
    return true
  }

  def assertAlerts(int start, int end) {

    waitFor { alerts[0].text().contains("alertType") }
    int index = 0;
    (start..end).each{ assert alerts[index++].text().indexOf("alertType${it}") != -1 }
  }
}