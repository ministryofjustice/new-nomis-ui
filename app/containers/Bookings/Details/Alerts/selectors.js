import PropTypes from 'prop-types'

export default () => state =>
  state
    .getIn(['eliteApiLoader', 'AlertTypes'])
    .toJS()
    .sort((a, b) => {
      const x = a.description.toUpperCase()
      const y = b.description.toUpperCase()
      if (x > y) return 1
      if (x < y) return -1
      return 0
    })
    .map(({ code, description }) => ({
      value: code,
      label: `${description} (${code})`,
    }))

export const alertTypesType = PropTypes.arrayOf(
  PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })
)

export const alertTypesFilterType = PropTypes.shape({
  alertType: PropTypes.string.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
})
