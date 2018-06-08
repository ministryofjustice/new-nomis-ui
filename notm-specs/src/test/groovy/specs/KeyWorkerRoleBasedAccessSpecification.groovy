package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import org.junit.Rule
import pages.LoginPage
import pages.HomePage
import mockapis.Elite2Api

import static model.UserAccount.ITAG_USER

@Slf4j
class KeyWorkerRoleBasedAccessSpecification extends GebReportingSpec {
  @Rule
  Elite2Api elite2api = new Elite2Api()

  def "should see the my key worker allocations link when the user is a key worker"() {
    elite2api.stubHealthCheck()

    given:
    to LoginPage
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I am logged in and on the home page'

    then: 'I should see the my key worker allocations link'
    assert myKeyWorkerAllocationsLink.present
  }

  def "should see the my key worker allocations link in the menu when the current user is a key worker"() {
    elite2api.stubHealthCheck()

    given:
    to LoginPage
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I am logged in and on the home page and the menu is expended'
    header.dropDownMenu.click()
    waitFor { header.myAllocationsMenuLink.displayed }

    then: 'I should see the my key worker allocations link in the drop down menu'
    assert header.myAllocationsMenuLink.present
  }

  def "should not be able to see the my allocations button when the current user is not a key worker"() {
    elite2api.stubHealthCheck()

    given:
    to LoginPage
    elite2api.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I am logged in and on the home page'

    then: 'I should not see the my key worker allocations link'
    assert myKeyWorkerAllocationsLink.present == false
  }

  def "should not see the my key worker allocations link in the menu when the current user is a key worker"() {
    elite2api.stubHealthCheck()

    given:
    to LoginPage
    elite2api.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I am logged in and on the home page and the menu is expended'
    header.dropDownMenu.click()
    waitFor { header.dropDownMenu.displayed }

    then: 'I should not see the my key worker allocations link in the drop down menu'
    assert header.myAllocationsMenuLink.present == false
  }

  def "should not be able to navigate to the key worker allocations page when the current user is not a key worker"() {
    elite2api.stubHealthCheck()

    given:
    to LoginPage
    elite2api.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I navigate to /myKeyWorkerAllocations'
    go '/myKeyWorkerAllocations'

    then: 'I should have been redirected to the home page'
    at HomePage
  }


}