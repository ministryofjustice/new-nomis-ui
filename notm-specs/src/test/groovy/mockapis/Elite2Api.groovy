package mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonBuilder
import groovy.json.JsonOutput

import static com.github.tomakehurst.wiremock.client.WireMock.*

import model.UserAccount

class Elite2Api extends WireMockRule {

    Elite2Api() {
        super(8080)
    }

    void stubValidOAuthTokenRequest(UserAccount user, Boolean delayOAuthResponse = false) {
        final response = aResponse()
                .withStatus(200)
                .withHeader('Content-Type', 'application/json;charset=UTF-8')
                .withBody(JsonOutput.toJson([
                access_token : 'RW_TOKEN',
                token_type   : 'bearer',
                refresh_token: 'refreshToken',
                expires_in   : 599,
                scope        : 'read write',
                internalUser : true
        ]))

        if (delayOAuthResponse) {
            response.withFixedDelay(5000)
        }

        stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(equalTo("username=${user.username}&password=password&grant_type=password"))
                        .willReturn(response))

    }

    void stubInvalidOAuthTokenRequest(UserAccount user, boolean badPassword = false) {
        stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(matching("username=${user.username}&password=.*&grant_type=password"))
                        .willReturn(
                        aResponse()
                                .withStatus(400)
                                .withBody(JsonOutput.toJson([
                                error            : 'invalid_grant',
                                error_description:
                                        badPassword ?
                                                "invalid authorization specification - not found: ${user.username}"
                                                :
                                                "invalid authorization specification"
                        ]))))
    }


    void stubGetMyDetails(UserAccount user) {
        stubFor(
                get('/api/users/me')
                        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(JsonOutput.toJson([
                                staffId         : user.staffMember.id,
                                username        : user.username,
                                firstName       : user.staffMember.firstName,
                                lastName        : user.staffMember.lastName,
                                email           : 'itaguser@syscon.net',
                                activeCaseLoadId: 'LEI'
                        ]))))

        stubFor(
                get('/api/users/me/locations')
                        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''[
                                        {
                                                locationId: 1,
                                                locationType: "LEI",
                                                description: "Leeds",
                                                locationUsage: "string",
                                                agencyId: "string",
                                                parentLocationId: 0,
                                                currentOccupancy: 1,
                                                locationPrefix: "string",
                                                operationalCapacity: 0,
                                                userDescription: "string"
                                        }
                                        ]''')))

           stubFor(
                get('/api/users/me/caseLoads')
                        .withHeader('authorization', equalTo('bearer RW_TOKEN'))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''[
                                        {                                              
                                                "caseLoadId": 1,
                                                "description": "LEI",
                                                "type": "LEI",
                                                "caseloadFunction": "LEI"

                                        },
                                        {                                              
                                                "caseLoadId": 2,
                                                "description": "X-LEI",
                                                "type": "X-LEI",
                                                "caseloadFunction": "X-LEI"

                                        }
                                        ]''')))


                        
                        
    }

}