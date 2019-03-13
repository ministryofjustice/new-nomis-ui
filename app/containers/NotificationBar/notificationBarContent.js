import moment from 'moment'
import contentfulClient from './contentfulClient'

// The one and only notification.
const theNotification = () => contentfulClient.getEntry('7Ho11KOzgCUIzv5eYA8B6D') // returns a promise

let cachedContent

const getContent = async () => {
  if (cachedContent) return cachedContent

  try {
    const data = await theNotification()
    const {
      sys: { revision },
      fields: { body, type, expiryTime },
    } = data

    cachedContent = {
      revision,
      body,
      type,
      expiryTime: expiryTime ? moment(expiryTime) : undefined,
    }
  } catch (error) {
    console.log(error)
  }
  return cachedContent
}

export default getContent
