import React from 'react'
import PropTypes from 'prop-types'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import { TextAreaField } from '@govuk-react/text-area'
import { inputType, metaType } from '../../../types'

const TextArea = ({ input, title, meta: { touched, error }, placeholder }) => {
  const hasError = touched && error

  return (
    <Label error={hasError} mb={6}>
      <LabelText>{title}</LabelText>
      {hasError && <div className="error-message">{error}</div>}
      <TextAreaField
        id={input.name}
        autoComplete="off"
        placeholder={placeholder}
        rows="10"
        error={hasError}
        {...input}
      />
    </Label>
  )
}

TextArea.propTypes = {
  input: inputType.isRequired,
  title: PropTypes.string,
  meta: metaType.isRequired,
  placeholder: PropTypes.string,
}

TextArea.defaultProps = {
  title: '',
  placeholder: '',
}

export default TextArea
