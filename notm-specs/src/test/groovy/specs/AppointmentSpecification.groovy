package specs

import com.google.common.collect.Lists
import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.response.Schedules
import model.Caseload
import model.Offender
import org.junit.Rule
import pages.*

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

    when: 'I select a date with existing activities'
    elite2api.stubGetActivities(Caseload.LEI, '', Schedules.TOMORROW, false)
    setDatePicker(Schedules.TOMORROW_DATE.year, Schedules.TOMORROW_DATE.monthValue, Schedules.TOMORROW_DATE.day)
    waitFor( {otherEvents[8].displayed} )

    then: 'existing scheduled events are displayed'
    otherEvents[1].find('div')*.text() == ['09:00 - 10:30','Activity 1']
    otherEvents[2].find('div')*.text() == ['14:00 - 15:30','Activity 2 (temporarily removed)']
    otherEvents[3].find('div')*.text() == ['15:30','Appointment 1 - Appt details']
    otherEvents[4].find('div')*.text() == ['17:00 - 18:30','Activity 3']
    otherEvents[5].find('div')*.text() == ['18:00 - 18:30','Visits - Friends']
    otherEvents[6].find('div')*.text() == ['','Release scheduled']
    otherEvents[7].find('div')*.text() == ['','Court visit scheduled']
    otherEvents[8].find('div')*.text() == ['','Transfer scheduled']
    otherEvents.size() == 9

    when: 'I select a date with no existing activities'
    elite2api.stubGetActivities(Caseload.LEI, '', Schedules.TODAY, true)
    setDatePicker(Schedules.TODAY_DATE.year, Schedules.TODAY_DATE.monthValue, Schedules.TODAY_DATE.day)
    waitFor( {otherEvents.size() == 3} )

    then: 'No scheduled events are displayed'
    otherEvents[1].find('div').text() == 'AM: nothing scheduled'
    otherEvents[2].find('div').text() == 'PM: nothing scheduled'

    when: 'I create the new appointment'
    elite2api.stubSaveAppointment()
    createNewAppointment("some details")

    then: 'The new appointment is created and the user is returned to the details page'
    at OffenderDetailsPage
    //messageBar.text() == 'Appointment has been created successfully'
  }
}
