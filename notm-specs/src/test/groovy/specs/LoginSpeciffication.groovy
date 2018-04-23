package specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import spock.lang.Ignore
import mockapis.Elite2Api
import model.TestFixture
import pages.HomePage
import pages.LoginPage

import static model.UserAccount.ITAG_USER
import static model.UserAccount.NOT_KNOWN

@Ignore
class LoginSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    TestFixture fixture = new TestFixture(browser, elite2api)

    def "The login page is present"() {
        when: 'I go to the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        when: "I go to the website URL using an empty path"
        go '/'

        then: 'The Login page is displayed'
        at LoginPage
    }

   def "Log in with valid credentials"() {
        given: 'I am on the Login page'
        to LoginPage

        elite2api.stubValidOAuthTokenRequest(ITAG_USER)
        elite2api.stubGetMyDetails(ITAG_USER)

        when: "I login using valid credentials"
        loginAs ITAG_USER, 'password'

        then: 'My credentials are accepted and I am shown the Key worker management page'
        at HomePage
    }
}