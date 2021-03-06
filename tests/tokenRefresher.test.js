/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const contextProperties = require('../server/contextProperties')
const tokenRefresher = require('../server/tokenRefresher')

const ACCESS_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IlBCRUxMIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImV4cCI6MTUzMDAzMTYzMywiYXV0aG9yaXRpZXMiOlsiUk9MRV85NjIiLCJST0xFX0xJQ0VOQ0VfQ0EiLCJST0xFXzEwMCIsIlJPTEVfMjAyIl0sImp0aSI6IjkzMWEyNDIyLTRkNDYtNGVjMC1iZmJjLWFjMjVlYjIyMjYzYiIsImNsaWVudF9pZCI6ImVsaXRlMmFwaWNsaWVudCJ9.Wej_D4Coa_nogBNX_pzgNbKX4VTMJFIdLSns0NOAMeiNlV8GAJbWGE3IpeCKkDTVhRonvNq3TVmtsBopVgUuF7-80sxzf4Bwjdjx50s3F4MUxbCPEF8oEIEuN1WWf9ofQuHic8BICotQRq8ZvkbP8eUHMx-72o96WV32qBrryaz8rhjE5KPPq_01fgr5w_dzx2Kzw6pwBjjK-aD3X1RGm1WAIdCe_-MwV1-M5h52s3wif9z8twhK7TXNHxaAYRJb-BYzQtXzi7VYjhrWXh3tpcBYL0YIH0AcoCenE6FJi-pjK1yS5Igbnlc9SgU2FdPIv0XHxRTYnOsdUb5cZXdsiQ'
const EXPIRY_TIME = 1530031633

describe('JWT access token refresh', () => {
  it('Token has not expired before EXPIRY_TIME', () => {
    expect(tokenRefresher.tokenExpiresBefore(ACCESS_TOKEN, EXPIRY_TIME)).to.be.false
  })

  it('Token has expired before EXPIRY_TIME + 1', () => {
    expect(tokenRefresher.tokenExpiresBefore(ACCESS_TOKEN, EXPIRY_TIME + 1)).to.be.true
  })

  const stubOauthRefresh = () => Promise.resolve({ access_token: 'accessRefreshed', refresh_token: 'refreshRefreshed' })

  it("Will refresh the context tokens if they have less than 'secondsToExpiry' to live", () => {
    // Build a refreshTokens function, passing in a stub for the oauth refresh function.
    const refreshTokens = tokenRefresher.factory(stubOauthRefresh, 60)

    const context = {}
    contextProperties.setTokens({ access_token: ACCESS_TOKEN, refresh_token: 'XXX' }, context)

    const nowInSeconds = EXPIRY_TIME - 59

    return refreshTokens(context, nowInSeconds).then(() => {
      expect(contextProperties.getAccessToken(context)).to.be.equal('accessRefreshed')
      expect(contextProperties.getRefreshToken(context)).to.be.equal('refreshRefreshed')
    })
  })

  it("Will not refresh the context tokens if they have at least 'secondsToExpiry' to live", () => {
    const refreshTokens = tokenRefresher.factory(stubOauthRefresh, 60)

    const context = {}
    contextProperties.setTokens({ access_token: ACCESS_TOKEN, refresh_token: 'XXX' }, context)

    const nowInSeconds = EXPIRY_TIME - 60

    return refreshTokens(context, nowInSeconds).then(() => {
      // Original tokens because they have not been refreshed.
      expect(contextProperties.getAccessToken(context)).to.be.equal(ACCESS_TOKEN)
      expect(contextProperties.getRefreshToken(context)).to.be.equal('XXX')
    })
  })
})
