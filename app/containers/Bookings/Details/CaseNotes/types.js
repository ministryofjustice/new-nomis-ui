import { shape, number } from 'prop-types'

const caseNoteQueryType = shape({
  pageNumber: number.isRequired,
  perPage: number.isRequired,
})

export default caseNoteQueryType
