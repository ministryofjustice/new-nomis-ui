package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import org.junit.Rule
import mockapis.Elite2Api
import model.TestFixture
import pages.HomePage
import pages.LoginPage
import spock.lang.Ignore

import static model.UserAccount.ITAG_USER
import static model.UserAccount.NOT_KNOWN

@Slf4j
class LoginSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    TestFixture fixture = new TestFixture(browser, elite2api)

    def "The login page is present"() {

      elite2api.stubHealthCheck()

      when: 'I go to the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

   def "Default URI redirects to Login page"() {
        elite2api.stubHealthCheck()

        when: "I go to the website URL using an empty path"
        go '/'

        then: 'The Login page is displayed'
        at LoginPage
   }

   def "Log in with valid credentials"() {
        elite2api.stubHealthCheck()

        given: 'I am on the Login page'
        to LoginPage

        elite2api.stubValidOAuthTokenRequest(ITAG_USER)
        elite2api.stubGetMyDetails(ITAG_USER)

        when: "I login using valid credentials"
        loginAs ITAG_USER, 'password'

        then: 'My credentials are accepted and I am shown the home page'
        at HomePage
    }

    @Ignore
    def "Log in successfully with external links available at current caseload prison"() {
        elite2api.stubHealthCheck()

        given: 'I am on the Login page'
        to LoginPage

        elite2api.stubValidOAuthTokenRequest(ITAG_USER)
        elite2api.stubGetMyDetails(ITAG_USER, true)

        when: "I login using valid credentials"
        loginAs ITAG_USER, 'password'

        then: 'My credentials are accepted and the home page includes the whereabouts icon'
        at HomePage
        externalLinks[0].text().contains('Manage key workers')
        externalLinks[1].text().contains('Manage prisoner whereabouts')
    }

    def "Unknown user is rejected"() {
        elite2api.stubHealthCheck()

        given: 'I am on the Login page'
        elite2api.stubInvalidOAuthTokenRequest(NOT_KNOWN)
        to LoginPage

        when: 'I login using an unknown username'
        loginAs NOT_KNOWN, 'password'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why I couldn\'t log in'
        errors.message == 'The username or password you have entered is invalid.'
    }

    def "Unknown password is rejected"() {
        elite2api.stubHealthCheck()

        given: 'I am on the Login page'
        elite2api.stubInvalidOAuthTokenRequest(ITAG_USER, true)
        to LoginPage

        when: 'I login using an unknown username'
        loginAs ITAG_USER, 'wildGuess'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why I couldn\'t log in'
        errors.message == 'The username or password you have entered is invalid.'
    }

    def "Log out"() {
        elite2api.stubHealthCheck()

        given: "I have logged in"
        fixture.loginAs(ITAG_USER)

        when: "I log out"
        header.logout()

        then: "I am returned to the Login page."
        at LoginPage
    }
}
