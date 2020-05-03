const pathfinderApiFactory = client => {
  const map404ToFalse = error => {
    if (!error.response) throw error
    if (!error.response.status) throw error
    if (error.response.status !== 404) {
      throw error
    }
    return null
  }

  const getPathfinderId = async (context, offenderNo) => {
    try {
      const responseData = await client.getClientAuthed(context, `/pathfinder/offender/${offenderNo}`)
      return responseData.body.id
    } catch (err) {
      return map404ToFalse(err)
    }
  }

  return {
    getPathfinderId,
  }
}

module.exports = { pathfinderApiFactory }
