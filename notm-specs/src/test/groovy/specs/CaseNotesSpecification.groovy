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

  public static final String LONG_TEXT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phase"
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

  def "Create a new sensitive case note"() {
    setupUserDetails()

    given: 'I am logged in and have selected an offender'
    testFixture.loginAs ITAG_USER

    searchFor "d s"
    at SearchResultsPage
    elite2api.stubQuickLook()
    caseNotesApi.stubGetCaseNote()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I create a new senstive case note'
    setupAddCaseNote("OMIC","TEST_OMIC", "some sensitive text")
    addCaseNoteLink.click()
    at AddCaseNotePage
    createNewCaseNote("OMIC", "XXX_TEST_OMIC", "some sensitive text")

    then: 'The new case note is displayed'
    at OffenderCaseNotesPage
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
    caseNotesApi.stubSaveCaseNote("KA", "KS", "some text")
    caseNotesApi.stubGetCaseNote()
    scrollToBottom()
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

  def setupAddCaseNote(String type = "CHAP", String subType = "FAITH", String text = "some text") {
    caseNotesApi.stubCaseNoteTypes()
    caseNotesApi.stubMeCaseNoteTypes()
    caseNotesApi.stubSaveCaseNote(type, subType, text)
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

  def scrollToBottom() {
    js.exec("window.scrollTo(0, document.body.scrollHeight)")
  }
}
