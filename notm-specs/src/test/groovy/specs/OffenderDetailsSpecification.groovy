package specs

import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.AllocationManagerApi
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

  @Rule
  AllocationManagerApi allocationManagerApi = new AllocationManagerApi()

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
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

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
    def expectedHeaderValues = ['A1234AJ', '--', '--', 'Standard', '--', '0', '1', 'A-1-6', 'LEEDS']
    containsExpectedIgnoringBlankAndDates(allHeaderValues, expectedHeaderValues)

    and: 'The quicklook page has the correct data'

    def allQuicklookValues1 = $('div.quick-look strong')*.text()
    def expectedQuicklookValues1 = ['£475.61', '£10.00', '£10.00']
    containsExpectedIgnoringBlankAndDates(allQuicklookValues1, expectedQuicklookValues1)

    def allQuicklookValues2 = $('div.quick-look b')*.text()
    def expectedQuicklookValues2 = ['Attempt burglary dwelling with intent to steal', '1', '1', '1', '1', '252', '252', '3', '2 days Immediate (50%)',
                                    'No visit history', 'No upcoming visits', '--']
    // todo: release date '07/04/2017' is displayed in US formaty in circle ci!
    containsExpectedIgnoringBlankAndDates(allQuicklookValues2, expectedQuicklookValues2)
    categorisationLink*.text() contains 'View category'

    // edit view means links shown
    addAppointmentLink.isDisplayed()
    addCaseNoteLink.isDisplayed()
    useOfForceLink.isDisplayed()
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
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('BXI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

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
    def expectedHeaderValues = ['A1234AJ', '--', '--', 'Standard', '--', '0', '1', 'A-1-6', 'LEEDS']
    containsExpectedIgnoringBlankAndDates(allHeaderValues, expectedHeaderValues)

    and: 'The quicklook page has the correct data'

    def allQuicklookValues1 = $('div.quick-look strong')*.text()
    def expectedQuicklookValues1 = ['£475.61', '£10.00', '£10.00']
    containsExpectedIgnoringBlankAndDates(allQuicklookValues1, expectedQuicklookValues1)

    def allQuicklookValues2 = $('div.quick-look b')*.text()
    // note that case note iep numbers not shown
    def expectedQuicklookValues2 = ['Attempt burglary dwelling with intent to steal', '3', '2 days Immediate (50%)',
                                    'No visit history', 'No upcoming visits', '--']
    // todo: release date '07/04/2017' is displayed in US formaty in circle ci!
    containsExpectedIgnoringBlankAndDates(allQuicklookValues2, expectedQuicklookValues2)
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
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

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

  def "Incentive Level history link takes the user to prison staff hub"() {
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
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'The I can click through to Incentive details'


    prisonHubServer.stubFor(
      get(WireMock.urlPathMatching('/.*'))
        .willReturn(
          aResponse().withBody("hello").withStatus(200)))

    iepDetailsLink.singleElement().sendKeys(Keys.RETURN)

    then: 'The browser goes to the Incentive Level history prison hub url'
    def iepDetailsSuffix = '/offenders/A1234AJ/incentive-level-details'
    waitFor { currentUrl == (PRISON_HUB_URL + iepDetailsSuffix) }
    prisonHubServer.verify(WireMock.getRequestedFor(WireMock.urlPathEqualTo(iepDetailsSuffix)))
  }

  def "Categorisation link is displayed for a user with a categorisation access role but prisoner not in caseload"() {
    given: 'As a Categoriser, I log in and search for an offender'
    fixture.loginAs(GLOBAL_USER, [AccessRoles.categoriser])

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('BXI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'Then the Manage link is displayed as part of the Category section'
    categorisationLink*.text() contains 'Manage category'
  }

  def "View probation documents link is displayed for a prison offender manager"() {
    given: 'As a Prison offender manager, I log in and search for an offender'
    fixture.loginAs(ITAG_USER, [AccessRoles.prisonOffenderManager])

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'Then the View Probation documents link is displayed'
    viewProbationDocumentsLink*.text() contains 'View documents held by probation'
  }

  def "Pathfinder referral link is displayed for a pathfinder user"() {
    given: 'As a Pathinder user, I log in and search for an offender'
    fixture.loginAs(ITAG_USER, [AccessRoles.pathfinderUser])

    def offenders = [Offender.SMITH()]

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    elite2api.stubCaseNoteUsage([Offender.SMITH()])
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
    allocationManagerApi.stubGetPomByOffenderNo('A1234AJ')

    searchFor "smith"
    at SearchResultsPage

    when: 'I select an offender'
    /* stubs required for default Quick look tab */
    elite2api.stubQuickLook()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'Then the pathfinder referral link is displayed'
    pathfinderLink*.text() contains 'Refer to Pathfinder'
  }

  private static boolean containsExpectedIgnoringBlankAndDates(actual, List<String> expected) {
    return actual.findAll { StringUtils.isNotBlank(it) && !it.contains('/2017') } == expected
  }
}
