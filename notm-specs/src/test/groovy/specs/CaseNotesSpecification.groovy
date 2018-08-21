package specs

import com.google.common.collect.Lists
import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import model.Offender
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

  def "Create a new case note"() {
    elite2api.stubHealthCheck()


    given: 'I am logged in and have selected an offender'
    to LoginPage
    elite2api.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    ArrayList<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMELLEY())
    offenders.push(model.Offender.SMITH())
    offenders.push(model.Offender.BOB())

    elite2api.stubOffenderSearch("d%20s", offenders)
    elite2api.stubOffenderDetails(true)
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')


    searchFor "d s"
    at SearchResultsPage
    /* required for default Quick look tab */
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
