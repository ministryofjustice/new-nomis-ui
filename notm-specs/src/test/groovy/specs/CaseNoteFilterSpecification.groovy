package specs

import geb.module.Select
import mockapis.CaseNotesApi
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.TestFixture
import org.junit.Rule
import pages.CaseNotesPage
import spock.lang.IgnoreIf

import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import static model.UserAccount.ITAG_USER

class CaseNoteFilterSpecification extends BrowserReportingSpec  {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  CaseNotesApi caseNotesApi = new CaseNotesApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)

  def offenderNo = "A1234AJ"
  def bookingId = -10
  def agencyId = "${ITAG_USER.staffMember.assignedCaseload}"

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def 'clear filters'() {

    oauthApi.stubUsersMe ITAG_USER
    oauthApi.stubUserRoles()
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)
    elite2api.stubImage()
    elite2api.stubBookingCaseNotes(bookingId)
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)

    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo(agencyId, offenderNo)

    elite2api.stubIEP()
    elite2api.stubAliases()
    caseNotesApi.stubCaseNoteTypes()
    caseNotesApi.stubMeCaseNoteTypes()

    given: 'I navigate to an offenders case notes'
    fixture.loginAs ITAG_USER
    go "/offenders/${offenderNo}/case-notes"

    at CaseNotesPage

    when: 'I select type and sub-type and submit'

    waitFor { typeSelect.find('option').size() > 2 }

    typeSelect = 'ALERT'
    subTypeSelect = 'ACTIVE'

    elite2api.stubBookingCaseNotes(bookingId)
    applyFiltersButton.click()

    then: 'Still on the casenotes page'

    at CaseNotesPage

    when: 'I click the clear filters link'
    elite2api.resetAll()
    elite2api.stubOffenderDetails(false)
    elite2api.stubBookingCaseNotes(bookingId)

    resetFiltersButton.click()

    then: 'type and sub-type values are reset'
    typeSelect.module(Select).selectedText == 'Select'
    subTypeSelect.module(Select).selectedText == 'Select'

    and: 'case note data is refreshed'
    elite2api.verify(getRequestedFor(urlEqualTo('/api/bookings/offenderNo/A1234AJ?fullInfo=false')))
  }

}
