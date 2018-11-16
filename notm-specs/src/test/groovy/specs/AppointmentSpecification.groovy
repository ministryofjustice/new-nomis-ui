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
class AppointmentSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  def "Create a new appointment"() {
    elite2api.stubHealthCheck()

    given: 'I am logged in and have selected an offender'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    ArrayList<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMELLEY())
    offenders.push(model.Offender.SMITH())
    offenders.push(model.Offender.BOB())

    elite2api.stubOffenderSearch("apperson", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubKeyworkerOld()
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')


    searchFor "apperson"
    at SearchResultsPage
    /* required for default Quick look tab */
    elite2api.stubOffenderDetails(false)
    //elite2api.stubGetCaseNote()
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

    when: 'I go to new appointment page'
    elite2api.stubOffenderDetails(false)
    elite2api.stubAppointmentTypes()
    elite2api.stubAppointments()
    gotoAddAppointment()
    at AddAppointmentPage

    then: 'offender number is displayed'
    nameHeading.text() == 'Smith, Daniel (A1234AJ)'

    when: 'I create the new appointment'
    elite2api.stubSaveAppointment()
    createNewAppointment("some details")

    then: 'The new appointment is created and the user is returned to the details page'
    at OffenderDetailsPage
    //messageBar.text() == 'Appointment has been created successfully'
  }
}
