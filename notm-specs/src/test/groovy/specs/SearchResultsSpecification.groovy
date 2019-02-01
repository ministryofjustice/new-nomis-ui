package specs

import com.github.tomakehurst.wiremock.client.WireMock
import geb.spock.GebReportingSpec
import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import org.junit.Rule
import pages.AlertsPage
import pages.HomePage
import pages.LoginPage
import pages.SearchResultsPage
import spock.lang.IgnoreIf
import spock.lang.Requires

import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor
import static model.UserAccount.ITAG_USER

@Slf4j
class SearchResultsSpecification extends GebReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def 'Display search results and alerts'() {
    elite2api.stubHealthCheck()

    given: 'I am logged in'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I search for offenders'
    List<Offender> offenders = [
      Offender.SMELLEY(),
      Offender.BOB(),
      Offender.SMITH()]

    elite2api.stubOffenderSearch('aname', offenders, '')
    elite2api.stubImage()
    elite2api.stubIEP()

    searchFor 'aname'

    then: 'The correct offenders are listed'
    at SearchResultsPage
    images.size() == 3
    images[2].displayed
    rows[1].text().contains('Smelley, Daniel\nA1234AL\nA-1-8')
    rows[2].text().contains('Bob, Darius\n' + 'A1234AK\n' + 'A-1-7')
    rows[3].text() == 'Smith, Daniel\n' + 'A1234AJ\n' + 'A-1-6' ||
      rows[3].text() == 'Smith, Daniel\n' + 'A1234AJ\n' + 'A-1-6\n' + 'Standard\n' + '60\n' + 'ARSONIST PEEP'

    when: 'Alert filters are selected'
    moreFiltersLink.click()
    checkboxes[0].click() // acct
    checkboxes[4].click() // arsonist
    checkboxes[5].click() // TACT
    elite2api.stubOffenderSearch(
      'aname',
      [
        Offender.SMITH(),
        Offender.BOB(),
        Offender.SMELLEY()
      ],
      '&alerts=HA&alerts=XA&alerts=XTACT')
    selectVisibleButton().click()

    then: 'Filters are applied'
    rows.size() == 4
    // new results match stub with alert filters
    rows[1].find('div.add-margin-top', 0).text() == 'Smith, Daniel'
    rows[2].find('div.add-margin-top', 0).text() == 'Bob, Darius'
    rows[3].find('div.add-margin-top', 0).text() == 'Smelley, Daniel'

    when: 'Alert is clicked'
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)
    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubBookingAlerts(-10)
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    elite2api.stubAlertTypes()

    rows[1].find('.arsonist-status').click()

    then: 'The offender details alert tab is shown'
    at AlertsPage
    waitFor{ alerts.present }
    alerts[0].text().contains('alertType0')
    alerts[1].text().contains('alertType1')
  }

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def 'Clear filters'() {
    elite2api.stubHealthCheck()

    given: 'I am logged in'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    when: 'I search for offenders'
    List<Offender> offenders = [
      Offender.SMELLEY(),
      Offender.BOB(),
      Offender.SMITH()]

    elite2api.stubOffenderSearch('aname', offenders, '')
    elite2api.stubImage()
    elite2api.stubIEP()

    searchFor 'aname'

    then: 'on the search results page'
    at SearchResultsPage

    when: 'Alert filters are selected'
    moreFiltersLink.click()
    checkboxes[0].click() // acct
    checkboxes[4].click() // arsonist
    checkboxes[5].click() // TACT
    elite2api.stubOffenderSearch(
      'aname',
      [
        Offender.SMITH(),
      ],
      '&alerts=HA&alerts=XA&alerts=XTACT')
    selectVisibleButton().click()

    then: 'Filters are applied'
    rows.size() == 2

    when: 'Clear filters is clicked'
    checkboxes.every{ cb -> cb.value() == null } == false

    // Forget about all previous recorded requests
    elite2api.resetAll()

    elite2api.stubOffenderSearch('aname', offenders, '')
    clearFilters.click()

    then: 'filters are cleared'
    at SearchResultsPage

    waitFor{ rows.size() == 4 }

    checkboxes.size() == 7
    checkboxes.every{ cb -> cb.value() == null } == true

    // Make sure a request was made for unfiltered data
    elite2api.verify(getRequestedFor(urlEqualTo('/api/locations/description/LEI/inmates?keywords=aname&returnIep=true&returnAlerts=true&returnCategory=true')))
  }

  @IgnoreIf({ System.properties['geb.env'] == 'chromeMobile' })
  def 'Search results ordering for desktop'() {
    elite2api.stubHealthCheck()

    given: 'I have searched for offenders'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    List<Offender> offenders2 = [Offender.SMELLEY(), Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders2, '')
    elite2api.stubImage()
    elite2api.stubIEP()
    searchFor 'aname'

    at SearchResultsPage
    rows.size() == 3

    when: 'I select ordering by age'
    List<Offender> offenders1 = [Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders1, '', 'dateOfBirth', 'ASC')
    sortingSelect.click()
    waitFor { dateOfBirthOption.displayed }
    dateOfBirthOption.click()

    then: 'The correct sort field is passed to the api'
    // The stub has matched the correct header sort params
    waitFor { rows.size() == 2 }
  }

  @Requires({ System.properties['geb.env'] == 'chromeMobile' })
  def 'Search results ordering for mobile'() {
    elite2api.stubHealthCheck()

    given: 'I have searched for offenders'
    to LoginPage
    oauthApi.stubValidOAuthTokenRequest(ITAG_USER)
    elite2api.stubGetMyDetails(ITAG_USER)
    loginAs ITAG_USER, 'password'
    at HomePage

    List<Offender> offenders2 = [Offender.SMELLEY(), Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders2, '')
    elite2api.stubImage()
    elite2api.stubIEP()
    searchFor 'aname'

    at SearchResultsPage
    rows.size() == 3

    when: 'I toggle ordering'
    List<Offender> offenders1 = [Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders1, '', 'lastName,firstName', 'DESC')
    sortingToggleArrow.click()

    then: 'The correct sort field is passed to the api'
    waitFor { rows.size() == 2 }
    rows[1].find('div.add-margin-top', 0).text() == 'Smith, Daniel'
  }
}
