import eliteApi from '../eliteApi';


describe('eliteApi', () => {

  let sandbox;
  beforeEach(() => sion.sandbox.create());
  afterEach(() => sandbox.restore());

  it('loadAllUserCaseNoteTypes', () => {
    sandbox('eliteApi', 'getAll').resolves(
      [{
        "domain": "TASK_TYPE",
        "code": "ACP",
        "description": "Accredited Programme",
        "activeFlag": "Y",
        "subCodes": [{
          "domain": "TASK_SUBTYPE",
          "code": "ACP",
          "description": "Assessment",
          "activeFlag": "Y",
        }, {
          "domain": "TASK_SUBTYPE",
          "code": "ACP",
          "description": "General Visit",
          "activeFlag": "Y",
        }
        ],
      }, {
        "domain": "TASK_TYPE",
        "code": "CHAP",
        "description": "Chaplaincy",
        "parentDomainId": "AGY_LOC_TYPE",
        "activeFlag": "Y",
        "subCodes": [{
          "domain": "TASK_SUBTYPE",
          "code": "CHAP",
          "description": "Reception/Statutory Duty",
          "activeFlag": "Y",
        }, {
          "domain": "TASK_SUBTYPE",
          "code": "CHAP",
          "description": "Community Links",
          "activeFlag": "Y",
        }]
        }
      ],
    );

    eliteApi.loadAllUserCaseNoteTypes().then(response =>{
      console.log(response);
    })

  })
});

