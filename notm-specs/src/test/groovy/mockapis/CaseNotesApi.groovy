package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static mockapis.response.CaseNoteTypes.getMyCaseNoteTypes
import static mockapis.response.CaseNoteTypes.getReferenceCaseNoteTypes
import static mockapis.response.CaseNotes.getCaseNotes

class CaseNotesApi extends WireMockRule {
  CaseNotesApi() {
    super(18083)
  }

  void stubCaseNoteTypes() {
    this.stubFor(
      get("/case-notes/types")
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(referenceCaseNoteTypes))))
  }

  void stubMeCaseNoteTypes() {
    this.stubFor(
      get('/case-notes/types-for-user')
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(myCaseNoteTypes))
        ))
  }

  void stubHealth() {
    this.stubFor(
      get('/ping')
        .willReturn(
          aResponse()
            .withStatus(200)
            .withHeader('Content-Type', 'text/plain')
            .withBody("pong")))
  }

  void stubSaveCaseNote(String type = "CHAP", String subType = "FAITH", String text = "some text") {
    // TODO check "occurrenceDateTime": "2018-04-30T07:00:00", (what we selected on the page)
    def data = """{
  "type": "${type}",
  "subType": "${subType}",
  "text": "${text}"
}"""
    this.stubFor(
      post(urlMatching("/case-notes/.+"))
        .withRequestBody(equalToJson(data, true, true))
        .willReturn(aResponse()
          .withStatus(201)
          .withHeader('Content-Type', 'application/json')
        ))
  }

  void stubSaveAmendCaseNote() {
    this.stubFor(
      put(urlMatching("/case-notes/.+/.+"))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
        ))

  }

  void stubGetCaseNote() {
    this.stubFor(
      get(urlMatching("/case-notes/A1234AJ.*"))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(getCaseNotes))))
  }

  def stubBookingCaseNotes(String offenderId) {
    this.stubFor(
      get(urlMatching("/case-notes/${offenderId}.*"))
        .withQueryParam('page', equalTo('0'))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withHeader('total-records', '40')
          .withHeader('page-limit', '20')
          .withHeader('page-offset', '0')
          .withBody(buildCaseNotes(0, 19, 0))))

    this.stubFor(
      get(urlMatching("/case-notes/${offenderId}.*"))
        .withQueryParam('page', equalTo('1'))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withHeader('total-records', '40')
          .withHeader('page-limit', '20')
          .withHeader('page-offset', '0')
          .withBody(buildCaseNotes(20, 39, 1))))
  }

  static def buildCaseNotes(Integer pageOffset, Integer pageLimit, Integer page) {
    return JsonOutput.toJson([
      content         :
        (pageOffset..pageLimit).collect {
          [
            subTypeDescription: "caseNotesubTypeDescription${it}",
            typeDescription   : "caseNotetypeDescription${it}",
            authorName        : "CaseNoteauthorName${it}",
            text              : "CaseNoteText${it}"

          ]
        },
      pageable        : [
        sort      : [
          sorted  : true,
          unsorted: false,
          empty   : false
        ],
        pageSize  : 20,
        pageNumber: "${page}",
        offset    : 0,
        paged     : true,
        unpaged   : false
      ],
      totalPages      : 2,
      totalElements   : 40,
      last            : false,
      number          : 0,
      size            : 20,
      numberOfElements: 20,
      sort            : [
        sorted  : true,
        unsorted: false,
        empty   : false
      ],
      first           : true,
      empty           : false
    ])

  }
}