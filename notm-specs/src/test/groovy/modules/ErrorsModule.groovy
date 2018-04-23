package modules

import geb.Module

class ErrorsModule extends Module {

    static content = {
        message { $('.error-summary').text() }
    }
}