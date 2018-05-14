import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment';

export const FormattedDate = injectIntl(
  ({ value, intl }) => {
    const m = moment(value);
    m.locale(intl.locale);
    return (
        <span>{m.format('L')}</span>
    )
  });

export const FormattedTime = injectIntl(
  ({ value, intl }) => {
    const m = moment(value);
    m.locale(intl.locale);
    return (
        <span>{m.format('LT')}</span>
    )
  });

FormattedDate.propTypes = {
  value: PropTypes.string.isRequired,
};

FormattedTime.propTypes = {
  value: PropTypes.string.isRequired,
};
