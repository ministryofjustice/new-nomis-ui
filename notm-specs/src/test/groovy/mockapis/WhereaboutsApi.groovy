package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import model.UserAccount

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get

class WhereaboutsApi extends WireMockRule {

  WhereaboutsApi() {
    super(18082)
  }

  void stubWhereabouts(UserAccount user, boolean whereaboutsAvailable) {
    this.stubFor(
      get("/agencies/${user.workingCaseload.id}/locations/whereabouts")
        .willReturn(aResponse()
          .withStatus(200)
          .withHeader('Content-Type', 'application/json')
          .withBody(JsonOutput.toJson([enabled: whereaboutsAvailable]))))
  }

  void stubGetMyDetails(UserAccount user, boolean whereaboutsAvailable = false) {
    stubWhereabouts(user, whereaboutsAvailable)
  }

  void stubGetMyDetailsForKeyWorker(UserAccount user) {
    stubWhereabouts(user, false)
  }

}
