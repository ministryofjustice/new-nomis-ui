const { pathfinderApiFactory } = require('./pathfinderApi')

const client = {
  getClientAuthed: jest.fn().mockResolvedValue({ body: { id: 1 } }),
}

const api = pathfinderApiFactory(client)

describe('pathhfinderApi', () => {
  describe('getPathfinderId', () => {
    it('should call the endpoint and return the id', async () => {
      const output = await api.getPathfinderId({}, 'A11111')
      expect(output).toEqual(1)
    })

    it('should return null if 404 response', async () => {
      client.getClientAuthed.mockImplementation(() => throw { response: { status: 404 } })
      const output = await api.getPathfinderId({}, 'A11111')
      expect(output).toEqual(null)
    })

    it('should throw if non 404 response', async () => {
      client.getClientAuthed.mockImplementation(() => throw new Error())
      await expect(api.getPathfinderId({}, 'A11111')).rejects.toThrow()
    })
  })
})
