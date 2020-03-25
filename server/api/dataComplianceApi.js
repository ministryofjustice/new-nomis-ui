const dataComplianceApiFactory = (client, enabled) => {
  const map404ToFalse = error => {
    if (!error.response) throw error
    if (!error.response.status) throw error
    if (error.response.status !== 404) throw error
    return false
  }

  const isOffenderRecordRetained = (context, offenderNo) => {
    if (!enabled) {
      return false
    }

    return client
      .get(context, `/retention/offenders/${offenderNo}`)
      .then(response => true)
      .catch(map404ToFalse)
  }

  return {
    isOffenderRecordRetained,
  }
}

module.exports = { dataComplianceApiFactory }
