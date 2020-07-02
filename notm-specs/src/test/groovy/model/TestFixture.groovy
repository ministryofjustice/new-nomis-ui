package model

import geb.Browser
import mockapis.Elite2Api
import mockapis.OauthApi
import mockapis.TokenVerificationApi
import mockapis.WhereaboutsApi
import mockapis.response.AccessRoles
import pages.HomePage

class TestFixture {

    Browser browser
    Elite2Api elite2Api
    WhereaboutsApi whereaboutsApi
    OauthApi oauthApi
    TokenVerificationApi tokenVerificationApi

    UserAccount currentUser

    TestFixture(Browser browser, Elite2Api elite2Api, WhereaboutsApi whereaboutsApi, OauthApi oauthApi, TokenVerificationApi tokenVerificationApi) {
        this.browser = browser
        this.elite2Api = elite2Api
        this.whereaboutsApi = whereaboutsApi
        this.oauthApi = oauthApi
        this.tokenVerificationApi = tokenVerificationApi
    }

    def loginAs(UserAccount user, def roles = [AccessRoles.omicAdmin, AccessRoles.globalSearch, AccessRoles.addBulkAppointments]) {
        currentUser = user

        oauthApi.stubValidOAuthTokenLogin()
        oauthApi.stubUsersMe currentUser
        oauthApi.stubUserRoles(roles)
        oauthApi.stubClientTokenRequest()
        elite2Api.stubGetMyDetails currentUser
        whereaboutsApi.stubGetMyDetails currentUser
        tokenVerificationApi.stubVerifyToken()

        browser.to HomePage
    }

    def loginAsKeyworker(UserAccount user) {
      currentUser = user

      oauthApi.stubValidOAuthTokenLogin()
      oauthApi.stubUsersMe currentUser
      oauthApi.stubUserRoles()
      elite2Api.stubGetMyDetailsForKeyWorker currentUser
      whereaboutsApi.stubGetMyDetailsForKeyWorker currentUser
      tokenVerificationApi.stubVerifyToken()

      browser.to HomePage
    }
}