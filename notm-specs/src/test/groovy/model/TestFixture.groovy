package model

import geb.Browser
import mockapis.Elite2Api
import mockapis.OauthApi
import pages.HomePage

class TestFixture {

    Browser browser
    Elite2Api elite2Api
    OauthApi oauthApi
    UserAccount currentUser

    TestFixture(Browser browser, Elite2Api elite2Api, OauthApi oauthApi) {
        this.browser = browser
        this.elite2Api = elite2Api
        this.oauthApi = oauthApi
    }

    def loginAs(UserAccount user) {
        currentUser = user

        oauthApi.stubValidOAuthTokenLogin()
        oauthApi.stubUsersMe currentUser
        oauthApi.stubUserRoles()
        elite2Api.stubGetMyDetails currentUser

        browser.to HomePage
    }

    def loginAsKeyworker(UserAccount user) {
      currentUser = user

      oauthApi.stubValidOAuthTokenLogin()
      oauthApi.stubUsersMe currentUser
      oauthApi.stubUserRoles()
      elite2Api.stubGetMyDetailsForKeyWorker currentUser

      browser.to HomePage
    }
}