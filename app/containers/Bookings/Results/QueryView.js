import React from 'react'
import PropTypes from 'prop-types'
import Button, { ButtonRow } from 'components/Button'
import { InputLabel } from 'components/FormComponents/Input/input.theme'
import { QueryWrapper, QueryItemHolder, QueryValue } from './query.theme'

const QueryView = props => {
  const { initialValues, onSubmit } = props
  const firstName = initialValues.firstName ? initialValues.firstName : ''
  const lastName = initialValues.lastName ? initialValues.lastName : ''
  const offenderNo = initialValues.offenderNo ? initialValues.offenderNo : null

  return (
    <QueryWrapper>
      <QueryItemHolder>
        <InputLabel htmlFor="firstName">First Name</InputLabel>
        <QueryValue>{firstName}</QueryValue>
      </QueryItemHolder>
      <QueryItemHolder>
        <InputLabel htmlFor="lastName">Last Name</InputLabel>
        <QueryValue>{lastName}</QueryValue>
      </QueryItemHolder>
      <QueryItemHolder>
        <InputLabel htmlFor="offenderNo">Noms #</InputLabel>
        <QueryValue>{offenderNo}</QueryValue>
      </QueryItemHolder>
      <ButtonRow>
        <Button type="submit" buttonstyle="link" onClick={onSubmit}>
          Modify
        </Button>
      </ButtonRow>
    </QueryWrapper>
  )
}

QueryView.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default QueryView
