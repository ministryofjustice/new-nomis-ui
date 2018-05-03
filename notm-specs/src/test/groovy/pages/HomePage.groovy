package pages

import geb.Page

import modules.ErrorsModule;
import modules.HeaderModule;

class HomePage extends Page {

    static url = '/'

    static at = {
        title == 'Prison-NOMIS'
        headingText == 'Hello Api'
    }

    static content = {
        errors { module(ErrorsModule) }
        header(required: false) { module(HeaderModule) }
        headingText { $('.heading-xlarge').text() }
    }
}