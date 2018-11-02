package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import mockapis.response.AccessRoles
import model.CaseNote
import model.Offender

import java.util.stream.Collectors

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching
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
        agencyId           : "LEI",
        parentLocationId   : 0,
        currentOccupancy   : 1,
        locationPrefix     : "LEI",
        operationalCapacity: 0,
        userDescription    : "userDescription"
      ]) + ']')))
  }

  void stubUserRoles(def roles = [AccessRoles.omicAdmin, AccessRoles.globalSearch]) {
    this.stubFor(
      get('/api/users/me/roles')
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(roles))))
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
        .withBody(JsonOutput.toJson([enabled: whereaboutsAvailable]))))
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

  void stubOffenderSearch(String details, ArrayList<Offender> offenders, String alertsParams, String sortFields = 'lastName,firstName', String sortOrder = 'ASC') {
    this.stubFor(
      get("/api/locations/description/LEI/inmates?keywords=${details}${alertsParams}&returnIep=true&returnAlerts=true&returnCategory=true")
        .withHeader('Page-Limit', equalTo('10'))
        .withHeader('Page-Offset', equalTo('0'))
        .withHeader('Sort-Fields', equalTo(sortFields))
        .withHeader('Sort-Order', equalTo(sortOrder))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('Page-Limit', '10')
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
        .withHeader('page-offset', equalTo('0'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '10')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildAlerts(0, 10)))))

    this.stubFor(
      get("/api/bookings/${bookingId}/alerts")
        .withHeader('page-offset', equalTo('10'))
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
        .withHeader('page-offset', equalTo('0'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('total-records', '20')
        .withHeader('page-limit', '10')
        .withHeader('page-offset', '0')
        .withBody(JsonOutput.toJson(buildCaseNotes(0, 10)))))

    this.stubFor(
      get("/api/bookings/${bookingId}/caseNotes")
        .withHeader('page-offset', equalTo('10'))
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
        .withBody(JsonOutput.toJson(
        [
          bookingId: -1,
          adjudicationCount: 3,
          awards:
          [
            [
              status: 'IMMEDIATE',
              days: 2,
              sanctionCodeDescription: 'Immediate',
              comment: 'A comment',
              sanctionCode: 'STOP_PCT',
              effectiveDate: '2018-10-03',
              limit: 50
            ],
            [
              status: 'SUSPENDED',
              sanctionCodeDescription: 'Stoppage of Earnings (amount)',
              comment: 'Not shown',
              sanctionCode: 'STOP_EARN',
              limit: 30
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
    (pageOffset..<pageLimit).collect{ index ->
      Alert alert = new Alert()
      alert.alertId = index
      alert.alertCode = "alertCode${index}"
      alert.alertCodeDescription = "alertCodeDescription${index}"
      alert.alertType = "alertType${index}"
      alert
    }
  }


  static String buildOffenderQueryString(List<Offender> offenders) {
    return offenders
      .stream()
      .map { o -> "offenderNo=${o.offenderNo}" }
      .collect(Collectors.joining("&"))
  }

  // The alertTypes response from T3 as a Groovy datastructure.
  def alertTypes = [
    {
      domain: "ALERT"
      code: "A"
      description: "Social Care"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "AS"
          description: "Social Care"
          parentDomain: "ALERT"
          parentCode: "A"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "C"
      description: "Child Communication Measures"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "C1"
          description: "L1 Restriction No contact with any child"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "C2"
          description: "L2 Written Contact with Children only"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "C3"
          description: "L3 Monitored Contact written or phone"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "C4"
          description: "L4 No Restrictions (named child only)"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "CC1"
          description: "Child contact L1"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "CC2"
          description: "Child contact L2"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "CC3"
          description: "Child contact L3"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "CC4"
          description: "Child contact L4"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "CPC"
          description: "PPRC"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "CPRC"
          description: "Potential PPRC"
          parentDomain: "ALERT"
          parentCode: "C"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "H"
      description: "Self Harm"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "HA"
          description: "ACCT Open (HMPS)"
          parentDomain: "ALERT"
          parentCode: "H"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "HA1"
          description: "ACCT Post Closure (HMPS)"
          parentDomain: "ALERT"
          parentCode: "H"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "HA2"
          description: "ACCT Closed (HMPS)"
          parentDomain: "ALERT"
          parentCode: "H"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "HC"
          description: "Self Harm - Custody"
          parentDomain: "ALERT"
          parentCode: "H"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "HS"
          description: "Self Harm - Community"
          parentDomain: "ALERT"
          parentCode: "H"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "SH"
          description: "Self Harm"
          parentDomain: "ALERT"
          parentCode: "H"
          activeFlag: "N"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "L"
      description: "Care Leaver"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "LCE"
          description: "Care Experienced"
          parentDomain: "ALERT"
          parentCode: "L"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "LFC21"
          description: "Former Relevant Child (under 21)"
          parentDomain: "ALERT"
          parentCode: "L"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "LFC25"
          description: "Former Relevant Child (under 25)"
          parentDomain: "ALERT"
          parentCode: "L"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "LPQAA"
          description: "Qualifies for Assistance and Advice"
          parentDomain: "ALERT"
          parentCode: "L"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "M"
      description: "Medical"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "MAS"
          description: "Asthmatic"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "MEP"
          description: "Epileptic"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "MFL"
          description: "False Limbs"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "MHT"
          description: "Hearing Impaired"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "MSI"
          description: "Sight Impaired"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "MSP"
          description: "Speech Impediment"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PEEP"
          description: "Personal Emergency Evacuation Plan"
          parentDomain: "ALERT"
          parentCode: "M"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "O"
      description: "Other"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "OCVM"
          description: "Custodial Violence Management"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "OCYP"
          description: "Looked after Child"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "OHA"
          description: "Charged under Harassment Act"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "OHCO"
          description: "Harassment Offences/Court orders"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "OIOM"
          description: "Integrated Offender Management Case"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "ONCR"
          description: "No-contact request"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "OPPO"
          description: "PPO Case"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "OVI"
          description: "Victim Inquiry"
          parentDomain: "ALERT"
          parentCode: "O"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "P"
      description: "MAPPP Case"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "P0"
          description: "MAPPA Nominal"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "P1"
          description: "MAPPA Level 1 Case"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "P2"
          description: "MAPPA Level 2 Case"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "P3"
          description: "MAPPA Level 3 Case"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "PC1"
          description: "MAPPA Cat 1"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PC2"
          description: "MAPPA Cat 2"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PC3"
          description: "MAPPA Cat 3"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PL1"
          description: "MAPPA Level 1"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PL2"
          description: "MAPPA Level 2"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PL3"
          description: "MAPPA Level 3"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "PVN"
          description: "ViSOR Nominal"
          parentDomain: "ALERT"
          parentCode: "P"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "R"
      description: "Risk"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "RAIC"
          description: "DBS auto-inclusion offence"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RCC"
          description: "Risk to Children - Community"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RCP"
          description: "Children on CP Register"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RCS"
          description: "Risk to Children - Custody"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RDBS"
          description: "DBS auto-bar offence"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RDO"
          description: "Disqualified From Working with Children"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "RDP"
          description: "Risk to disabled people"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RDV"
          description: "Domestic Violence Perpetrator"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "REG"
          description: "Risk to certain ethnic groups"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RKC"
          description: "Risk to Known Adult - Community"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RKS"
          description: "Risk to Known Adult - Custody"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RLG"
          description: "Risk to lesbian/gay/bisexual people"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "ROH"
          description: "OASys Serious Harm-High"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "ROM"
          description: "OASys Serious Harm-Medium"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "ROP"
          description: "Risk to older people"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "ROV"
          description: "OASys Serious Harm-Very High"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RPB"
          description: "Risk to Public - Community"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RPC"
          description: "Risk to Public - Custody"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RRV"
          description: "Risk to people with religious views"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RSP"
          description: "Stalking Perpetrator"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RSS"
          description: "Risk to Staff - Custody"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RST"
          description: "Risk to Staff - Community"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RTP"
          description: "Risk to transgender people"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "RVR"
          description: "Listed on VISOR System"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "RYP"
          description: "Risk to younger people"
          parentDomain: "ALERT"
          parentCode: "R"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "S"
      description: "Sexual Offence"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "SC"
          description: "Risk to Children"
          parentDomain: "ALERT"
          parentCode: "S"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "SO"
          description: "Sexual Offence Not on Sex Offender Reg"
          parentDomain: "ALERT"
          parentCode: "S"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "SONR"
          description: "Sex offender not required to register"
          parentDomain: "ALERT"
          parentCode: "S"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "SOR"
          description: "Registered sex offender"
          parentDomain: "ALERT"
          parentCode: "S"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "SR"
          description: "On Sex Offender Register"
          parentDomain: "ALERT"
          parentCode: "S"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "SSHO"
          description: "RSHO or SRO"
          parentDomain: "ALERT"
          parentCode: "S"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "T"
      description: "Hold Against Transfer"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "TAH"
          description: "Allocation Hold"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "TAP"
          description: "Accredited Programme hold"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "TCPA"
          description: "Do not transfer to CPA named in comments"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "TG"
          description: "Governor's Hold"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "TM"
          description: "Medical Hold"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "TPR"
          description: "Parole Review Hold"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "TSE"
          description: "Security Hold"
          parentDomain: "ALERT"
          parentCode: "T"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "V"
      description: "Vulnerability"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "V45"
          description: "Rule 45 - GOOD"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "V46"
          description: "Rule 46 - GOOD"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "V49G"
          description: "Rule 49 - GOOD"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "V49P"
          description: "Rule 49 - Own Protection"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "VI"
          description: "Victim"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "VJOP"
          description: "Rule 46 - Own Protection"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "VOP"
          description: "Rule 45 - Own Protection"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "VU"
          description: "Poor Coper"
          parentDomain: "ALERT"
          parentCode: "V"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "W"
      description: "Warrant"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "WO"
          description: "Non Appearance at Court"
          parentDomain: "ALERT"
          parentCode: "W"
          activeFlag: "Y"
        }
      ]
    },
    {
      domain: "ALERT"
      code: "X"
      description: "Security"
      activeFlag: "Y"
      subCodes:
      [
        {
          domain: "ALERT_CODE"
          code: "HPI"
          description: "High Public Interest"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "SA"
          description: "Staff Assaulter"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "SE"
          description: "NATIONAL PUBLIC DISORDER (NPD)"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XA"
          description: "Arsonist"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XB"
          description: "Bully"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XC"
          description: "Climber"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XCC"
          description: "PSO4400 CH1 Children"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "XCH"
          description: "PSO4400 CH2 Harassment"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "XCU"
          description: "Controlled Unlock"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XEAN"
          description: "External Agency Nominal"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XEBM"
          description: "Enhanced Behaviour Monitoring"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XEL"
          description: "Escape List"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XER"
          description: "Escape Risk"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XFO"
          description: "Financial Order"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XGANG"
          description: "Gang Member"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XHT"
          description: "Hostage taker"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XILLENT"
          description: "Illegal Entrant"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XIT"
          description: "No access to IT"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XLDEPORT"
          description: "Notified of liability for Deportation"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XNR"
          description: "Not For Release"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XOCGN"
          description: "Organised Crime Group Nominal"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XR"
          description: "Racist"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XRF"
          description: "Risk to Females"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XSA"
          description: "Staff Assaulter"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XSC"
          description: "Serious Crime Prevention Order"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XSDEPORT"
          description: "Deportation Order served"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XSO"
          description: "Sex Offender"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "N"
        },
        {
          domain: "ALERT_CODE"
          code: "XTACT"
          description: "Terrorism Act or Related Offence"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XVL"
          description: "Violent"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        },
        {
          domain: "ALERT_CODE"
          code: "XYA"
          description: "YO held as Adult"
          parentDomain: "ALERT"
          parentCode: "X"
          activeFlag: "Y"
        }
      ]
    }
  ]
}