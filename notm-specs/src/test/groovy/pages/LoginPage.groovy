package pages

import geb.Page

import model.UserAccount
import modules.ErrorsModule

class LoginPage extends Page {

    static url = '/login'

    static at = {
        title == 'Prison-NOMIS'
        headingText == 'Login'
    }

    static content = {
        errors { module(ErrorsModule) }
        headingText { $('h1').text() }
        signInButton{ $("button", type: 'submit') }
    }

    void loginAs(UserAccount userAccount, String password) {

        $('form').username = userAccount.username
        $('form').password = password

        assert signInButton.text() == 'Sign in'

        signInButton.click()
    }

}