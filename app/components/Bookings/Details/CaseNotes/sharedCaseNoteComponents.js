import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';

import {
  DateBlock,
  TimeBlock,
  TypeDescription,
} from './listItem.theme';

export const DateTimeBlock = ({ dateTime }) => <div>
  <DateBlock>
    <FormattedDate value={Date.parse(dateTime)} />
  </DateBlock>
  <TimeBlock>
    <FormattedTime value={Date.parse(dateTime)} />
  </TimeBlock>
</div>;

DateTimeBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
};

export const TypeDescriptionBlock = ({ typeDetails }) => {
  const { typeDescription, subTypeDescription } = typeDetails;
  return (<TypeDescription>
    {typeDescription} - {subTypeDescription}
  </TypeDescription>);
};

TypeDescriptionBlock.propTypes = {
  typeDetails: PropTypes.object.isRequired,
};