package pages

import geb.Page


class HomePage extends Page {

    static url = '/'

    static at = {
        title == 'Prison-NOMIS'
        headingText == 'Hello Api'
    }

    static content = {
        errors { module(ErrorsModule) }
        headingText { $('.heading-xlarge').text() }
    }
}