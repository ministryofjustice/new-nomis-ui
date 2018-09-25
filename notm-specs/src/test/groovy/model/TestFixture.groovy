package model

import geb.Browser
import mockapis.Elite2Api
import mockapis.OauthApi
import pages.HomePage
import pages.LoginPage

import static model.UserAccount.ITAG_USER

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

        browser.to LoginPage
        oauthApi.stubValidOAuthTokenRequest currentUser
        elite2Api.stubGetMyDetails currentUser
        browser.page.loginAs currentUser, 'password'

        browser.at HomePage
    }
}