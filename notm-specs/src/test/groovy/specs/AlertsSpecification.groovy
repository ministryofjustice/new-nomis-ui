package specs

import geb.spock.GebReportingSpec
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.TestFixture
import org.junit.Rule
import pages.AlertsPage
import spock.lang.IgnoreIf
import geb.module.Select

import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo

import static model.UserAccount.ITAG_USER

class AlertsSpecification extends GebReportingSpec {
  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)
  def offenderNo = "A1234AJ"
  def bookingId = -10
  def agencyId = "${ITAG_USER.staffMember.assginedCaseload}"

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def "clear filters"() {
    elite2api.stubAlertTypes()
    elite2api.stubHealthCheck()
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)
    elite2api.stubImage()
    elite2api.stubBookingAlerts(bookingId)
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)

    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo(agencyId, offenderNo)

    elite2api.stubIEP()
    elite2api.stubAliases()

    given: 'I navigate to an offenders alerts page'
    fixture.loginAs(ITAG_USER)
    go "/offenders/${offenderNo}/alerts"
    at AlertsPage

    when: 'I select Type of alert and submit'
    typeSelect = 'R'
    applyFiltersButton.click()

    then: 'still on the alerts page'
    at AlertsPage

    when: 'I click the Clear filters link'
    elite2api.resetAll()
    elite2api.stubOffenderDetails(false)
    elite2api.stubBookingAlerts(bookingId)

    clearFiltersButton.click()

    then: 'Type of alert is reset'
    typeSelect.module(Select).selectedText == '— Show all —'

    and: 'alert data is refreshed'
    elite2api.verify(getRequestedFor(urlEqualTo("/api/bookings/${bookingId}/alerts")))
  }

}
