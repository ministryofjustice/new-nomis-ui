package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import model.Offender
import model.StaffMember

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get
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

  void stubHealth() {
    this.stubFor(
      get('/ping')
        .willReturn(
          aResponse()
            .withStatus(200)
            .withHeader('Content-Type', 'text/plain')
            .withBody("pong")))
  }
}