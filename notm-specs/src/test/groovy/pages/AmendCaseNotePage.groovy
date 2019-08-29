package pages

import geb.Page
import geb.module.Textarea
import modules.ErrorsModule

class AmendCaseNotePage extends Page {

  static at = {
    title == 'Amend case note - Digital Prison Services'
    headingText == 'Amend case note'
  }

  static content = {
    errors { module(ErrorsModule) }
    headingText { $("[data-qa=\'page-heading-text\']").text() }
    form { $('form') }
    textareaElement { $('textarea') }
    saveButton { $('button', type: 'submit') }
  }

  def amendCaseNote() {
    textareaElement.module(Textarea).text = 'some text'
    saveButton.click()
  }
}