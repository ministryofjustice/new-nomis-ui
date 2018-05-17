package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import model.TestFixture
import org.junit.Before
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

  TestFixture fixture = new TestFixture(browser, elite2api)

  def "Create a new case note"() {
    elite2api.stubHealthCheck()

    given: 'I am logged in and have selected an offender'
    to LoginPage
    elite2api.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    elite2api.stubOffenderSearch("d%20s")
    elite2api.stubOffenderDetails(true)
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)

    searchFor "d s"
    at SearchResultsPage
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I create a new case note'
    elite2api.stubCaseNoteTypes()
    elite2api.stubMeCaseNoteTypes()
    elite2api.stubOffenderDetails(false)
    elite2api.stubSaveCaseNote()
    elite2api.stubGetCaseNote()
    gotoAddCaseNotes()
    at AddCaseNotePage
    createNewCaseNote("some text")

    then: 'The new case note is displayed'
    at OffenderCaseNotesPage
    // TODO check the green notification toast
    //message == "Case note has been created successfully"
    // Check case note display; derives from wiremock response
    caseNoteDetails*.text()[0].contains("User, Api")
    caseNoteDetails*.text()[0].contains("Chaplaincy | Faith Specific Action")
    caseNoteDetails*.text()[0].contains("Case note body text")
    caseNoteDetails*.text()[1].contains("User, Api")
    caseNoteDetails*.text()[1].contains("Communication | Communication OUT")
    caseNoteDetails*.text()[1].contains("Test outward communication one.")
  }
}
