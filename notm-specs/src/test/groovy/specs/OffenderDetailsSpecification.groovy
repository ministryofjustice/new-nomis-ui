package specs

import com.google.common.collect.Lists
import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import org.junit.Rule
import pages.*
import spock.lang.IgnoreIf

import static model.UserAccount.ITAG_USER

@Slf4j
class OffenderDetailsSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  def "Offender quicklook details are correct"() {
    elite2api.stubHealthCheck()

    given: 'I log in and search for an offender'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    ArrayList<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMITH())

    elite2api.stubOffenderSearch("smith", offenders, '')
    elite2api.stubOffenderDetails(true)
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
    elite2api.stubOffenderDetails(false)
    elite2api.stubGetCaseNote()
    elite2api.stubBalances()
    elite2api.stubVisitsNext()
    elite2api.stubEvents()
    elite2api.stubSentenceDetail()
    elite2api.stubMainOffence()
    elite2api.stubContacts()
    elite2api.stubVisitLast()
    elite2api.stubRelationships()
    elite2api.stubCaseNoteUsage(Lists.asList(model.Offender.SMITH()))
    elite2api.stubCaseNotesNegIepWarnCount()
    elite2api.stubCaseNotesPosIepEncCount()
    elite2api.stubAdjudications()
    selectOffender(0)
    at OffenderDetailsPage

    then: 'The header has the correct data'

    $('span.cata-status')*.text().contains('CAT A')
    def allHeaderValues = $('div.header-details strong')*.text()
    def expectedHeaderValues = ['A1234AJ', '--', 'Standard', '0', '1', 'A-1-6', 'LEEDS']
    containsExpected(allHeaderValues, expectedHeaderValues)

    and: 'The quicklook page has the correct data'

    def allQuicklookValues1 = $('div.quick-look strong')*.text()
    def expectedQuicklookValues1 = ['£475.61', '£10.00', '£10.00']
    containsExpected(allQuicklookValues1, expectedQuicklookValues1)

    def allQuicklookValues2 = $('div.quick-look b')*.text()
    def expectedQuicklookValues2 = ['Attempt burglary dwelling with intent to steal', '1', '3', '2 days Immediate (50%)',
                                    'No visit history', 'No upcoming visits', 'Sashonda, Diydonopher', 'Social/ Family(Girlfriend)']
    // todo: release date '07/04/2017' is displayed in US formaty in circle ci!
    containsExpected(allQuicklookValues2, expectedQuicklookValues2)
  }

  private boolean containsExpected(actual, List<String> expected) {
    return actual.intersect(expected).size() == expected.size()
  }

  // todo
  // when: 'I select the casenotes tab'
//    elite2api.stubCaseNoteTypes()
//    elite2api.stubMeCaseNoteTypes()
//    elite2api.stubOffenderDetails(false)
//    elite2api.stubGetCaseNote()

  //at OffenderCaseNotesPage
}
