import { Map, List } from 'immutable'

export const Model = Map({
  bookingId: 0,
  bookingNo: '',
  offenderNo: '',
  firstName: '',
  lastName: '',
  agencyId: '',
  assignedLivingUnitId: 0,
  activeFlag: false,
  religion: '',
  alertsCodes: List([]),
  activeAlertCount: 0,
  inactiveAlertCount: 0,
  assignedLivingUnit: Map({
    agencyId: '',
    locationId: 0,
    description: '',
    agencyName: '',
  }),
  facialImageId: 0,
  dateOfBirth: '',
  age: 0,
  physicalAttributes: Map({
    gender: '',
    ethnicity: '',
    heightFeet: 0,
    heightInches: 0,
    heightMetres: 0,
    heightCentimetres: 0,
    weightPounds: 0,
    weightKilograms: 0,
    sexCode: '',
    raceCode: '',
  }),
  physicalCharacteristics: List([]),
  profileInformation: List([]),
  physicalMarks: List([]),
  assessments: List([]),
  assignedOfficerId: 0,
  iepLevel: '',
  csra: '',
  aliases: List([]),
})

export function transform(data) {
  return Model.mergeDeepWith((prev, next) => {
    if (!next) {
      return prev
    }
    return next
  }, data)
}
