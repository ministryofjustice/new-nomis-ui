import Cookies from 'universal-cookie'
import moment from 'moment'

const COOKIE_NAME = 'new-nomis-ui-notification-bar'

const notificationKey = ({ id, revision }) => `${id}-${revision}`

// Use a factory so that Cookies is constructed late and can be mocked by jest tests...
const dismissState = () => {
  const cookies = new Cookies()

  return {
    alreadyDismissed: notification => {
      const lastKey = cookies.get(COOKIE_NAME)
      return notificationKey(notification) === lastKey
    },

    rememberDismissed: notification => {
      cookies.set(COOKIE_NAME, notificationKey(notification), {
        expires: moment()
          .add(10, 'years')
          .toDate(),
      })
    },
  }
}

export default dismissState
