context('Alerts page', () => {
  const bookingId = 1001
  const offenderNo = 'A1234AJ'
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubOffenderDetails', true)
    cy.task('stubOffenderDetails', false)
    cy.task('stubLocations', 'MDI')
    cy.task('stubUsersMe')
    cy.task('stubBookingAlerts', bookingId)
    cy.task('stubUserRoles')
    cy.task('stubStaffRolesForKeyWorker')
    cy.task('stubWhereabouts')
    cy.task('stubOffenderAddresses')
    cy.task('stubAlertTypes')
    cy.task('stubAliases')
    cy.task('stubIEP')
    cy.task('stubImage')
  })

  it('Remains on the page when filters are applied', () => {
    cy.login('A1234AJ')
    cy.visit(`/offenders/${offenderNo}/alerts`)

    cy.get('#alertType').select('Risk')
    cy.get('form button[type=submit]').click()

    cy.url().should('includes', 'alerts')
  })

  it('Clears filters', () => {
    cy.login('A1234AJ')
    cy.visit(`/offenders/${offenderNo}/alerts`)
    cy.get('#alertType').select('Risk')
    cy.get('form button[type=submit]').click()
    cy.url().should('includes', 'alerts')
    cy.get('form button.reset-filters').click()

    cy.url().should('includes', 'alerts')
  })
})
