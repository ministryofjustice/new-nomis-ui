package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput

import static com.github.tomakehurst.wiremock.client.WireMock.*

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

    stubFor(
      post('/oauth/token')
        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
        .withRequestBody(equalTo("username=${user.username}&password=password&grant_type=password"))
        .willReturn(response))
  }

  void stubInvalidOAuthTokenRequest(UserAccount user, boolean badPassword = false) {
    stubFor(
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
    stubFor(
      get('/health')
        .willReturn(aResponse()
        .withStatus(200)
        .withBody('''{"name":"elite2-web","version":"1.0.14","description":"Elite 2 Web",
"api":{"status":"UP","healthInfo":{"status":"UP","version":"2018-05-15"},
"diskSpace":{"status":"UP","total":510923390976,"free":114173091840,"threshold":10485760},
"db":{"status":"UP","database":"HSQL Database Engine","hello":4}}}'''))
    )
  }

  void stubGetMyDetails(UserAccount user) {
    stubFor(
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
        activeCaseLoadId: 'LEI'
      ]))))

    stubFor(
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

    stubFor(
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

    stubFor(
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

  void stubOffenderSearch(String details) {
    stubFor(
      get("/api/locations/description/LEI/inmates?keywords=${details}")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withHeader('Page-Limit', '200')
        .withHeader('Page-Offset', '0')
        .withHeader('Total-Records', '3')
        .withBody('''[
    {
        "bookingId": -12,
        "bookingNo": "A00122",
        "offenderNo": "A1234AL",
        "firstName": "DANIEL",
        "middleName": "JOHN",
        "lastName": "SMELLEY",
        "dateOfBirth": "1968-01-01",
        "age": 50,
        "agencyId": "LEI",
        "assignedLivingUnitId": -10,
        "assignedLivingUnitDesc": "A-1-8",
        "facialImageId": -12,
        "iepLevel": "Standard"
    },
    {
        "bookingId": -10,
        "bookingNo": "A00120",
        "offenderNo": "A1234AJ",
        "firstName": "DANIEL",
        "middleName": "JOSEPH",
        "lastName": "SMITH",
        "dateOfBirth": "1958-01-01",
        "age": 60,
        "agencyId": "LEI",
        "assignedLivingUnitId": -8,
        "assignedLivingUnitDesc": "A-1-6",
        "facialImageId": -10,
        "iepLevel": "Standard"
    },
    {
        "bookingId": -11,
        "bookingNo": "A00121",
        "offenderNo": "A1234AK",
        "firstName": "DARIUS",
        "lastName": "SMITH",
        "dateOfBirth": "1979-12-31",
        "age": 38,
        "agencyId": "LEI",
        "assignedLivingUnitId": -9,
        "assignedLivingUnitDesc": "A-1-7",
        "facialImageId": -11,
        "iepLevel": "Standard"
    }  ]''')))
  }

  void stubImage() {
    stubFor(
      get(urlMatching("/api/images/.+/data"))
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(404)))
  }

  void stubIEP() {
    stubFor(
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
    stubFor(
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

    stubFor(
      get("/api/bookings/offenderNo/A1234AJ?fullInfo=${fullInfo}")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody(fullInfo ? bigResult : smallResult)))
  }

  void stubAliases() {
    stubFor(
      get(urlMatching("/api/bookings/.+/aliases"))
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
        .withStatus(200)
        .withHeader('Content-Type', 'application/json')
        .withBody('''[]''')))
  }

  void stubCaseNoteTypes() {
    stubFor(
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
    stubFor(
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
    stubFor(
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
        "text": "stuff",
        "originalNoteText": "stuff",
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
    stubFor(
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
    stubFor(
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
}