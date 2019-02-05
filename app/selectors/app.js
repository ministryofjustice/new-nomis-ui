import { createSelector } from 'reselect'

const selectApp = () => state => state.get('app')

const selectDeviceFormat = () =>
  createSelector(
    selectApp(),
    state => state.get('deviceFormat')
  )

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

const selectShouldShowSpinner = () =>
  createSelector(
    selectApp(),
    app => app.get('shouldShowSpinner')
  )

const selectShouldShowTerms = () =>
  createSelector(
    selectApp(),
    app => app.get('shouldShowTerms')
  )

const selectMailTo = () =>
  createSelector(
    selectApp(),
    appState => appState.get('mailTo')
  )

export {
  selectDeviceFormat,
  selectMobileMenuOpen,
  selectModalOpen,
  selectModalData,
  selectSearchContext,
  selectShouldShowSpinner,
  selectShouldShowTerms,
  selectMailTo,
}
