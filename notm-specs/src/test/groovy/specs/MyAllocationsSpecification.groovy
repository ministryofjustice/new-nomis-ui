package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import model.Offender
import org.junit.Rule
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import pages.MyAllocationsPage
import pages.HomePage
import pages.LoginPage

import static model.UserAccount.ITAG_USER

@Slf4j
class MyAllocationsSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()


  def "should display the correct allocations once on the page"() {

    def agencyId = "${ITAG_USER.staffMember.assginedCaseload}"
    def staffId = ITAG_USER.staffMember.id
    def keyWorker = ITAG_USER.staffMember

    List<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMITH())
    offenders.push(model.Offender.BOB())

    elite2api.stubHealthCheck()
    elite2api.stubGetMyDetailsForKeyWorker(ITAG_USER)
    elite2api.getOffenderSummaryDetails(offenders)
    elite2api.stubImage()
    elite2api.stubCaseNoteUsage(offenders)
    elite2api.stubSentenceDates(offenders)
    elite2api.stubCSRAssessments(offenders)

    keyworkerApi.stubGetKeyworkerDetails(staffId,agencyId,keyWorker)
    keyworkerApi.stubMigrationStatus(agencyId, true)
    keyworkerApi.stubGetAssignedOffenders(staffId,agencyId,offenders)

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

}