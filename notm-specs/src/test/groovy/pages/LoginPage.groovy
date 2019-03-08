package pages

import geb.Page
import model.UserAccount
import modules.ErrorsModule

class LoginPage extends Page {

    static url = '/login'

    static at = {
        title == 'Prison NOMIS'
        headingText == 'Sign in'
    }

    static content = {
        errors { module(ErrorsModule) }
        headingText { $('h1').text() }
        signInButton{ $("input", type: 'submit') }
    }

    void loginAs(UserAccount userAccount, String password) {

        $('form').username = userAccount.username
        $('form').password = password

        assert signInButton.value() == 'Sign in'

        signInButton.click()
    }

}