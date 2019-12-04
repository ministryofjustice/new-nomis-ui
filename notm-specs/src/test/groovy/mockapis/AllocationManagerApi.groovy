package mockapis

import com.github.tomakehurst.wiremock.extension.responsetemplating.ResponseTemplateTransformer
import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

class AllocationManagerApi extends WireMockRule {

  AllocationManagerApi() {
    super(18084)
  }

  void stubHealth() {
    this.stubFor(
      get('/health')
        .willReturn(
          aResponse()
            .withStatus(200)
            .withHeader('Content-Type', 'text/plain')
            .withBody("Everything is fine.")))
  }

    void stubGetPomByOffenderNo(offenderNo) {
    this.stubFor(
      get("/api/allocation/${offenderNo}")
        .willReturn(
          aResponse()
            .withStatus(200)
            .withHeader('Content-Type', 'application/json')
            .withBody('''{}''')
        )
    )
  }
}