const groupBy = (property, array) =>
  array.reduce((result, current) => {
    const items = result[current[property]] || []
    return {
      ...result,
      [current[property]]: [...items, current],
    }
  }, {})

const extractProperties = (properties, data) =>
  properties.filter(p => data[p]).reduce(
    (previous, current) => ({
      ...previous,
      [current]: data[current],
    }),
    {}
  )

module.exports = {
  groupBy,
  extractProperties,
}
