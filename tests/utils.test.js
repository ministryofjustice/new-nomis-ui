import { groupBy } from '../server/utils'

describe('utils', () => {
  describe('groupBy', () => {
    it('should group by a specific property', () => {
      const data = [
        { name: 'name1', value: 'nameValue1' },
        { name: 'name1', value: 'nameValue2' },
        { name: 'name2', value: 'nameValue3' },
        { name: 'name2', value: 'nameValue4' },
      ]

      const expected = {
        name1: [
          { name: 'name1', value: 'nameValue1' },
          { name: 'name1', value: 'nameValue2' },
        ],
        name2: [
          { name: 'name2', value: 'nameValue3' },
          { name: 'name2', value: 'nameValue4' },
        ],
      }
      const actual = groupBy('name', data)

      expect(actual).toEqual(expected)
    })
  })
})
