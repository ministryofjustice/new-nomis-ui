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
          type: 'ACHEIVEMENTS',
          subType: 'LNG & SKILLS',
        })
      ).toEqual("query=type:in:'ACHEIVEMENTS',and:subType:in:'LNG & SKILLS'")
    })
  })
})
