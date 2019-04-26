package pages

import geb.module.Select
import geb.module.Textarea
import modules.ErrorsModule

import java.time.LocalDate

class AddAppointmentPage extends DatePickerPage {
  static at = {
    title == 'Add new appointment - Digital Prison Services'
    headingText == 'Add new appointment'
    !spinner.displayed
  }

  static content = {
    spinner(required: false) { $('.spinner-component') }
    errors { module(ErrorsModule) }
    headingText { $("[data-qa=\'page-heading-text\']").text() }
    nameHeading { $("[data-qa=\'offender-name\']", 0) }
    form { $('form') }
    type { $('select', name: 'appointmentType') }
    location { $('select', name: 'location') }
    textareaElement { $('textarea') }
    datePicker { $('div.date-picker-component') } // click this to get picker
    days { $('td.rdtDay') } // days on picker, click to set date
    startHours { $('#startTime') } // options 00, 01, 02 etc
    // minutes are optional
    saveButton { $('button', type: 'submit') }
    otherEvents { $('#other-events [data-qa=\'event\']') }
    recurringAppointmentCheckbox { $('input', name: 'recurringAppointment') }
    repeatPeriod { $('select', name: 'repeatPeriod') }
    repeatCount { $('input', name: 'repeatCount') }
  }

  def createNewAppointment(text) {
    form.appointmentType = "Gym - Football"
    form.location = "F4 Classroom"

    def tomorrow = LocalDate.now().plusDays(1)
    setDatePicker(tomorrow.year, tomorrow.monthValue, tomorrow.day)
    startHours.module(Select).value("09")

    def textarea = textareaElement.module(Textarea)
    textarea.text = text

    saveButton.click()
  }
}