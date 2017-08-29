import React from 'react';
import { toFullName } from 'utils/stringUtils';

const Name = ({firstName, lastName, name}) =>
  <span>{toFullName({firstName, lastName, name})}</span>;

export default Name;
