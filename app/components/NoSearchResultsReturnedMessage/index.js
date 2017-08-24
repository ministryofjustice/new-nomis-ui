import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const NoSearchResultsReturnedMessage = ({resultCount}) => (resultCount === 0) ?
  <h1 className="bold-medium">
     <FormattedMessage {...messages.header} />
  </h1> : null

export default NoSearchResultsReturnedMessage;
