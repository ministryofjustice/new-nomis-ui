package specs

import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import model.Offender
import org.junit.Rule
import pages.HomePage
import pages.LoginPage
import pages.SearchResultsPage

import static model.UserAccount.ITAG_USER

@Slf4j
class SearchResultsSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  def "Display search results"() {
    elite2api.stubHealthCheck()

    given: 'I am logged in'
    to LoginPage
    elite2api.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I search for offenders'
    ArrayList<Offender> offenders = new ArrayList<Offender>()
    offenders.push(model.Offender.SMELLEY())
    offenders.push(model.Offender.BOB())
    offenders.push(model.Offender.SMITH())

    elite2api.stubOffenderSearch("aname", offenders)
    elite2api.stubImage()
    elite2api.stubIEP()

    searchFor "aname"

    then: 'The correct offenders are listed'
    at SearchResultsPage
    rows[1].text().contains('Smelley, Daniel\nA1234AL\nA-1-8')
    rows[2].text().contains('Bob, Darius\n' + 'A1234AK\n' + 'A-1-7')
    rows[3].text() == 'Smith, Daniel\n' + 'A1234AJ\n' + 'A-1-6' ||
      rows[3].text() == 'Smith, Daniel\n' + 'A1234AJ\n' + 'A-1-6\n' + 'Standard\n' + '60\n' + 'ARSONIST PEEP'

    when: "Alert filters are selected"
    if (!rows[3].text().contains('ARSONIST PEEP')) {
      // Alert filter test only applicable to desktop mode
      return;
    }
    moreFiltersLink.click()
    checkboxes[0].click() // acct
    checkboxes[3].click() // arsonist
    elite2api.stubOffenderSearch("aname",
      [model.Offender.SMITH(), model.Offender.BOB(), model.Offender.SMELLEY()],
      "&alerts=HA&alerts=XA")
    selectVisibleButton().click()

    then: "Filters are applied"
    rows.size() == 4
    // new results match stub with alert filters
    rows[1].find("div.add-margin-top", 0).text() == 'Smith, Daniel'
    rows[2].find("div.add-margin-top", 0).text() == 'Bob, Darius'
    rows[3].find("div.add-margin-top", 0).text() == 'Smelley, Daniel'
  }
}
