package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import model.CaseNote
import model.Offender

import java.util.stream.Collectors

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching
import static com.github.tomakehurst.wiremock.client.WireMock.matching
import static com.github.tomakehurst.wiremock.client.WireMock.equalToJson

import model.UserAccount
import model.Alert

import static com.github.tomakehurst.wiremock.client.WireMock.urlPathMatching

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
    stubUsersMe(user)
    stubLocations()
    stubUserRoles()
    stubStaffRoles(user)
    stubCaseLoads()
    stubWhereabouts(whereaboutsAvailable)
  }

  void stubGetMyDetailsForKeyWorker(UserAccount user) {
    stubUsersMe(user)
    stubLocations()
    stubStaffRolesForKeyWorker(user)
    stubUserRoles()
    stubCaseLoads()
    stubWhereabouts(false)
  }

  void stubUsersMe(UserAccount user) {
    this.stubFor(
      get('/api/users/me')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson([
        staffId         : user.staffMember.id,
        username        : user.username,
        firstName       : user.staffMember.firstName,
        lastName        : user.staffMember.lastName,
        email           : 'itaguser@syscon.net',
        activeCaseLoadId: 'LEI',
      ]))))
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
        agencyId           : "LEIy",
        parentLocationId   : 0,
        currentOccupancy   : 1,
        locationPrefix     : "LEI",
        operationalCapacity: 0,
        userDescription    : "userDescription"
      ]) + ']')))
  }

  void stubUserRoles() {
    this.stubFor(
      get('/api/users/me/roles')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[{
            "roleId": 0,
            "roleCode": "OMIC_ADMIN",
            "roleName": "Omic admin",
            "parentRoleCode": "code",
            "caseloadId": "1"
          }]''')))
  }

  void stubCaseLoads() {
    this.stubFor(
      get('/api/users/me/caseLoads')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[
     {                                              
         "caseLoadId": 1,
         "description": "LEI",
         "type": "LEI",
         "caseloadFunction": "LEI"
     },
     {                                              
         "caseLoadId": 2,
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
        .withBody(JsonOutput.toJson([ enabled: whereaboutsAvailable ]))))
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

    def json = JsonOutput.toJson([
      role: 'KW',
      roleDescription: 'Key Worker'
    ])
    def body = "[${json}]"
    this.stubFor(
      get("/api/staff/${user.staffMember.id}/${user.staffMember.assginedCaseload.id}/roles")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(body)))
  }

  void stubOffenderSearch(String details, ArrayList<Offender> offenders, String alertsParams = '') {
    this.stubFor(
      get("/api/locations/description/LEI/inmates?keywords=${details}${alertsParams}&returnIep=true&returnAlerts=true")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('Page-Limit', '200')
        .withHeader('Page-Offset', '0')
        .withHeader('Total-Records', '3')
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

  void stubCaseNoteTypes() {
    this.stubFor(
      get("/api/reference-domains/caseNoteTypes")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''
[
    {
        "domain": "TASK_TYPE",
        "code": "CHAP",
        "description": "Chaplaincy",
        "activeFlag": "Y",
        "subCodes": [
            {
                "domain": "TASK_SUBTYPE",
                "code": "FAITH",
                "description": "Faith Specific Action",
                "activeFlag": "Y"
            },
            {
                "domain": "TASK_SUBTYPE",
                "code": "FAMMAR",
                "description": "Family Contacts/Marriage",
                "activeFlag": "Y"
            }
        ]
    },
    {
        "domain": "TASK_TYPE",
        "code": "COMMS",
        "description": "Communication",
        "activeFlag": "Y",
        "subCodes": [
            {
                "domain": "TASK_SUBTYPE",
                "code": "COM_IN",
                "description": "Communication IN",
                "activeFlag": "Y"
            },
            {
                "domain": "TASK_SUBTYPE",
                "code": "COM_OUT",
                "description": "Communication OUT",
                "activeFlag": "Y"
            }
        ]
    }
]''')))
  }

  void stubSaveCaseNote() {
    // TODO check "occurrenceDateTime": "2018-04-30T07:00:00", (what we selected on the page)
    def data = """{
  "type": "CHAP",
  "subType": "FAITH",
  "text": "some text"
}"""
    this.stubFor(
      post(urlMatching("/api/bookings/.+/caseNotes"))
        .withRequestBody(equalToJson(data, true, true))
        .willReturn(aResponse()
        .withStatus(201)
        .withHeader('Content-Type', 'application/json')
        .withBody("""{
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
    "text": "some text",
    "originalNoteText": "some text",
    "amendments": []
}""")))
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

  void stubMeCaseNoteTypes() {
    this.stubFor(
      get("/api/users/me/caseNoteTypes")
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[
    {
        "domain": "TASK_TYPE",
        "code": "CHAP",
        "description": "Chaplaincy",
        "activeFlag": "Y",
        "subCodes": [
            {
                "domain": "TASK_SUBTYPE",
                "code": "FAITH",
                "description": "Faith Specific Action",
                "activeFlag": "Y"
            },
            {
                "domain": "TASK_SUBTYPE",
                "code": "FAMMAR",
                "description": "Family Contacts/Marriage",
                "activeFlag": "Y"
            }
        ]
    },
    {
        "domain": "TASK_TYPE",
        "code": "COMMS",
        "description": "Communication",
        "activeFlag": "Y",
        "subCodes": [
            {
                "domain": "TASK_SUBTYPE",
                "code": "COM_IN",
                "description": "Communication IN",
                "activeFlag": "Y"
            },
            {
                "domain": "TASK_SUBTYPE",
                "code": "COM_OUT",
                "description": "Communication OUT",
                "activeFlag": "Y"
            }
        ]
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
      get("/api/bookings/${bookingId}/alerts")
        .withHeader('page-offset',equalTo('0'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '10')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildAlerts(0, 10)))))

    this.stubFor(
      get("/api/bookings/${bookingId}/alerts")
        .withHeader('page-offset',equalTo('10'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '10')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildAlerts(10, 20)))))
  }

  def stubBookingCaseNotes(Integer bookingId) {
    this.stubFor(
      get("/api/bookings/${bookingId}/caseNotes")
        .withHeader('page-offset',equalTo('0'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '10')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildCaseNotes(0, 10)))))

    this.stubFor(
      get("/api/bookings/${bookingId}/caseNotes")
        .withHeader('page-offset',equalTo('10'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '10')
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
        .withBody("""[]""")))
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

  def buildCaseNotes(Integer pageOffset, Integer pageLimit) {
    List<CaseNote> notes = []

    for(Integer index = pageOffset; index != pageLimit;index++) {
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
    List<Alert> alerts = []

    for(Integer index = pageOffset; index != pageLimit;index++) {
      Alert alert = new Alert()
      alert.alertId = index
      alert.alertCode = "alertCode${index}"
      alert.alertCodeDescription = "alertCodeDescription${index}"
      alert.alertType = "alertType${index}"

      alerts.push(alert)
    }

    return alerts;
  }


  static String buildOffenderQueryString(List<Offender> offenders) {
     return offenders
       .stream()
       .map{ o -> "offenderNo=${o.offenderNo}" }
       .collect(Collectors.joining("&"))
  }
}
