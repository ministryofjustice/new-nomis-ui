package specs


import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import mockapis.WhereaboutsApi
import model.TestFixture
import org.junit.Rule
import pages.HomePage

import static model.UserAccount.ITAG_USER

@Slf4j
class KeyWorkerRoleBasedAccessSpecification extends BrowserReportingSpec {
  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  WhereaboutsApi whereaboutsApi = new WhereaboutsApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  TestFixture fixture = new TestFixture(browser, elite2api, whereaboutsApi,  oauthApi)

  def "should see the my key worker allocations link when the user is a key worker"() {
    given:
    fixture.loginAsKeyworker ITAG_USER

    when: 'I am logged in and on the home page'
    header.dropDownMenu.click()

    then: 'I should see the my key worker allocations link'
    assert myKeyWorkerAllocationsLink.present
  }

  def "should see the my key worker allocations link in the menu when the current user is a key worker"() {
    given:
    fixture.loginAsKeyworker ITAG_USER

    when: 'I am logged in and on the home page and the menu is expanded'
    header.dropDownMenu.click()
    waitFor { header.myAllocationsMenuLink.present }

    then: 'I should see the my key worker allocations link in the drop down menu'
    assert header.myAllocationsMenuLink.present
  }

  def "should not be able to see the my allocations button when the current user is not a key worker"() {
    given:
    fixture.loginAs ITAG_USER

    when: 'I am logged in and on the home page'

    then: 'I should not see the my key worker allocations link'
    assert myKeyWorkerAllocationsLink.present == false
  }

  def "should not see the my key worker allocations link in the menu when the current user is not a key worker"() {
    given:
    fixture.loginAs ITAG_USER

    when: 'I am logged in and on the home page and the menu is expanded'
    header.dropDownMenu.click()
    waitFor { header.dropDownMenuContents.displayed }

    then: 'I should not see the my key worker allocations link in the drop down menu'
    assert header.myAllocationsMenuLink.present == false
  }

}