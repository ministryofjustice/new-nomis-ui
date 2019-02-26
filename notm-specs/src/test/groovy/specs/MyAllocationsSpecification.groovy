package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import org.junit.Rule
import pages.HomePage
import pages.LoginPage
import pages.MyAllocationsPage

import static model.UserAccount.ITAG_USER

@Slf4j
class MyAllocationsSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  def "should display allocations correctly when coming from the home page link"() {
    List<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMITH())
    offenders.push(model.Offender.BOB())

    setUpKeyWorkerAllocationsWith(offenders)

    given:
    to LoginPage
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I am logged in and click the link'
    myKeyWorkerAllocationsLink.click()

    then: 'I should be on the my allocations page'
    at MyAllocationsPage

    assert matchOffenders(offenders)
  }

  def "should display allocations correctly when coming from the menu link"() {
    List<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMITH())
    offenders.push(model.Offender.BOB())

    setUpKeyWorkerAllocationsWith(offenders)

    given:
    to LoginPage
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I am logged and the menu is expended'
    header.dropDownMenu.click()
    waitFor { header.dropDownMenuContents.displayed }

    then: 'I click on the allocations link'
    header.myAllocationsMenuLink[0].click()

    then: 'I should be on the my allocations page'
    at MyAllocationsPage

    assert matchOffenders(offenders)
  }

  def setUpKeyWorkerAllocationsWith(offenders) {
    def agencyId = "${ITAG_USER.staffMember.assginedCaseload}"
    def staffId = ITAG_USER.staffMember.id
    def keyWorker = ITAG_USER.staffMember

    oauthApi.stubValidOAuthTokenRequest()
    oauthApi.stubUsersMe ITAG_USER
    oauthApi.stubUserRoles()
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)
    elite2api.getOffenderSummaryDetails(offenders)
    elite2api.stubImage()
    elite2api.stubCaseNoteUsage(offenders)
    elite2api.stubSentenceDates(offenders)
    elite2api.stubCSRAssessments(offenders)

    keyworkerApi.stubGetKeyworkerDetails(staffId,agencyId,keyWorker)
    keyworkerApi.stubMigrationStatus(agencyId, true)
    keyworkerApi.stubGetAssignedOffenders(staffId,agencyId,offenders)
  }

}