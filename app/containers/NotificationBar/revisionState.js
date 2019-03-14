import Cookies from 'universal-cookie'
import moment from 'moment'

const cookies = new Cookies()

const COOKIE_NAME = 'new-nomis-ui-notification-bar'

const notificationKey = ({ id, revision }) => `${id}-${revision}`

const alreadyDismissed = notification => {
  const lastKey = cookies.get(COOKIE_NAME)
  return notificationKey(notification) === lastKey
}

const rememberDismissed = notification => {
  cookies.set(COOKIE_NAME, notificationKey(notification), {
    expires: moment()
      .add(10, 'years')
      .toDate(),
  })
}

export { alreadyDismissed, rememberDismissed }
