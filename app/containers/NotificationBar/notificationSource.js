import moment from 'moment'
import contentfulClient from './contentfulClient'

// The most recently modified notification.

const theNotification = async () => {
  // Fetching a single entry by id runs into problems with cacheing in contentful's CDN.
  // Fetching all entries and filtering using search parameters doesn't seem to have this problem.
  //
  const entries = await contentfulClient.getEntries({
    content_type: 'notification',
    order: '-sys.updatedAt',
  })
  return entries && entries.total ? entries.items[0] : undefined
}

// This is cached at the module level so that the content is only fetched once per application lifecycle.
let cachedNotification

const getTheNotification = async () => {
  if (cachedNotification) return cachedNotification

  try {
    const data = await theNotification()
    const {
      sys: { revision, id },
      fields: { body, type, expiryTime },
    } = data

    cachedNotification = {
      id,
      revision,
      body,
      type,
      expiryTime: expiryTime ? moment(expiryTime) : undefined,
    }
  } catch (error) {
    // TODO: report this somehow?
  }
  return cachedNotification
}

const clearCache = () => {
  cachedNotification = undefined
}

export default getTheNotification

export { clearCache } // for testing
