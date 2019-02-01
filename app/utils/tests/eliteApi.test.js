import { CaseNoteTypeMapper, casenoteQueryStringGen } from '../eliteApi'

describe('eliteApi', () => {
  describe('case note types', () => {
    it('user.caseNoteTypes', () => {
      const data = [
        {
          domain: 'TASK_TYPE',
          code: 'ACP',
          description: 'Accredited Programme',
          activeFlag: 'Y',
          subCodes: [
            {
              domain: 'TASK_SUBTYPE',
              code: 'ACP',
              description: 'Assessment',
              activeFlag: 'Y',
            },
          ],
        },
      ]

      const result = CaseNoteTypeMapper(data)
      expect(result).toEqual({
        types: [{ code: 'ACP', description: 'Accredited Programme' }],
        subTypes: [{ code: 'ACP', description: 'Assessment', parentCode: 'ACP' }],
      })
    })
  })

  describe('caseNoteQueryStringGen', () => {
    it('empty query', () => {
      expect(casenoteQueryStringGen({})).toEqual('')
    })

    it('Should render & correctly', () => {
      expect(
        casenoteQueryStringGen({
          type: 'ACHIEVEMENTS',
          subType: 'LNG & SKILLS',
          startDate: '01/01/2019',
          endDate: '31/12/2019',
        })
      ).toEqual(
        "query=type%3Ain%3A'ACHIEVEMENTS'%2Cand%3AsubType%3Ain%3A'LNG%20%26%20SKILLS'&from=2019-01-01&to=2019-12-31"
      )
    })
  })
})
