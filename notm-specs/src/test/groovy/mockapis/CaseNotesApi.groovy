package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static mockapis.response.CaseNoteTypes.getMyCaseNoteTypes
import static mockapis.response.CaseNoteTypes.getReferenceCaseNoteTypes

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

  void stubSaveCaseNote(String type = "CHAP", String subType = "FAITH", String typeDescription = "Chaplaincy", String subTypeDescription = "Faith Specific Action") {
    // TODO check "occurrenceDateTime": "2018-04-30T07:00:00", (what we selected on the page)
    def data = """{
  "type": "${type}",
  "subType": "${subType}",
  "text": "some text"
}"""
    this.stubFor(
      post(urlMatching("/case-notes/.+"))
        .withRequestBody(equalToJson(data, true, true))
        .willReturn(aResponse()
          .withStatus(201)
          .withHeader('Content-Type', 'application/json')
        ))
  }

  void  stubSaveAmendCaseNote(){
    this.stubFor(
      put(urlMatching("/case-notes/.+/.+"))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
        ))

  }
}