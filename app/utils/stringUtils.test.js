import { buildSearchQueryString, cleanQuery } from './stringUtils'

const DEFAULT_QUERY_STRING = 'perPage=20&pageNumber=0&sortFields=lastName&sortFields=firstName&sortOrder=ASC'

const WITH_ALERT_QUERY_STRING =
  'alerts=ALRT&perPage=20&pageNumber=0&sortFields=lastName&sortFields=firstName&sortOrder=ASC'

describe('stringUtils', () => {
  describe('buildSearchQueryString', () => {
    it('Builds default query string', () => {
      expect(buildSearchQueryString({})).toEqual(DEFAULT_QUERY_STRING)
    })

    it('Builds default query string with empty alert array', () => {
      expect(buildSearchQueryString({ alerts: [] })).toEqual(DEFAULT_QUERY_STRING)
    })

    it('Builds default query string with empty alert string', () => {
      expect(buildSearchQueryString({ alerts: '' })).toEqual(DEFAULT_QUERY_STRING)
    })

    it('Builds  query string with  alert string', () => {
      expect(buildSearchQueryString({ alerts: 'ALRT' })).toEqual(WITH_ALERT_QUERY_STRING)
    })

    it('Builds  query string with  singleton array', () => {
      expect(buildSearchQueryString({ alerts: ['ALRT'] })).toEqual(WITH_ALERT_QUERY_STRING)
    })
  })

  describe('cleanQuery', () => {
    it('should handle an empty object', () => {
      expect(cleanQuery({})).toEqual({})
    })

    it('should remove invalid properties', () => {
      expect(
        cleanQuery({
          a: undefined,
          b: null,
          c: [],
          d: '',
        })
      ).toEqual({})
    })

    it('should retain valid properties', () => {
      const query = {
        a: ' ',
        b: 'b',
        c: ['a'],
        d: [1, 2, 3],
        e: 1,
      }
      expect(cleanQuery(query)).toEqual(query)
    })
  })
})
