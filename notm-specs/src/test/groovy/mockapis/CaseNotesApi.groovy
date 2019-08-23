package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import model.Offender
import model.StaffMember

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get

class CaseNotesApi extends WireMockRule {
  CaseNotesApi() {
    super(18083)
  }

  void stubGetKeyworkerByPrisonAndOffenderNo(String prisonId, String offenderNo) {
    this.stubFor(
      get("/key-worker/${prisonId}/offender/${offenderNo}")
        .willReturn(aResponse()
          .withStatus(404)
          .withBody("")))
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