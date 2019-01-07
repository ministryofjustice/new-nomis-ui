import { createSelector } from 'reselect'

const selectConfig = () => state => state.get('config')

const selectData = () =>
  createSelector(
    selectConfig(),
    configState => configState.get('data')
  )

const selectApi = () =>
  createSelector(
    selectData(),
    configState => configState.get('apiServer')
  )

// Transform search data into more useable list.
const selectBookingsSearch = () =>
  createSelector(
    selectData(),
    configState =>
      configState
        .get('bookingSearchOptions')
        .toJS()
        .map(opt => ({ field: Object.keys(opt)[0], title: opt[Object.keys(opt)[0]].title }))
  )
export { selectConfig, selectApi, selectBookingsSearch }
