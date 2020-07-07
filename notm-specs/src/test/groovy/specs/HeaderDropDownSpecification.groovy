package specs


import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.TokenVerificationApi
import mockapis.WhereaboutsApi
import model.TestFixture
import org.junit.Rule
import pages.HomePage

import static model.UserAccount.ITAG_USER

@Slf4j
class HeaderDropDownSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  WhereaboutsApi whereaboutsApi = new WhereaboutsApi()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  @Rule
  TokenVerificationApi tokenVerificationApi = new TokenVerificationApi()

  TestFixture fixture = new TestFixture(browser, elite2api, whereaboutsApi, oauthApi, tokenVerificationApi)

  def "should show the case load description"() {

    given: "I have logged in"
    fixture.loginAs(ITAG_USER)

    when: "I am on the home page"
    at HomePage

    then: "I should see my case load description"

    if(header.isDesktop()) {
      header.usernameDesktop == "User, Api"
      header.caseloadDesktop == "Leeds"
    }
  }

}