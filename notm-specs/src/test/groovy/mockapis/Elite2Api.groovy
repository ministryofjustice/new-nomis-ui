package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import model.Offender

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching
import static com.github.tomakehurst.wiremock.client.WireMock.matching
import static com.github.tomakehurst.wiremock.client.WireMock.equalToJson

import model.UserAccount

class Elite2Api extends WireMockRule {

  Elite2Api() {
    super(8080)
  }

  void stubValidOAuthTokenRequest(UserAccount user, Boolean delayOAuthResponse = false) {
    final response = aResponse()
      .withStatus(200)
      .withHeader('Content-Type', 'application/json;charset=UTF-8')
      .withBody(JsonOutput.toJson([
      access_token : 'RW_TOKEN',
      token_type   : 'bearer',
      refresh_token: 'refreshToken',
      expires_in   : 599,
      scope        : 'read write',
      internalUser : true
    ]))

    if (delayOAuthResponse) {
      response.withFixedDelay(5000)
    }

    this.stubFor(
      post('/oauth/token')
        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
        .withRequestBody(equalTo("username=${user.username}&password=password&grant_type=password"))
        .willReturn(response))
  }

  void stubInvalidOAuthTokenRequest(UserAccount user, boolean badPassword = false) {
    this.stubFor(
      post('/oauth/token')
        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
        .withRequestBody(matching("username=${user.username}&password=.*&grant_type=password"))
        .willReturn(
        aResponse()
          .withStatus(400)
          .withBody(JsonOutput.toJson([
          error            : 'invalid_grant',
          error_description:
            badPassword ?
              "invalid authorization specification - not found: ${user.username}"
              :
              "invalid authorization specification"
        ]))))
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

  void stubGetMyDetails(UserAccount user) {
    stubUsersMe(user)
    stubLocations()
    stubUserRoles()
    stubStaffRoles(user)
    stubCaseLoads()
  }

  void stubGetMyDetailsForKeyWorker(UserAccount user) {
    stubValidOAuthTokenRequest(user)
    stubUsersMe(user)
    stubLocations()
    stubStaffRolesForKeyWorker(user)
    stubUserRoles()
    stubCaseLoads()
  }

  void stubUsersMe(UserAccount user) {
    this.stubFor(
      get('/api/users/me')
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[{
            "roleId": 0,
            "roleCode": "KW_ADMIN",
            "roleName": "Key worker admin",
            "parentRoleCode": "code",
            "caseloadId": "1"
          }]''')))
  }

  void stubCaseLoads() {
    this.stubFor(
      get('/api/users/me/caseLoads')
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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

  void stubStaffRoles(UserAccount user) {

    this.stubFor(
      get("/api/staff/${user.staffMember.id}/${user.staffMember.assginedCaseload.id}/roles")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(body)))
  }

  void stubOffenderSearch(String details, ArrayList<Offender> offenders) {
    this.stubFor(
      get("/api/locations/description/LEI/inmates?keywords=${details}")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(404)))
  }

  void stubIEP() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/iepSummary"))
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(fullInfo ? bigResult : smallResult)))
  }

  void stubAliases() {
    this.stubFor(
      get(urlMatching("/api/bookings/.+/aliases"))
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[]''')))
  }

  void stubCaseNoteTypes() {
    this.stubFor(
      get("/api/reference-domains/caseNoteTypes")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody()))
  }

  void getOffenderSummaryDetails(ArrayList offenders) {

    String queryString = buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/bookings?iepLevel=true&${queryString}")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }

  def stubCSRAssessments(ArrayList offenders) {
    String queryString = buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/offender-assessments/CSR?${queryString}")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }

  def stubSentenceDates(ArrayList offenders) {
    String queryString = buildOffenderQueryString(offenders)

    this.stubFor(
      get("/api/offender-sentences/?${queryString}")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(JsonOutput.toJson(offenders))))
  }


  String buildOffenderQueryString(ArrayList offenders) {
     return offenders
       .stream()
       .map{offender -> "offenderNo=${offender.offenderNo}"}
       .collect(java.util.stream.Collectors.joining("&"))

  }

}
