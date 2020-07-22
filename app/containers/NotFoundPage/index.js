import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const NotFound = ({ offenderNo }) => (
  <h1>
    {offenderNo}
    <FormattedMessage {...messages.header} />
  </h1>
)

export default NotFound
