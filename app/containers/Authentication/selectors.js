import { createSelector } from 'reselect'

const selectLogin = () => state => state.get('authentication')

export default () =>
  createSelector(
    selectLogin(),
    loginState => loginState.get('user')
  )
