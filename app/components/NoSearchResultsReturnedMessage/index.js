import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const NoSearchResultsReturnedMessage = ({ resultCount }) =>
  resultCount === 0 ? (
    <h1 className="bold-medium">
      <FormattedMessage {...messages.header} />
    </h1>
  ) : null

NoSearchResultsReturnedMessage.propTypes = {
  resultCount: PropTypes.number.isRequired,
}

export default NoSearchResultsReturnedMessage
