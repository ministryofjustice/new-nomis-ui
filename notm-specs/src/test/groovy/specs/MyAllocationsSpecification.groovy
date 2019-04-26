package specs

import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import model.TestFixture
import org.junit.Rule
import pages.MyAllocationsPage

import static model.Offender.BOB
import static model.Offender.SMITH
import static model.UserAccount.ITAG_USER

@Slf4j
class MyAllocationsSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)

  List<Offender> offenders = [SMITH(), BOB()]

  def "should display allocations correctly when coming from the home page link"() {
    given:
    setUpKeyWorkerAllocationsWith(offenders)
    fixture.loginAsKeyworker ITAG_USER

    when: 'I am logged in and click the link'
    myKeyWorkerAllocationsLink.click()

    then: 'I should be on the my allocations page'
    at MyAllocationsPage

    assert matchOffenders(offenders)
  }

  def "should display allocations correctly when coming from the menu link"() {
    given:
    setUpKeyWorkerAllocationsWith(offenders)
    fixture.loginAsKeyworker ITAG_USER

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
    def agencyId = "${ITAG_USER.staffMember.assignedCaseload}"
    def staffId = ITAG_USER.staffMember.id
    def keyWorker = ITAG_USER.staffMember

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