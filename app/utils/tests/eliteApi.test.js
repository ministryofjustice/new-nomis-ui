import { CaseNoteTypeMapper } from '../eliteApi'

describe('eliteApi', () => {
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
