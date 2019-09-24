import { createSelector } from 'reselect'

const selectApp = () => state => state.get('app')

const selectMobileMenuOpen = () =>
  createSelector(
    selectApp(),
    state => state.get('mobileMenuOpen')
  )

const selectModalOpen = () =>
  createSelector(
    selectApp(),
    state => state.get('modalOpen')
  )

const selectModalData = () =>
  createSelector(
    selectApp(),
    state => state.get('modalData')
  )

const selectSearchContext = () =>
  createSelector(
    selectApp(),
    state => state.get('searchContext')
  )

const selectSpinnerCount = () =>
  createSelector(
    selectApp(),
    app => app.get('spinnerCount')
  )

const selectMailTo = () =>
  createSelector(
    selectApp(),
    appState => appState.get('mailTo')
  )

const selectPrisonStaffHubUrl = () =>
  createSelector(
    selectApp(),
    appState => appState.get('prisonStaffHubUrl')
  )

const selectCategorisationUrl = () =>
  createSelector(
    selectApp(),
    appState => appState.get('categorisationUrl')
  )

export {
  selectMobileMenuOpen,
  selectModalOpen,
  selectModalData,
  selectSearchContext,
  selectSpinnerCount,
  selectMailTo,
  selectPrisonStaffHubUrl,
  selectCategorisationUrl,
}
