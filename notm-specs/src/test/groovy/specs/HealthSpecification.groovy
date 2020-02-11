package specs

import groovyx.net.http.HttpBuilder
import groovyx.net.http.HttpException
import mockapis.AllocationManagerApi
import mockapis.CaseNotesApi
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.WhereaboutsApi
import org.junit.Rule
import spock.lang.Specification

import static groovyx.net.http.HttpBuilder.configure

class HealthSpecification extends Specification {

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  CaseNotesApi caseNotesApi = new CaseNotesApi()

  @Rule
  Elite2Api elite2Api = new Elite2Api()

  @Rule
  OauthApi oauthApi = new OauthApi()

  @Rule
  AllocationManagerApi allocationManagerApi = new AllocationManagerApi()

  @Rule
  WhereaboutsApi whereaboutsApi = new WhereaboutsApi()

  HttpBuilder http

  def setup() {
    http = configure {
      request.uri = 'http://localhost:3007/health'
    }
  }

  def "Health page reports ok"() {

    given:
    keyworkerApi.stubHealth()
    caseNotesApi.stubHealth()
    elite2Api.stubHealth()
    oauthApi.stubHealth()
    allocationManagerApi.stubHealth()
    whereaboutsApi.stubHealth()

    when:
    def response = this.http.get()
    then:
    response.uptime > 0.0
    response.name == "new-nomis-ui"
    !response.version.isEmpty()
    response.api == [auth: 'UP', elite2: 'UP', keyworker: 'UP', caseNotes: 'UP', allocationManager: 'UP', whereabouts: 'UP']
  }

  def "Health page reports API down"() {

    given:
    keyworkerApi.stubDelayedError('/ping', 500)
    elite2Api.stubHealth()
    oauthApi.stubHealth()
    caseNotesApi.stubHealth()
    allocationManagerApi.stubHealth()
    whereaboutsApi.stubHealth()

    when:
    def response
    try {
      response = http.get()
    } catch (HttpException e) {
      response = e.body
    }

    then:
    response.name == "new-nomis-ui"
    !response.version.isEmpty()
    response.api == [auth: 'UP', elite2: 'UP', caseNotes: 'UP', allocationManager: 'UP', whereabouts: 'UP', keyworker: [timeout: 1000, code: 'ECONNABORTED', errno: 'ETIMEDOUT', retries: 2]]
  }
}
