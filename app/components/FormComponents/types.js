import { shape, bool, string } from 'prop-types'

export const metaType = shape({ touched: bool, error: string })
export const inputType = shape({ name: string.isRequired, value: string })
