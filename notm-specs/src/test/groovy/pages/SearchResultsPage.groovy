package pages

import geb.Page

import model.UserAccount
import modules.ErrorsModule

class SearchResultsPage extends Page {

    static url = '/results'

    static at = {
        title == 'Prison-NOMIS'
        headingText == 'Search Results'
    }

    static content = {
        errors { module(ErrorsModule) }
        headingText { $('h1').text() }
    }
}