package specs


import groovy.util.logging.Slf4j
import mockapis.Elite2Api
import mockapis.KeyworkerApi
import mockapis.OauthApi
import model.Offender
import model.TestFixture
import org.junit.Rule
import pages.AlertsPage
import pages.SearchResultsPage
import spock.lang.IgnoreIf
import spock.lang.Requires

import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import static model.UserAccount.ITAG_USER

@Slf4j
class SearchResultsSpecification extends BrowserReportingSpec {

  @Rule
  Elite2Api elite2api = new Elite2Api()

  @Rule
  KeyworkerApi keyworkerApi = new KeyworkerApi()

  @Rule
  OauthApi oauthApi = new OauthApi()

  TestFixture fixture = new TestFixture(browser, elite2api, oauthApi)

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def 'Display search results and alerts'() {
    given: 'I am logged in'
    fixture.loginAs ITAG_USER

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
    waitFor { images.size() == 3 }
    waitFor { images[2].displayed }

    rows[0].text().contains('Smelley, Daniel A1234AL A-1-8')
    rows[1].text().contains('Bob, Darius A1234AK A-1-7')
    rows[2].text().contains('Smith, Daniel A1234AJ A-1-6')

    when: 'Alert filters are selected'
    moreFiltersLink.click()
    checkboxes[0].click() // acct
    checkboxes[2].click() // arsonist
    checkboxes[17].click() // TACT
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
    rows.size() == 3
    // new results match stub with alert filters
    waitFor { rows[0].find("[data-qa=\'bookings-results-offender-name\']", 0).text() == 'Smith, Daniel' }
    rows[1].find("[data-qa=\'bookings-results-offender-name\']", 0).text() == 'Bob, Darius'
    rows[2].find("[data-qa=\'bookings-results-offender-name\']", 0).text() == 'Smelley, Daniel'

    when: 'Alert is clicked'
    elite2api.stubOffenderDetails(true)
    elite2api.stubOffenderDetails(false)
    elite2api.stubOffenderAddresses()
    elite2api.stubContacts()
    elite2api.stubBookingIdentifiers(-10)
    elite2api.stubCaseNoteUsage([Offender.SMITH()])

    keyworkerApi.stubGetKeyworkerByPrisonAndOffenderNo('LEI', 'A1234AJ')
    elite2api.stubBookingAlerts(-10)
    elite2api.stubAliases()
    elite2api.stubStaffDetails(-2)
    elite2api.stubAlertTypes()

    rows[0].find('.arsonist-status').click()

    then: 'The offender details alert tab is shown'
    at AlertsPage
    alerts[0].text().contains('alertType0')
    alerts[1].text().contains('alertType1')
  }

  @IgnoreIf({System.properties['geb.env'] == 'chromeMobile'})
  def 'Clear filters'() {
    given: 'I am logged in'
    fixture.loginAs ITAG_USER

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
    waitFor { rows.size() == 3 }

    when: 'Alert filters are selected'
    moreFiltersLink.click()
    checkboxes[0].click() // acct
    checkboxes[2].click() // arsonist
    checkboxes[17].click() // TACT
    elite2api.stubOffenderSearch(
      'aname',
      [
        Offender.SMITH(),
      ],
      '&alerts=HA&alerts=XA&alerts=XTACT')
    selectVisibleButton().click()

    then: 'Filters are applied'
    waitFor { rows.size() == 1 }

    when: 'Clear filters is clicked'
    checkboxes.every{ cb -> cb.value() == null } == false

    // Forget about all previous recorded requests
    elite2api.resetAll()

    elite2api.stubOffenderSearch('aname', offenders, '')
    clearFilters.click()

    then: 'filters are cleared'
    at SearchResultsPage

    waitFor { rows.size() == 3 }

    checkboxes.size() == 19
    checkboxes.every{ cb -> cb.value() == null } == true

    // Make sure a request was made for unfiltered data
    elite2api.verify(getRequestedFor(urlEqualTo('/api/locations/description/LEI/inmates?keywords=aname&returnIep=true&returnAlerts=true&returnCategory=true')))
  }

  @IgnoreIf({ System.properties['geb.env'] == 'chromeMobile' })
  def 'Search results ordering for desktop'() {
    given: 'I have searched for offenders'
    fixture.loginAs ITAG_USER

    List<Offender> offenders2 = [Offender.SMELLEY(), Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders2, '')
    elite2api.stubImage()
    elite2api.stubIEP()
    searchFor 'aname'

    at SearchResultsPage
    waitFor { rows.size() == 2 }

    when: 'I select ordering by age'
    List<Offender> offenders1 = [Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders1, '', 'dateOfBirth', 'ASC')
    sortingSelect.click()
    waitFor { dateOfBirthOption.displayed }
    dateOfBirthOption.click()

    then: 'The correct sort field is passed to the api'
    // The stub has matched the correct header sort params
    waitFor { rows.size() == 1 }
  }

  @Requires({ System.properties['geb.env'] == 'chromeMobile' })
  def 'Search results ordering for mobile'() {
    given: 'I have searched for offenders'
    fixture.loginAs ITAG_USER

    List<Offender> offenders2 = [Offender.SMELLEY(), Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders2, '')
    elite2api.stubImage()
    elite2api.stubIEP()
    searchFor 'aname'

    at SearchResultsPage
    waitFor { rows.size() == 2 }

    when: 'I toggle ordering'
    List<Offender> offenders1 = [Offender.SMITH()]
    elite2api.stubOffenderSearch('aname', offenders1, '', 'lastName,firstName', 'DESC')
    sortingToggleArrow.click()

    then: 'The correct sort field is passed to the api'
    waitFor { rows.size() == 1 }
    rows[0].find("[data-qa=\'bookings-results-offender-name\']", 0).text() == 'Smith, Daniel'
  }
}
