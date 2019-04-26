package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import model.Offender
import model.StaffMember

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get

class KeyworkerApi extends WireMockRule {
  KeyworkerApi() {
    super(18081)
  }

  void stubMigrationStatus(String prisonId,boolean migrated) {
      this.stubFor(
        get("/key-worker/prison/${prisonId}")
          .willReturn(aResponse()
            .withStatus(200)
            .withHeader('Content-Type', 'application/json')
            .withBody(JsonOutput.toJson([
                migrated: migrated,
          ]))))
  }

  void stubGetKeyworkerDetails(Integer staffId, String prisonId, StaffMember keyWorker) {
    this.stubFor(
      get("/key-worker/${staffId}/prison/${prisonId}")
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(keyWorker))))
  }

  void stubGetAssignedOffenders(Integer staffId, String prisonId, ArrayList<Offender> offenders) {
    this.stubFor(
      get("/key-worker/${staffId}/prison/${prisonId}/offenders")
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(offenders))))
  }

  void stubGetKeyworkerByPrisonAndOffenderNo(String prisonId, String offenderNo) {
    this.stubFor(
      get("/key-worker/${prisonId}/offender/${offenderNo}")
        .willReturn(aResponse()
          .withStatus(404)
          .withBody("")))
  }
}