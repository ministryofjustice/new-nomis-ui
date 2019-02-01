package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import model.TestFixture
import org.junit.Rule
import pages.AddCaseNotePage
import pages.HomePage
import pages.LoginPage
import pages.OffenderCaseNotesPage
import pages.OffenderDetailsPage
import pages.SearchResultsPage

import static model.UserAccount.ITAG_USER

@Slf4j
class CaseNotesSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture testFixture = new TestFixture(browser, elite2api, oauthApi)

  def "Create a new case note"() {
    elite2api.stubHealthCheck()
    setupUserDetails()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs(ITAG_USER)

    searchFor "d s"
    at SearchResultsPage
    setUpQuickLook()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I create a new case note'
    setupAddCaseNote()
    addCaseNoteLink.click()
    at AddCaseNotePage
    createNewCaseNote("some text")

    then: 'The new case note is displayed'
    at OffenderCaseNotesPage
    // TODO check the green notification toast
    //message == "Case note has been created successfully"
    // Check case note display; derives from wiremock response

    def rowsAsText = caseNoteDetails*.text()

    rowsAsText[0].contains("User, Api")
    rowsAsText[0].contains("Chaplaincy | Faith Specific Action")
    rowsAsText[0].contains("Case note body text")

    rowsAsText[1].contains("User, Api")
    rowsAsText[1].contains("Communication | Communication OUT")
    rowsAsText[1].contains("Test outward communication one.")

  }

  def "open the add case note screen with no type and sub type selected"() {
    elite2api.stubHealthCheck()
    setupAddCaseNote()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs(ITAG_USER)

    when: "I navigate to add case note using an type and sub type"
    go '/offenders/A1234AJ/add-case-note'

    then:
    at AddCaseNotePage
    assert typeSelectValue == ""
    assert subTypeSelectValue == ""
  }

  def "open the add case note screen with a pre-selected type and sub type"() {
    elite2api.stubHealthCheck()
    setupAddCaseNote()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs(ITAG_USER)

    when: "I navigate to add case note using an type and sub type"
    go '/offenders/A1234AJ/add-case-note?type=CHAP&subType=FAITH'

    then:
    at AddCaseNotePage
    waitFor { typeSelectValue == "CHAP" }
    waitFor { subTypeSelectValue == "FAITH" }
  }

  def "create a key worker session case note using the 'Add KW session' link" () {
    elite2api.stubHealthCheck()


    given: 'I am logged in and have selected an offender'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)

    loginAs ITAG_USER, 'password'
    at HomePage
    setupUserDetails()

    searchFor "d s"
    at SearchResultsPage
    setUpQuickLook()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I create a new case note'
    elite2api.stubCaseNoteTypes()
    elite2api.stubMeCaseNoteTypes()
    elite2api.stubOffenderDetails(false)
    elite2api.stubSaveCaseNote("KA", "KS", "Key Worker Activity", "Key Worker Session")
    elite2api.stubGetCaseNote()
    waitFor{ addKeyworkerSessionLink.present }
    addKeyworkerSessionLink.click()
    at AddCaseNotePage
    createNewCaseNoteLeavingTypeAndSubType("some text")

    then:
    at OffenderCaseNotesPage
  }

  def setupAddCaseNote() {
    elite2api.stubCaseNoteTypes()
    elite2api.stubMeCaseNoteTypes()
    elite2api.stubOffenderDetails(false)
    elite2api.stubSaveCaseNote()
    elite2api.stubGetCaseNote()
  }

  def setupUserDetails() {
    ArrayList<Offender> offenders = new ArrayList<Offender>()
    offenders.push(Offender.SMELLEY())
    offenders.push(Offender.SMITH())
    offenders.push(Offender.BOB())

    elite2api.stubOffenderSearch("d%20s", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
  }

  def setUpQuickLook() {
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
    elite2api.stubCaseNoteUsage([model.Offender.SMITH()])
    elite2api.stubCaseNotesNegIepWarnCount()
    elite2api.stubCaseNotesPosIepEncCount()
    elite2api.stubAdjudications()
  }


}
