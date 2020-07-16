package specs


import groovy.util.logging.Slf4j
import mockapis.CaseNotesApi
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.TokenVerificationApi
import model.Offender

import mockapis.WhereaboutsApi
import model.TestFixture
import org.junit.Rule
import pages.CaseNotesPage
import spock.lang.IgnoreIf

import static model.UserAccount.ITAG_USER

@Slf4j
class PaginationSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  WhereaboutsApi whereaboutsApi = new WhereaboutsApi()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  CaseNotesApi caseNotesApi = new CaseNotesApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  @Rule
  TokenVerificationApi tokenVerificationApi = new TokenVerificationApi()

  TestFixture fixture = new TestFixture(browser, elite2api, whereaboutsApi, oauthApi, tokenVerificationApi)
  def offenderNo = "A1234AJ"
  def bookingId = -10
  def agencyId = "${ITAG_USER.staffMember.assignedCaseload}"

  def "should be able to page through the case notes"() {
    oauthApi.stubUsersMe ITAG_USER
    oauthApi.stubUserRoles()
    elite2api.stubGetMyDetailsForKeyWorker ITAG_USER
    whereaboutsApi.stubGetMyDetailsForKeyWorker ITAG_USER
    elite2api.stubImage()
    caseNotesApi.stubBookingCaseNotes(offenderNo)
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)
    elite2api.stubOffenderAddresses()

    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo(agencyId, offenderNo)

    elite2api.stubIEP()
    elite2api.stubAliases()
    elite2api.stubContacts()
    elite2api.stubBookingIdentifiers(-10)
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    caseNotesApi.stubCaseNoteTypes()
    caseNotesApi.stubMeCaseNoteTypes()

    given: 'I navigate to an offenders case notes'
    fixture.loginAs ITAG_USER
    go "/offenders/${offenderNo}/case-notes"

    when: 'I can see the first twenty case notes and click on the next page link'
    at CaseNotesPage
    assert checkCaseNotes(0, 19)
    scrollToBottom()
    nextPageLink.click()

    then: 'I can see the next set of case notes'
    assert checkCaseNotes(20, 39)

    when: 'I click on the previous page link'
    scrollToBottom()
    previousPageLink.click()

    then: 'I can see the previous set of alerts'
    assert checkCaseNotes(0, 19)
  }

  def scrollToBottom() {
    js.exec("window.scrollTo(0, document.body.scrollHeight)")
  }

  def checkCaseNotes(Integer start, Integer end) {
    waitFor { caseNotes[0].text().contains("CaseNoteText${start}") }
    for (Integer index = start; index != end; index++) {
      if (caseNotes[0].text().indexOf("CaseNoteText${index}") == -1)
        return false
    }
    return true
  }

  def assertAlerts(int start, int end) {

    waitFor { alerts[0].text().contains("alertType") }
    int index = 0;
    (start..end).each { assert alerts[index++].text().indexOf("alertType${it}") != -1 }
  }
}