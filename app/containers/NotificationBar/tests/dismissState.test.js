import dismissState from '../dismissState'

const EXPECTED_COOKIE_NAME = 'new-nomis-ui-notification-bar'

const mockSet = jest.fn()
const mockGet = jest.fn()

// Mock the constructor from the 'universal-cookie' module
jest.mock('universal-cookie', () =>
  jest.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
  }))
)

describe('dismissState', () => {
  beforeEach(() => {
    mockSet.mockClear()
    mockGet.mockClear()
  })

  describe('alreadyDismissed', () => {
    it('is not dismissed when no cookie present', () => {
      const state = dismissState()
      expect(state.alreadyDismissed({ id: 'x', revision: 1 })).toBe(false)
      expect(mockSet).not.toHaveBeenCalled()
      expect(mockGet).toHaveBeenCalledWith(EXPECTED_COOKIE_NAME)
    })

    it('is dismissed when cookie value matches', () => {
      const state = dismissState()
      mockGet.mockReturnValue('x-1')
      expect(state.alreadyDismissed({ id: 'x', revision: 1 })).toBe(true)
    })

    it('is not dismissed when cookie value does not match', () => {
      const state = dismissState()
      mockGet.mockReturnValue('x-1')
      expect(state.alreadyDismissed({ id: 'x', revision: 2 })).toBe(false)
    })
  })

  describe('rememberDismissed (for 10 years)', () => {
    it("sets the cookie with the notification's key", () => {
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 0, 1)).valueOf())
      const state = dismissState()
      state.rememberDismissed({ id: 'y', revision: 2 })
      expect(mockSet).toHaveBeenCalledWith(EXPECTED_COOKIE_NAME, 'y-2', { expires: new Date(Date.UTC(2027, 0, 1)) })
    })
  })
})
