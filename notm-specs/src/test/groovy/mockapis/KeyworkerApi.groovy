package mockapis

import model.StaffMember
import model.Offender
import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get

class KeyworkerApi extends WireMockRule {
  KeyworkerApi() {
    super(8081)
  }

  void stubMigrationStatus(String prisonId,boolean migrated) {
      this.stubFor(
        get("/key-worker/prison/${prisonId}")
          .withHeader('authorization', equalTo('bearer RW_TOKEN'))
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
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(keyWorker))))
  }

  void stubGetAssignedOffenders(Integer staffId, String prisonId, ArrayList<Offender> offenders) {
    this.stubFor(
      get("/key-worker/${staffId}/prison/${prisonId}/offenders")
        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson(offenders))))
  }
}