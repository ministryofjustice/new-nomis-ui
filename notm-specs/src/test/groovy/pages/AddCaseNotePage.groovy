package pages

import geb.Page
import geb.module.Textarea
import modules.ErrorsModule

class AddCaseNotePage extends Page {

  static at = {
    title == 'Prison-NOMIS'
    headingText == 'Add new case note'
  }

  static content = {
    errors { module(ErrorsModule) }
    headingText { $('h1.bold-large').text() }
    form { $('form')}
    type { $('select', name: 'typeValue') }
    subType { $('select', name: 'subtypeValue') }
    textareaElement { $('textarea') }
    datePicker { $('div.date-picker-component') } // click this to get picker
    days { $('td.rdtDay') } // days on picker, click to set date
    hours { $('select', name: 'hours') } // options 00, 01, 02 etc
    minutes { $('select', name: 'minutes') } // options 00, 05, 10 etc
    saveButton { $('button', type: 'submit') }
  }

  def createNewCaseNote(text) {
    def textarea = textareaElement.module(Textarea)
    textarea.text = text
    form.typeValue = "Chaplaincy"
    form.subTypeValue = "Faith Specific Action"
    datePicker.click()
    days[0].click() // select 1st of this month for now
    form.hours = "07"
    form.minutes = "00"
    saveButton.click()
  }
}