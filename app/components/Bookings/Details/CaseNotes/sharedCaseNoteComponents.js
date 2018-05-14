import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime, injectIntl } from 'react-intl';
import { FormattedDate as FormattedDate2, FormattedTime as FormattedTime2 } from 'components/intl'
import moment from 'moment';

import {
  TypeDescription,
} from './listItem.theme';

export const DateTimeBlock = ({ dateTime }) => <div>
  <span>
    <FormattedDate value={Date.parse(dateTime)} />
  </span>
  <span>
    {' - '}
  </span>
  <span>
    <FormattedTime value={Date.parse(dateTime)} />
  </span>
</div>;

export const DateTimeBlock2 = injectIntl(
  ({ dateTime, intl }) => {
    const m = moment(dateTime);
    m.locale(intl.locale);
    return (
      <div>
        <span><FormattedDate2 value={dateTime} /></span>
        <span>{' - '}</span>
        <span><FormattedTime2 value={dateTime} /></span>
      </div>
    )
  });


DateTimeBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
};

DateTimeBlock2.propTypes = {
  dateTime: PropTypes.string.isRequired,
};

export const TypeDescriptionBlock = ({ typeDetails }) => {
  const { typeDescription, subTypeDescription } = typeDetails;
  return (<TypeDescription>
    {typeDescription} {'|'} {subTypeDescription}
  </TypeDescription>);
};

TypeDescriptionBlock.propTypes = {
  typeDetails: PropTypes.object.isRequired,
};