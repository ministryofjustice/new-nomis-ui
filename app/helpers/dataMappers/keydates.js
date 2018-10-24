import { Map, List } from 'immutable'

export const Model = Map({
  iepLevel: '',
  daysSinceReview: 0,
  sentence: Map({
    startDate: '',
    additionalDaysAwarded: 0,
    dtoReleaseDates: List([]),
    nonDtoReleaseDate: Map({
      label: '',
      value: '',
    }),
    sentenceExpiryDates: List([]),
  }),
  other: Map({
    dates: List([]),
  }),
  reCategorisationDate: '',
})

export function transform(data) {
  return Model.mergeDeepWith((prev, next) => {
    if (!next) {
      return prev
    }
    return next
  }, data)
}
