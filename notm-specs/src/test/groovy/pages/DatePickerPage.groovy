package pages

import geb.Page

abstract class DatePickerPage extends Page {

    static content = {
        date { $('#eventDate') }
        topBar { $('th.rdtSwitch') }
        yearBox { value -> $('td', 'data-value': String.valueOf(value)) }
        monthBox { value -> $('td', 'data-value': String.valueOf(value-1)) } // text: String.valueOf(value)) }
        dayBox { value -> $('td.rdtDay:not(.rdtOld):not(.rdtNew)', 'data-value': String.valueOf(value)) }
    }

    void setDatePicker(year, month, day) {
        date.click()
        topBar.click()
        topBar.click()
        yearBox(year).click()
        monthBox(month).click()
        dayBox(day).click()
    }
}
