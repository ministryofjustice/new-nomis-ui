package pages

import geb.Page
import geb.module.Textarea
import modules.ErrorsModule

class AddCaseNotePage extends Page {

  static at = {
    title == 'Add new case note - Digital Prison Services'
    headingText == 'Add new case note'
  }

  static content = {
    errors { module(ErrorsModule) }
    headingText { $("[data-qa=\'page-heading-text\']").text() }
    form { $('form') }
    type { $('select', name: 'typeValue') }
    subType { $('select', name: 'subTypeValue') }
    textareaElement { $('textarea') }
    datePicker(required: false) { $('div.date-picker-component') } // click this to get picker
    days { $('td.rdtDay') } // days on picker, click to set date
    hours { $('select', name: 'hours') } // options 00, 01, 02 etc
    minutes { $('select', name: 'minutes') } // options 00, 05, 10 etc
    saveButton { $('button', type: 'submit') }
    changeDateTime { $("[data-qa=\'change-date-time\']") }
    typeSelectValue { $('form select')[0].value() }
    subTypeSelectValue { $('form select')[1].value() }

  }

  def createNewCaseNote(type = 'CHAP', subType = 'FAITH', text = 'some text') {
    waitFor { form.find('select[name="typeValue"] option', value: type).displayed }
    form.typeValue = type
    waitFor { form.find('select[name="subTypeValue"] option', value: subType).displayed }
    textareaElement.module(Textarea).text = text
    changeDateTime.click()
    waitFor { datePicker.displayed }
    datePicker.click()
    days[0].click() // select 1st of this month for now
    form.hours = "07"
    form.minutes = "00"
    form.subTypeValue = subType
    saveButton.click()
  }

  def createNewCaseNoteLeavingTypeAndSubType() {
    textareaElement.module(Textarea).text = 'some text'

    changeDateTime.click()
    waitFor { datePicker.present }
    datePicker.click()
    days[0].click() // select 1st of this month for now
    form.hours = "07"
    form.minutes = "00"
    saveButton.click()
  }
}