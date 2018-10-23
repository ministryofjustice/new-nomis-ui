package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.response.AccessRoles
import model.TestFixture
import model.UserAccount
import org.junit.Rule
import pages.HomePage

@Slf4j
class HomePageSpecification extends GebReportingSpec {
  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)


  def "should show the global search check box when the current is has the global search access role"() {
    given: "the user is logged in and has the global search access role"
    elite2api.stubHealthCheck()
    fixture.loginAs(UserAccount.ITAG_USER)

    when: 'I am on the homepage'
    at HomePage

    then: 'I should see the global search checkbox'
    globalSearchCheckBox.present == true
  }
}
