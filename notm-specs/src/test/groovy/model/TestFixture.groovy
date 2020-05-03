package model

import geb.Browser
import mockapis.Elite2Api
import mockapis.OauthApi
import mockapis.WhereaboutsApi
import mockapis.response.AccessRoles
import pages.HomePage

class TestFixture {

    Browser browser
    Elite2Api elite2Api
    WhereaboutsApi whereaboutsApi
    OauthApi oauthApi
    UserAccount currentUser

    TestFixture(Browser browser, Elite2Api elite2Api, WhereaboutsApi whereaboutsApi, OauthApi oauthApi) {
        this.browser = browser
        this.elite2Api = elite2Api
        this.whereaboutsApi = whereaboutsApi
        this.oauthApi = oauthApi
    }

    def loginAs(UserAccount user, def roles = [AccessRoles.omicAdmin, AccessRoles.globalSearch, AccessRoles.addBulkAppointments]) {
        currentUser = user

        oauthApi.stubValidOAuthTokenLogin()
        oauthApi.stubUsersMe currentUser
        oauthApi.stubUserRoles(roles)
        oauthApi.stubClientTokenRequest()
        elite2Api.stubGetMyDetails currentUser
        whereaboutsApi.stubGetMyDetails currentUser

        browser.to HomePage
    }

    def loginAsKeyworker(UserAccount user) {
      currentUser = user

      oauthApi.stubValidOAuthTokenLogin()
      oauthApi.stubUsersMe currentUser
      oauthApi.stubUserRoles()
      elite2Api.stubGetMyDetailsForKeyWorker currentUser
      whereaboutsApi.stubGetMyDetailsForKeyWorker currentUser

      browser.to HomePage
    }
}