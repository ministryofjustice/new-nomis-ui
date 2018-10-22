const selectAlertTypes = () => state =>
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

export { selectAlertTypes }
