import getContent from '../notificationBarContent'

describe('content tests', () => {
  it('should load the content', async () => {
    const data = await getContent()
    console.log(data)
  })
})
