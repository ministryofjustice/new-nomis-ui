package specs

import com.google.common.collect.Lists
import geb.module.Select
import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.response.Schedules
import model.Caseload
import model.TestFixture
import org.junit.Rule
import pages.AddAppointmentPage
import pages.OffenderDetailsPage
import pages.SearchResultsPage

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static model.Offender.*
import static model.UserAccount.ITAG_USER

@Slf4j
class AppointmentSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)

  def "Create a new appointment"() {
    given: 'I am logged in and have selected an offender'
    fixture.loginAs ITAG_USER

    final offenders = [SMELLEY(), SMITH(), BOB()]

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
    elite2api.stubBalances()
    elite2api.stubVisitsNext()
    elite2api.stubEvents()
    elite2api.stubSentenceDetail()
    elite2api.stubMainOffence()
    elite2api.stubContacts()
    elite2api.stubVisitLast()
    elite2api.stubRelationships()
    elite2api.stubCaseNoteUsage(Lists.asList(SMITH()))
    elite2api.stubCaseNotesNegIepWarnCount()
    elite2api.stubCaseNotesPosIepEncCount()
    elite2api.stubAdjudications()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I go to new appointment page'
    elite2api.stubOffenderDetails(false)
    elite2api.stubAppointmentTypes()
    elite2api.stubAppointments()
    addAppointmentLink.click()
    at AddAppointmentPage

    then: 'offender number is displayed'
    nameHeading.text() == 'Smith, Daniel (A1234AJ)'

    when: 'I select a date with existing activities'
    elite2api.stubGetActivities(Caseload.LEI, '', Schedules.TOMORROW, false)
    setDatePicker(Schedules.TOMORROW_DATE.year, Schedules.TOMORROW_DATE.monthValue, Schedules.TOMORROW_DATE.day)
    waitFor({ otherEvents[8].displayed })

    then: 'existing scheduled events are displayed'
    otherEvents[1].find('div')*.text() == ['09:00 - 10:30', 'Location 1 - Activity - Activity 1']
    otherEvents[2].find('div')*.text() == ['14:00 - 15:30', 'Location 2 - Activity - Activity 2 (temporarily removed)']
    otherEvents[3].find('div')*.text() == ['15:30', 'Location 4 - Appointment 1 - Appt details']
    otherEvents[4].find('div')*.text() == ['17:00 - 18:30', 'Location 3 - Activity - Activity 3']
    otherEvents[5].find('div')*.text() == ['18:00 - 18:30', 'Visits Room - Visits - Friends']
    otherEvents[6].find('div')*.text() == ['', 'Release scheduled']
    otherEvents[7].find('div')*.text() == ['', 'Court visit scheduled']
    otherEvents[8].find('div')*.text() == ['', 'Transfer scheduled']
    otherEvents.size() == 9

    when: 'I select a date with no existing activities'
    elite2api.stubGetActivities(Caseload.LEI, '', Schedules.TODAY, true)
    setDatePicker(Schedules.TODAY_DATE.year, Schedules.TODAY_DATE.monthValue, Schedules.TODAY_DATE.day)
    waitFor({ otherEvents.size() == 3 })

    then: 'No scheduled events are displayed'
    otherEvents[1].find('div').text() == 'AM: nothing scheduled'
    otherEvents[2].find('div').text() == 'PM: nothing scheduled'

    when: 'I create the new appointment'
    elite2api.stubSaveAppointment()
    createNewAppointment("some details")

    then: 'The new appointment is created and the user is returned to the details page'
    at OffenderDetailsPage
    //messageBar.text() == 'Appointment has been created successfully'

    def startTimeFormatted = LocalDateTime.of(
      LocalDate.now().plusDays(1),
      LocalTime.of(9, 0, 0))
      .format(DateTimeFormatter.ISO_DATE_TIME)

    elite2api.verify(
      postRequestedFor(urlEqualTo('/api/appointments'))
        .withRequestBody(equalToJson(
        JsonOutput.toJson(
          [
            'appointmentDefaults': [
              'appointmentType': 'GYMF',
              'locationId'     : '14461',
              'startTime'      : startTimeFormatted,
              'comment'        : 'some details'
            ],
            'appointments'       : [
              ['bookingId': -10]
            ]
          ]),
        true,
        false))
    )
  }

  def "Create a recurring appointment"() {
    given: 'I am logged in and have selected an offender'
    fixture.loginAs ITAG_USER

    final offenders = [SMELLEY(), SMITH(), BOB()]

    elite2api.stubOffenderSearch("apperson", offenders, '')
    elite2api.stubOffenderDetails(true)
    elite2api.stubImage()
    elite2api.stubIEP()
    elite2api.stubAliases()


    elite2api.stubKeyworkerOld()
    elite2api.stubStaffDetails(-2)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubGetKeyWorker(-2, 'A1234AJ')


    searchFor "apperson"
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
    elite2api.stubCaseNoteUsage(Lists.asList(SMITH()))
    elite2api.stubCaseNotesNegIepWarnCount()
    elite2api.stubCaseNotesPosIepEncCount()
    elite2api.stubAdjudications()
    selectOffender(1)
    at OffenderDetailsPage

    when: 'I go to new appointment page'
    elite2api.stubOffenderDetails(false)
    elite2api.stubAppointmentTypes()
    elite2api.stubAppointments()
    addAppointmentLink.click()
    at AddAppointmentPage

    then: 'offender number is displayed'
    nameHeading.text() == 'Smith, Daniel (A1234AJ)'

    when: 'I create the new appointment'
    elite2api.stubGetActivities(Caseload.LEI, '', Schedules.TOMORROW, true)

    elite2api.stubSaveAppointment()

    form.appointmentType = "Gym - Football"
    form.location = "F4 Classroom"

    LocalDate tomorrow = LocalDate.now().plusDays(1)
    setDatePicker(tomorrow.year, tomorrow.monthValue, tomorrow.dayOfMonth)
    startHours.module(Select).value("09")
    recurringAppointmentCheckbox = true
    repeatPeriod = 'DAILY'
    repeatCount = 3

    saveButton.click()


    then: 'The new appointment is created and the user is returned to the details page'
    at OffenderDetailsPage

    def startTimeFormatted = LocalDateTime.of(
      LocalDate.now().plusDays(1),
      LocalTime.of(9, 0, 0))
      .format(DateTimeFormatter.ISO_DATE_TIME)

    elite2api.verify(
      postRequestedFor(urlEqualTo('/api/appointments'))
        .withRequestBody(equalToJson(
        JsonOutput.toJson(
          [
            'appointmentDefaults': [
              'appointmentType': 'GYMF',
              'locationId'     : '14461',
              'startTime'      : startTimeFormatted,
            ],
            'repeat'             : [
              'repeatPeriod': 'DAILY',
              'count'       : '3'
            ],
            'appointments'       : [
              ['bookingId': -10]
            ]
          ]),
        true,
        false))
    )
  }
}
