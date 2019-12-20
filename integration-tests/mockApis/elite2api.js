const { stubFor } = require('./wiremock')
const alertTypes = require('./mockResponses/alertTypes')

const createOffenderDetails = fullInfo => {
  const basic = {
    bookingId: -10,
    bookingNo: 'A00120',
    offenderNo: 'A1234AJ',
    firstName: 'DANIEL',
    middleName: 'JOSEPH',
    lastName: 'SMITH',
    agencyId: 'LEI',
    assignedLivingUnitId: -8,
    activeFlag: true,
    dateOfBirth: '1958-01-01',
  }

  const full = {
    ...basic,
    religion: 'Metodist',
    alertsCodes: [],
    activeAlertCount: 0,
    inactiveAlertCount: 1,
    categoryCode: 'A',
    category: 'Cat A',
    assignedLivingUnit: {
      agencyId: 'LEI',
      locationId: -8,
      description: 'A-1-6',
      agencyName: 'LEEDS',
    },
    facialImageId: -10,
    age: 60,
    physicalAttributes: {
      gender: 'Male',
      ethnicity: 'White: British',
      heightFeet: 6,
      heightInches: 6,
      heightMetres: 1.98,
      heightCentimetres: 198,
      weightPounds: 235,
      weightKilograms: 107,
      sexCode: 'M',
      raceCode: 'W1',
    },
    physicalCharacteristics: [
      {
        type: 'COMPL',
        characteristic: 'Complexion',
        detail: 'Fair',
      },
    ],
    profileInformation: [
      {
        type: 'IMM',
        question: 'Interest to Immigration?',
        resultValue: 'No',
      },
      {
        type: 'RELF',
        question: 'Religion',
        resultValue: 'Metodist',
      },
      {
        type: 'SMOKE',
        question: 'Is the Offender a smoker?',
        resultValue: 'No',
      },
    ],
    physicalMarks: [],
    assessments: [],
    assignedOfficerId: -2,
  }

  return fullInfo ? full : basic
}

module.exports = {
  stubUser: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/users/me',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          firstName: 'JAMES',
          lastName: 'STUART',
          activeCaseLoadId: 'MDI',
        },
      },
    })
  },
  stubUserCaseloads: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/users/me/caseLoads',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [
          {
            caseLoadId: 'MDI',
            description: 'Moorland',
          },
        ],
      },
    })
  },
  stubOffenderDetails: fullInfo => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/offenderNo/A1234AJ?fullInfo=${fullInfo}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: createOffenderDetails(fullInfo),
      },
    })
  },
  stubOffenders: () => {
    return stubFor({
      request: {
        method: 'POST',
        urlPattern: `/api/bookings/offenders`,
        bodyPatterns: [{ equalToJson: ['A1234AC'] }],
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [
          {
            offenderNo: 'A1234AC',
            firstName: 'NORMAN',
            lastName: 'SMITH',
            agencyId: 'MDI',
            dateOfBirth: '2000-12-26',
          },
        ],
      },
    })
  },
  stubLocation: locationId => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/locations/${locationId}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          description: 'ASSO A Wing',
        },
      },
    })
  },
  stubLocations: agencyId => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/agencies/${agencyId}/locations`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [
          {
            locationId: 1,
            locationType: 'RESI',
            description: 'RES',
            agencyId: 'MDI',
            currentOccupancy: 0,
            locationPrefix: 'MDI-RES',
            userDescription: 'Residential',
          },
          {
            locationId: 27233,
            locationType: 'SPOR',
            description: 'GYM-5-A-SIDE COM',
            agencyId: 'MDI',
            parentLocationId: 1,
            currentOccupancy: 0,
            locationPrefix: 'MDI-GYM-5-A-SIDE COM',
            userDescription: '5-a-side Com',
          },
          {
            locationId: 27187,
            locationType: 'ADJU',
            description: 'RES-MCASU-MCASU',
            agencyId: 'MDI',
            parentLocationId: 1,
            currentOccupancy: 0,
            locationPrefix: 'MDI-RES-MCASU-MCASU',
            userDescription: 'Adj',
          },
          {
            locationId: 357591,
            locationType: 'ASSO',
            description: 'RES-HB6-HB6ASSO A',
            agencyId: 'MDI',
            parentLocationId: 1,
            currentOccupancy: 0,
            locationPrefix: 'MDI-RES-HB6-HB6ASSO A',
            userDescription: 'Asso A Wing',
          },
          {
            locationId: 357592,
            locationType: 'ASSO',
            description: 'RES-HB6-HB6ASSO B',
            agencyId: 'MDI',
            parentLocationId: 1,
            currentOccupancy: 0,
            locationPrefix: 'MDI-RES-HB6-HB6ASSO B',
            userDescription: 'Asso B Wing',
          },
        ],
      },
    })
  },
  stubImage: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/images/.+/data',
      },
      response: {
        status: 404,
      },
    })
  },
  stubIEP: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/bookings/.+/iepSummary',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          bookingId: -10,
          iepDate: '2017-09-06',
          iepTime: '2017-09-06T09:44:01',
          iepLevel: 'Standard',
          daysSinceReview: 252,
          iepDetails: [],
        },
      },
    })
  },
  stubAliases: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/bookings/.+/aliases',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [],
      },
    })
  },
  stubAlertTypes: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/reference-domains/alertTypes',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: alertTypes,
      },
    })
  },
  stubOffenderAddresses: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/offenders/A1234AJ/addresses',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [
          {
            flat: '7',
            premise: 'premises',
            street: 'street name',
            town: 'Barnsley',
            postalCode: 'LS1 XXX',
            county: 'South Yorkshire',
            country: 'England',
            comment: 'comment text goes here',
            primary: true,
            noFixedAddress: false,
          },
          {
            primary: false,
            noFixedAddress: true,
          },
        ],
      },
    })
  },
  stubWhereabouts: enabled => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/agencies/.+/locations/whereabouts',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: { enabled },
      },
    })
  },
  stubStaffRolesForKeyWorker: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/staff/.+/.+/roles',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [
          {
            role: 'KW',
            roleDescription: 'Key Worker',
          },
        ],
      },
    })
  },
  stubBookingAlerts: bookingId => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/bookings/${bookingId}/alerts`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'total-records': '40',
          'page-offset': '0',
          'page-limit': '20',
        },
        jsonBody: [
          {
            alertId: 1,
            alertCode: 'alertCode1',
            alertCodeDescription: 'alertCodeDescription1',
            alertType: 'alertType1',
          },
          {
            alertId: 2,
            alertCode: 'alertCode2',
            alertCodeDescription: 'alertCodeDescription2',
            alertType: 'alertType2',
          },
        ],
      },
    })
  },
}
