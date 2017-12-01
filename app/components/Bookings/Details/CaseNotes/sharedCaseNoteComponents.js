import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';

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

DateTimeBlock.propTypes = {
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