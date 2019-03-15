import moment from 'moment'
import getTheNotification, { clearCache } from '../notificationSource'
import contentfulClient from '../contentfulClient'

const response = {
  total: 2,
  items: [
    {
      fields: {
        body: {},
        expiryTime: '2019-03-16T00:00',
        title: 'Slow searches',
        type: 'Alert',
      },
      sys: { id: 'abc', revision: 2 },
    },
    {},
  ],
}

describe('notificationSource', () => {
  beforeEach(() => {
    clearCache()
    contentfulClient.getEntries = jest.fn()
  })

  it('retrieves content', async () => {
    contentfulClient.getEntries.mockImplementation(() => Promise.resolve(response))

    expect(await getTheNotification()).toEqual({
      id: 'abc',
      revision: 2,
      body: {},
      type: 'Alert',
      expiryTime: moment('2019-03-16T00:00'),
    })
  })

  it('returns undefined when the contentfulClient throws an exception', async () => {
    contentfulClient.getEntries.mockImplementation(() => {
      throw new Error()
    })

    expect(await getTheNotification()).toBeUndefined()
  })

  it('caches the content', async () => {
    contentfulClient.getEntries.mockImplementation(() => Promise.resolve(response))
    await getTheNotification()
    const result = await getTheNotification()
    expect(result.id).toBe('abc')
    expect(contentfulClient.getEntries.mock.calls.length).toBe(1)
  })

  it('calls the Contentful client with the correct parameters', async () => {
    contentfulClient.getEntries.mockImplementation(() => Promise.resolve({ total: 0, items: [] }))
    await getTheNotification()
    expect(contentfulClient.getEntries.mock.calls[0][0]).toEqual({
      content_type: 'notification',
      order: '-sys.updatedAt',
    })
  })
})
