
package modules

import geb.Module

class HeaderModule extends Module {

    static content = {
        dropDown   { $('.header-content .clickable') }
        logoutLink { $('a', text: 'Log out' ) }
    }

    def logout() {
        dropDown.click()
        waitFor { logoutLink.displayed }
        logoutLink.click()
    }

}