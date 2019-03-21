package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import mockapis.response.AccessRoles
import mockapis.response.Schedules
import model.*

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.stream.Collectors

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static mockapis.response.AlertTypes.alertTypes
import static mockapis.response.CaseNoteTypes.myCaseNoteTypes
import static mockapis.response.CaseNoteTypes.referenceCaseNoteTypes

class Elite2Api extends WireMockRule {

  Elite2Api() {
    super(8080)
  }

  void stubHealthCheck() {
    this.stubFor(
      get('/health')
        .willReturn(aResponse()
        .withStatus(200)
        .withBody('''{"name":"elite2-web","version":"1.0.14","description":"Elite 2 Web",
"api":{"status":"UP","healthInfo":{"status":"UP","version":"2018-05-15"},
"diskSpace":{"status":"UP","total":510923390976,"free":114173091840,"threshold":10485760},
"db":{"status":"UP","database":"HSQL Database Engine","hello":4}}}'''))
    )

    this.stubFor(
      get('/heart-beat')
        .willReturn(aResponse()
        .withStatus(200)
        .withBody()))
  }

  void stubGetMyDetails(UserAccount user, boolean whereaboutsAvailable = false) {
    stubLocations()
    stubStaffRoles(user)
    stubCaseLoads()
    stubWhereabouts(whereaboutsAvailable)
  }

  void stubGetMyDetailsForKeyWorker(UserAccount user) {
    stubLocations()
    stubStaffRolesForKeyWorker(user)
    stubCaseLoads()
    stubWhereabouts(false)
  }

  void stubLocations() {

    this.stubFor(
      get('/api/users/me/locations')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('[' + JsonOutput.toJson([
        locationId         : 1,
        locationType       : "LEI",
        description        : "Leeds",
        locationUsage      : "LEIx",
        agencyId           : "LEI",
        parentLocationId   : 0,
        currentOccupancy   : 1,
        locationPrefix     : "LEI",
        operationalCapacity: 0,
        userDescription    : "userDescription"
      ]) + ']')))
  }

  void stubCaseLoads() {
    this.stubFor(
      get('/api/users/me/caseLoads')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[
     {                                              
         "caseLoadId": "LEI",
         "description": "Leeds",
         "type": "LEI",
         "caseloadFunction": "LEI",
         "currentlyActive": true
     },
     {                                              
         "caseLoadId": "2",
         "description": "X-LEI",
         "type": "X-LEI",
         "caseloadFunction": "X-LEI"
     }
     ]''')))
  }

  void stubWhereabouts(boolean whereaboutsAvailable) {
    this.stubFor(
      get('/api/agencies/LEI/locations/whereabouts')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson([enabled: whereaboutsAvailable]))))
  }

  void stubAppointments() {
    this.stubFor(
      get('/api/agencies/LEI/locations?eventType=APP')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson([
        [
          locationId      : 14453,
          locationType    : "EXER",
          description     : "RES-IWING-I1DOC",
          agencyId        : "LEI",
          parentLocationId: 14452,
          currentOccupancy: 0,
          locationPrefix  : "LEI-RES-IWING-I1DOC",
          userDescription : "I1 Med Rec Doctor"
        ],
        [
          locationId      : 14461,
          locationType    : "CLAS",
          description     : "RES-FWING-F4CL",
          agencyId        : "LEI",
          parentLocationId: 14460,
          currentOccupancy: 0,
          locationPrefix  : "LEI-RES-FWING-F4CL",
          userDescription : "F4 Classroom"
        ]
      ]))))
  }

  void stubAppointmentTypes() {
    this.stubFor(
      get('/api/reference-domains/scheduleReasons?eventType=APP')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson([
        [
          code       : "MEDO",
          description: "Medical - Doctor"
        ],
        [
          code       : "GYMF",
          description: "Gym - Football"
        ]
      ]))))
  }

  void stubSaveAppointment() {
    def startDate = LocalDate.now().plusDays(1)
    def startTime = LocalDateTime.of(startDate, LocalTime.of(9, 0, 0))
    def startTimeFormatted = startTime.format(DateTimeFormatter.ISO_DATE_TIME)
    def data = [
      appointmentType: "GYMF",
      locationId     : "14461",
      startTime      : startTimeFormatted,
      comment        : "some details"
    ]
    this.stubFor(
      post(urlMatching("/api/appointments"))
        .willReturn(aResponse().withStatus(200)))
  }

  void stubStaffRoles(UserAccount user) {

    this.stubFor(
      get("/api/staff/${user.staffMember.id}/${user.staffMember.assginedCaseload.id}/roles")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[]''')))
  }

  void stubStaffRolesForKeyWorker(UserAccount user) {

    def json = JsonOutput.toJson([AccessRoles.keyworker])
    this.stubFor(
      get("/api/staff/${user.staffMember.id}/${user.staffMember.assginedCaseload.id}/roles")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(json)))
  }

  void stubOffenderSearch(String details, List<Offender> offenders, String alertsParams, String sortFields = 'lastName,firstName', String sortOrder = 'ASC') {
    this.stubFor(
      get("/api/locations/description/LEI/inmates?keywords=${details}${alertsParams}&returnIep=true&returnAlerts=true&returnCategory=true")
        .withHeader('Page-Limit', equalTo('20'))
        .withHeader('Page-Offset', equalTo('0'))
        .withHeader('Sort-Fields', equalTo(sortFields))
        .withHeader('Sort-Order', equalTo(sortOrder))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('Page-Limit', '20')
        .withHeader('Page-Offset', '0')
        .withHeader('Total-Records', String.valueOf(offenders.size()))
        .withBody(JsonOutput.toJson(offenders))))
  }

  void stubImage() {
    this.stubFor(
      get(urlMatching("/api/images/.+/data"))
        .willReturn(aResponse()
        .withStatus(404)))
  }

  void stubIEP() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/iepSummary"))
        .willReturn(aResponse()
        .withStatus(200)
        .withBody('''
{
    "bookingId": -10,
    "iepDate": "2017-09-06",
    "iepTime": "2017-09-06T09:44:01",
    "iepLevel": "Standard",
    "daysSinceReview": 252,
    "iepDetails": []
}''')))
  }

  void stubKeyworkerOld() {
    this.stubFor(
      get("/api/bookings/offenderNo/A1234AJ/key-worker")
//        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withBody('''
{
    "staffId": -2,
    "firstName": "API",
    "lastName": "User"
}
''')))
  }

  void stubOffenderDetails(boolean fullInfo) {
    def simpleFields = """
    "bookingId": -10,
    "bookingNo": "A00120",
    "offenderNo": "A1234AJ",
    "firstName": "DANIEL",
    "middleName": "JOSEPH",
    "lastName": "SMITH",
    "agencyId": "LEI",
    "assignedLivingUnitId": -8,
    "activeFlag": true,
    "dateOfBirth": "1958-01-01"
"""
    def smallResult = '{' + simpleFields + '}'
    def bigResult = '{' + simpleFields + """,
    "religion": "Metodist",
    "alertsCodes": [],
    "activeAlertCount": 0,
    "inactiveAlertCount": 1,
    "categoryCode": "A",
    "category": "Cat A",
    "assignedLivingUnit": {
        "agencyId": "LEI",
        "locationId": -8,
        "description": "A-1-6",
        "agencyName": "LEEDS"
    },
    "facialImageId": -10,
    "age": 60,
    "physicalAttributes": {
        "gender": "Male",
        "ethnicity": "White: British",
        "heightFeet": 6,
        "heightInches": 6,
        "heightMetres": 1.98,
        "heightCentimetres": 198,
        "weightPounds": 235,
        "weightKilograms": 107,
        "sexCode": "M",
        "raceCode": "W1"
    },
    "physicalCharacteristics": [
        {
            "type": "COMPL",
            "characteristic": "Complexion",
            "detail": "Fair"
        }
    ],
    "profileInformation": [
        {
            "type": "IMM",
            "question": "Interest to Immigration?",
            "resultValue": "No"
        },
        {
            "type": "RELF",
            "question": "Religion",
            "resultValue": "Metodist"
        },
        {
            "type": "SMOKE",
            "question": "Is the Offender a smoker?",
            "resultValue": "No"
        }
    ],
    "physicalMarks": [],
    "assessments": [],
    "assignedOfficerId": -2
}"""

    this.stubFor(
      get("/api/bookings/offenderNo/A1234AJ?fullInfo=${fullInfo}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(fullInfo ? bigResult : smallResult)))
  }

  void stubAliases() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/aliases"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[]''')))
  }

  void stubAlertTypes() {
    this.stubFor(
      get('/api/reference-domains/alertTypes')
        .willReturn(
        aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(alertTypes))
      ))
  }

  void stubMeCaseNoteTypes() {
    this.stubFor(
      get('/api/users/me/caseNoteTypes')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(myCaseNoteTypes))
      ))
  }

  void stubCaseNoteTypes() {
    this.stubFor(
      get("/api/reference-domains/caseNoteTypes")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(referenceCaseNoteTypes))))
  }

  void stubSaveCaseNote(String type = "CHAP", String subType = "FAITH", String typeDescription = "Chaplaincy", String subTypeDescription = "Faith Specific Action") {
    // TODO check "occurrenceDateTime": "2018-04-30T07:00:00", (what we selected on the page)
    def data = """{
  "type": "${type}",
  "subType": "${subType}",
  "text": "some text"
}"""
    this.stubFor(
      post(urlMatching("/api/bookings/.+/caseNotes"))
        .withRequestBody(equalToJson(data, true, true))
        .willReturn(aResponse()
        .withStatus(201)
        .withHeader('Content-Type', 'application/json')
      ))
  }
  // NB also test error 403 from this post

  void stubGetCaseNote() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/caseNotes"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[
    {
        "caseNoteId": 1,
        "bookingId": -10,
        "type": "CHAP",
        "typeDescription": "Chaplaincy",
        "subType": "FAITH",
        "subTypeDescription": "Faith Specific Action",
        "source": "EXT",
        "creationDateTime": "2018-05-16T13:18:09.915",
        "occurrenceDateTime": "2017-10-31T14:38:53",
        "staffId": -2,
        "authorName": "User, Api",
        "text": "Case note body text",
        "originalNoteText": "Case note body text",
        "amendments": []
    },
    {
        "caseNoteId": -5,
        "bookingId": -10,
        "type": "COMMS",
        "typeDescription": "Communication",
        "subType": "COM_OUT",
        "subTypeDescription": "Communication OUT",
        "creationDateTime": "2017-05-06T17:11:00",
        "occurrenceDateTime": "2017-05-06T17:11:00",
        "staffId": -2,
        "authorName": "User, Api",
        "text": "Test outward communication one.",
        "originalNoteText": "Test outward communication one.",
        "amendments": []
    }
]''')))
  }

  void stubStaffDetails(id) {
    this.stubFor(
      get("/api/users/staff/${id}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""
{
    "staffId": -2,
    "firstName": "Staff",
    "lastName": "Name${id}"
}""")))
  }

  void stubGetKeyWorker(def staffId, def offenderNo) {

    this.stubFor(
      get("/key-worker/${staffId}/offender/${offenderNo}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody()))
  }

  void getOffenderSummaryDetails(List<Offender> offenders) {

    String queryString = buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/bookings?iepLevel=true&${queryString}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }

  def stubCSRAssessments(List<Offender> offenders) {
    String queryString = buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/offender-assessments/CSR?${queryString}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }

  def stubCaseNoteUsage(List<Offender> offenders) {
    String queryString = "type=KA&subType=KS&numMonths=6&" + buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/case-notes/usage?${queryString}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }


  def stubSentenceDates(List<Offender> offenders) {
    String queryString = buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/offender-sentences/?${queryString}")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }

  def stubBookingAlerts(Integer bookingId) {

    this.stubFor(
      get(urlPathEqualTo("/api/bookings/${bookingId}/alerts"))
        .withHeader('page-offset', equalTo('0'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '20')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildAlerts(0, 10)))))

    this.stubFor(
      get(urlPathEqualTo("/api/bookings/${bookingId}/alerts"))
        .withHeader('page-offset', equalTo('10'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '20')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildAlerts(10, 20)))))
  }

  def stubBookingCaseNotes(Integer bookingId) {
    this.stubFor(
      get(urlPathEqualTo("/api/bookings/${bookingId}/caseNotes"))
        .withHeader('page-offset', equalTo('0'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '20')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildCaseNotes(0, 10)))))

    this.stubFor(
      get(urlPathEqualTo("/api/bookings/${bookingId}/caseNotes"))
        .withHeader('page-offset', equalTo('10'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '20')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildCaseNotes(10, 20)))))
  }

  void stubBalances() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/balances"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{
    "spends": 475.61,
    "cash": 10,
    "savings": 10,
    "currency": "GBP"
}""")))
  }

  void stubVisits() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/visits"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""[]""")))
  }

  void stubAdjudications() {
    this.stubFor(
      get(urlPathMatching("/api/bookings/.+/adjudications"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(
        [
          bookingId        : -1,
          adjudicationCount: 3,
          awards           :
            [
              [
                status                 : 'IMMEDIATE',
                days                   : 2,
                sanctionCodeDescription: 'Immediate',
                comment                : 'A comment',
                sanctionCode           : 'STOP_PCT',
                effectiveDate          : '2018-10-03',
                limit                  : 50
              ],
              [
                status                 : 'SUSPENDED',
                sanctionCodeDescription: 'Stoppage of Earnings (amount)',
                comment                : 'Not shown',
                sanctionCode           : 'STOP_EARN',
                limit                  : 30
              ]
            ]
        ]
      ))))
  }

  void stubVisitsNext() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/visits/next"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{}""")))
  }

  void stubVisitLast() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/visits/last"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{}""")))
  }

  void stubEvents() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/events/today"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""[]""")))
  }

  void stubRelationships() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/relationships"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""[]""")))
  }

  void stubSentenceDetail() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/sentenceDetail"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{
    "bookingId": -10,
    "sentenceStartDate": "2015-08-10",
    "additionalDaysAwarded": 42,
    "sentenceExpiryDate": "2018-11-27",
    "conditionalReleaseDate": "2017-05-24",
    "nonDtoReleaseDate": "2017-05-24",
    "nonDtoReleaseDateType": "CRD",
    "licenceExpiryDate": "2018-12-22",
    "homeDetentionCurfewEligibilityDate": "2016-12-16",
    "confirmedReleaseDate": "2017-04-07",
    "releaseDate": "2017-04-07"
}""")))
  }

  void stubMainOffence() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/mainOffence"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""[
    {
        "bookingId": -10,
        "offenceDescription": "Attempt burglary dwelling with intent to steal"
    }
]""")))
  }

  void stubContacts() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/contacts"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{
    "nextOfKin": [
        {
            "lastName": "SASHONDA",
            "firstName": "DIYDONOPHER",
            "contactType": "S",
            "contactTypeDescription": "Social/ Family",
            "relationship": "GIF",
            "relationshipDescription": "Girlfriend",
            "emergencyContact": true,
            "nextOfKin": true,
            "relationshipId": 6083448,
            "personId": 324003
        }
    ]
}""")))
  }

  void stubCaseNotesNegIepWarnCount() {
    this.stubFor(
      get(urlPathMatching("/api/bookings/.+/caseNotes/NEG/IEP_WARN/count"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{
    "bookingId": -10,
    "type": "NEG",
    "subType": "IEP_WARN",
    "count": 1,
    "fromDate": "2018-05-21",
    "toDate": "2018-08-21"
}""")))
  }

  void stubCaseNotesPosIepEncCount() {
    this.stubFor(
      get(urlPathMatching("/api/bookings/.+/caseNotes/POS/IEP_ENC/count"))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{
    "bookingId": -10,
    "type": "POS",
    "subType": "IEP_WARN",
    "count": 1,
    "fromDate": "2018-05-21",
    "toDate": "2018-08-21"
}""")))
  }

  private final offenderNumbers = [
    Schedules.activity1_1.offenderNo,
  ]

  void stubGetActivities(Caseload caseload, String timeSlot, String date, boolean emptyResponses) {

    this.stubFor(
      post("/api/schedules/${caseload.id}/visits?timeSlot=${timeSlot}&date=${date}")
        .withRequestBody(equalToJson(JsonOutput.toJson(offenderNumbers)))
        .willReturn(
        aResponse()
          .withBody(emptyResponses ? '' : Schedules.visits)
          .withHeader('Content-Type', 'application/json')
          .withStatus(200))
    )

    this.stubFor(
      post("/api/schedules/${caseload.id}/appointments?timeSlot=${timeSlot}&date=${date}")
        .withRequestBody(equalToJson(JsonOutput.toJson(offenderNumbers)))
        .willReturn(
        aResponse()
          .withBody(emptyResponses ? '' : Schedules.appointments)
          .withHeader('Content-Type', 'application/json')
          .withStatus(200))
    )

    this.stubFor(
      post("/api/schedules/${caseload.id}/activities?timeSlot=${timeSlot}&date=${date}&includeExcluded=true")
        .withRequestBody(equalToJson(JsonOutput.toJson(offenderNumbers)))
        .willReturn(
        aResponse()
          .withBody(emptyResponses ? '' : Schedules.activities)
          .withHeader('Content-Type', 'application/json')
          .withStatus(200))
    )
    this.stubFor(
      post("/api/offender-sentences")
        .withRequestBody(equalToJson(JsonOutput.toJson(offenderNumbers)))
        .willReturn(
        aResponse()
          .withBody(emptyResponses ? '' : Schedules.sentences)
          .withHeader('Content-Type', 'application/json')
          .withStatus(200))
    )
    this.stubFor(
      post("/api/schedules/${caseload.id}/courtEvents?date=${date}")
        .withRequestBody(equalToJson(JsonOutput.toJson(offenderNumbers), true, false))
        .willReturn(
        aResponse()
          .withBody(emptyResponses ? '' : Schedules.courtEventsResponse)
          .withHeader('Content-Type', 'application/json')
          .withStatus(200)))
    this.stubFor(
      post("/api/schedules/${caseload.id}/externalTransfers?date=${date}")
        .withRequestBody(equalToJson(JsonOutput.toJson(offenderNumbers), true, false))
        .willReturn(
        aResponse()
          .withBody(emptyResponses ? '' : Schedules.externalTransfersResponse)
          .withHeader('Content-Type', 'application/json')
          .withStatus(200)))
  }

  def buildCaseNotes(Integer pageOffset, Integer pageLimit) {
    List<CaseNote> notes = []

    for (Integer index = pageOffset; index != pageLimit; index++) {
      CaseNote note = new CaseNote()

      note.subTypeDescription = "caseNotesubTypeDescription${index}"
      note.typeDescription = "caseNotetypeDescription${index}"
      note.authorName = "CaseNoteauthorName${index}"
      note.originalNoteText = "CaseNoteOriginalNoteText${index}"

      notes.push(note)
    }

    return notes;
  }

  def buildAlerts(Integer pageOffset, Integer pageLimit) {
    (pageOffset..<pageLimit).collect { index ->
      Alert alert = new Alert()
      alert.alertId = index
      alert.alertCode = "alertCode${index}"
      alert.alertCodeDescription = "alertCodeDescription${index}"
      alert.alertType = "alertType${index}"
      alert
    }
  }

  def stubQuickLook() {
    stubOffenderDetails(false)
    stubGetCaseNote()
    stubBalances()
    stubVisitsNext()
    stubEvents()
    stubSentenceDetail()
    stubMainOffence()
    stubContacts()
    stubVisitLast()
    stubRelationships()
    stubCaseNoteUsage([Offender.SMITH()])
    stubCaseNotesNegIepWarnCount()
    stubCaseNotesPosIepEncCount()
    stubAdjudications()
  }

  static String buildOffenderQueryString(List<Offender> offenders) {
    return offenders
      .stream()
      .map { o -> "offenderNo=${o.offenderNo}" }
      .collect(Collectors.joining("&"))
  }
}