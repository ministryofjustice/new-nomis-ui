package specs

import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.response.AccessRoles
import model.Offender
import model.TestFixture
import org.junit.Rule
import org.openqa.selenium.Keys
import pages.OffenderDetailsPage
import pages.SearchResultsPage
import wiremock.org.apache.commons.lang3.StringUtils

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static model.UserAccount.GLOBAL_USER
import static model.UserAccount.ITAG_USER

@Slf4j
class OffenderDetailsSpecification extends BrowserReportingSpec {

  static String PRISON_HUB_URL = "http://localhost:18082"

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  WireMockRule prisonHubServer = new WireMockRule(18082)

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)


  def "Offender quicklook details are correct"() {
    given: 'I log in and search for an offender'
    fixture.loginAs(ITAG_USER)

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'The header has the correct data'

    $('span.cata-status')*.text().contains('CAT A')
    def allHeaderValues = $('div.header-details strong')*.text()
    def expectedHeaderValues = ['A1234AJ', '--', 'Standard', '--', '0', '1', 'A-1-6', 'LEEDS']
    containsExpected(allHeaderValues, expectedHeaderValues)

    and: 'The quicklook page has the correct data'

    def allQuicklookValues1 = $('div.quick-look strong')*.text()
    def expectedQuicklookValues1 = ['£475.61', '£10.00', '£10.00']
    containsExpected(allQuicklookValues1, expectedQuicklookValues1)

    def allQuicklookValues2 = $('div.quick-look b')*.text()
    def expectedQuicklookValues2 = ['Attempt burglary dwelling with intent to steal', '07/04/2017', '1', '1', '1', '1', '3', '2 days Immediate (50%)',
                                    'No visit history', 'No upcoming visits', 'Sashonda, Diydonopher', 'Social/ Family(Girlfriend)', '--']
    // todo: release date '07/04/2017' is displayed in US formaty in circle ci!
    containsExpected(allQuicklookValues2, expectedQuicklookValues2)
    !categorisationLink.isDisplayed()

    // edit view means links shown
    addAppointmentLink.isDisplayed()
    addCaseNoteLink.isDisplayed()
  }

  def "Offender quicklook details are correct in read only view"() {
    given: 'I log in and search for an offender'
    fixture.loginAs(GLOBAL_USER)

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('BXI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'The header has the correct data'

    $('span.cata-status')*.text().contains('CAT A')
    def allHeaderValues = $('div.header-details strong')*.text()
    def expectedHeaderValues = ['A1234AJ', '--', 'Standard', '--', '0', '1', 'A-1-6', 'LEEDS']
    containsExpected(allHeaderValues, expectedHeaderValues)

    and: 'The quicklook page has the correct data'

    def allQuicklookValues1 = $('div.quick-look strong')*.text()
    def expectedQuicklookValues1 = ['£475.61', '£10.00', '£10.00']
    containsExpected(allQuicklookValues1, expectedQuicklookValues1)

    def allQuicklookValues2 = $('div.quick-look b')*.text()
    // note that case note iep numbers not shown
    def expectedQuicklookValues2 = ['Attempt burglary dwelling with intent to steal', '07/04/2017', '3', '2 days Immediate (50%)',
                                    'No visit history', 'No upcoming visits', 'Sashonda, Diydonopher', 'Social/ Family(Girlfriend)', '--']
    // todo: release date '07/04/2017' is displayed in US formaty in circle ci!
    containsExpected(allQuicklookValues2, expectedQuicklookValues2)
    !categorisationLink.isDisplayed()

    // read only view means links not shown
    addAppointmentLink == null
    addCaseNoteLink == null
  }

  def "Adjudications link takes the user to prison staff hub"() {
    given: 'I log in and search for an offender'
    fixture.loginAs(ITAG_USER)

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'The I can click through to adjudications'


    prisonHubServer.stubFor(
      get(WireMock.urlPathMatching('/.*'))
        .willReturn(
          aResponse().withBody("hello").withStatus(200)))

    adjudicationsLink.singleElement().sendKeys(Keys.RETURN)

    then: 'The browser goes to the prison hub url'
    def adjudicationSuffix = '/offenders/A1234AJ/adjudications'
    waitFor { currentUrl == (PRISON_HUB_URL + adjudicationSuffix) }
    prisonHubServer.verify(WireMock.getRequestedFor(WireMock.urlPathEqualTo(adjudicationSuffix)))
  }

  def "IEP history link takes the user to prison staff hub"() {
    given: 'I log in and search for an offender'
    fixture.loginAs(ITAG_USER)

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'The I can click through to IEP details'


    prisonHubServer.stubFor(
      get(WireMock.urlPathMatching('/.*'))
        .willReturn(
          aResponse().withBody("hello").withStatus(200)))

    iepDetailsLink.singleElement().sendKeys(Keys.RETURN)

    then: 'The browser goes to the iep history prison hub url'
    def iepDetailsSuffix = '/offenders/A1234AJ/iep-details'
    waitFor { currentUrl == (PRISON_HUB_URL + iepDetailsSuffix) }
    prisonHubServer.verify(WireMock.getRequestedFor(WireMock.urlPathEqualTo(iepDetailsSuffix)))
  }

  def "Categorisation link is displayed for a user with the CREATE_RECATEGORISATION access role"() {
    given: 'As a Recategoriser, I log in and search for an offender'
    fixture.loginAs(ITAG_USER, [AccessRoles.recategoriser])

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'Then the Manage link is displayed as part of the Category section'
    categorisationLink*.text() contains 'Manage'
  }

  private static boolean containsExpected(actual, List<String> expected) {
    return actual.findAll { StringUtils.isNotBlank(it) } == expected
  }
}
