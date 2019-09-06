package specs

import groovy.util.logging.Slf4j
import mockapis.CaseNotesApi
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import model.TestFixture
import org.junit.Rule
import pages.*
import spock.lang.IgnoreIf

import static model.UserAccount.ITAG_USER

@Slf4j
class CaseNotesSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  CaseNotesApi caseNotesApi = new CaseNotesApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture testFixture = new TestFixture(browser, elite2api, oauthApi)

  def "Create a new case note"() {
    setupUserDetails()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs ITAG_USER

    searchFor "d s"
    at SearchResultsPage
    elite2api.stubQuickLook()
    caseNotesApi.stubGetCaseNote()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I create a new case note'
    setupAddCaseNote()
    addCaseNoteLink.click()
    at AddCaseNotePage
    createNewCaseNote()

    then: 'The new case note is displayed'
    at OffenderCaseNotesPage
    // TODO check the green notification toast
    //message == "Case note has been created successfully"
    // Check case note display; derives from wiremock response

    List<String> rowsAsText = caseNoteDetails*.text()

    rowsAsText[0].contains("User, Api")
    rowsAsText[0].contains("Chaplaincy | Faith Specific Action")
    rowsAsText[0].contains("Case note body text")

    rowsAsText[1].contains("User, Api")
    rowsAsText[1].contains("Communication | Communication OUT")
    rowsAsText[1].contains("Test outward communication one.")

  }

  def "open the add case note screen with no type and sub type selected"() {
    setupAddCaseNote()
    setupUserDetails()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs ITAG_USER

    when: "I navigate to add case note using an type and sub type"
    go '/offenders/A1234AJ/add-case-note'

    then:
    at AddCaseNotePage
    assert typeSelectValue == ""
    assert subTypeSelectValue == ""
  }

  def "open the add case note screen with a pre-selected type and sub type"() {
    setupAddCaseNote()
    setupUserDetails()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs ITAG_USER

    when: "I navigate to add case note using an type and sub type"
    go '/offenders/A1234AJ/add-case-note?type=CHAP&subType=FAITH'

    then:
    at AddCaseNotePage
    waitFor { typeSelectValue == "CHAP" }
    waitFor { subTypeSelectValue == "FAITH" }
  }

  def "create a key worker session case note using the 'Add KW session' link"() {

    given: 'I am logged in and have selected an offender'
    testFixture.loginAsKeyworker ITAG_USER

    setupUserDetails()

    searchFor "d s"
    at SearchResultsPage
    elite2api.stubQuickLook()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I create a new case note'
    caseNotesApi.stubCaseNoteTypes()
    caseNotesApi.stubMeCaseNoteTypes()
    caseNotesApi.stubSaveCaseNote("KA", "KS", "Key Worker Activity", "Key Worker Session")
    caseNotesApi.stubGetCaseNote()
    waitFor { addKeyworkerSessionLink.present }
    addKeyworkerSessionLink.click()
    at AddCaseNotePage
    createNewCaseNoteLeavingTypeAndSubType()

    then:
    at OffenderCaseNotesPage
  }

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def "Amend a case note"() {
    setupUserDetails()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs ITAG_USER

    searchFor "d s"
    at SearchResultsPage
    elite2api.stubQuickLook()
    caseNotesApi.stubGetCaseNote()
    selectOffender(1)
    at OffenderDetailsPage
    caseNotesApi.stubCaseNoteTypes()
    caseNotesApi.stubMeCaseNoteTypes()
    caseNotesTab.click()
    at OffenderCaseNotesPage

    when: 'I amend the case note'
    amendCaseNoteLinks[0].click()
    at AmendCaseNotePage
    caseNotesApi.stubSaveAmendCaseNote()
    amendCaseNote()

    then: 'I am returned to the case notes page'
    at OffenderCaseNotesPage
  }

  def setupAddCaseNote() {
    caseNotesApi.stubCaseNoteTypes()
    caseNotesApi.stubMeCaseNoteTypes()
    caseNotesApi.stubSaveCaseNote()
    caseNotesApi.stubGetCaseNote()
  }

  def setupUserDetails() {
    List<Offender> offenders = [
      Offender.SMELLEY(),
      Offender.SMITH(),
      Offender.BOB()]

    elite2api.stubOffenderSearch("d%20s", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderAddresses()
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')
  }
}
