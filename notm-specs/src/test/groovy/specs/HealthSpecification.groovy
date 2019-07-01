package specs

import groovyx.net.http.HttpBuilder
import groovyx.net.http.HttpException
import mockapis.Elite2Api
import org.junit.Rule
import spock.lang.Specification

import static groovyx.net.http.HttpBuilder.configure

class HealthSpecification extends Specification {


    @Rule
    Elite2Api elite2Api = new Elite2Api()

    HttpBuilder http

    def setup() {
        http = configure {
            request.uri = 'http://localhost:3007/health'
        }
    }

    def "Health page reports ok"() {

        given:
        elite2Api.stubHealth()

        when:
        def response = this.http.get()
        then:
        response.name == "new-nomis-ui"
        !response.version.isEmpty()
        response.api == 'pong'
    }

    def "Health page reports API down"() {

        given:
        elite2Api.stubDelayedError('/ping', 500)

        when:
        def response
        try {
            response = http.get()
        } catch (HttpException e) {
            response = e.body
        }

        then:
        response.api == "DOWN"
    }
}
